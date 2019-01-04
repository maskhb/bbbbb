import { PureComponent } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { message } from 'antd';
import runNext from 'utils/runNext';
import { getPreRoomList } from 'viewmodels/GresDetailVO';
import { goTo } from 'utils/utils';
import {
  mergeRoomTypeAndRate, mergeRoomTypeAndRateByDate, transformArrivalDate,
  transformDepartureDate, checkRemainRoom, formatDateRoomType,
  formatDateRoomList, checkRemainRoomRepeat, getGresSelectRoomType,
  getRoomTypeAndRate, GresAccountTotalResp, getAddServiceOrdersByDate,
} from 'viewmodels/GresDetailResp';
import { plainToClassFromExist } from 'class-transformer/index';

export default class view extends PureComponent {
  getCurRoomList = (roomTypeId, arrivalDepartureDate) => {
    const { checkIn: { gresSelectRoom } } = this.props;
    const arrivalDate = transformArrivalDate(arrivalDepartureDate[0]).valueOf();
    const departureDate = transformDepartureDate(arrivalDepartureDate[1]).valueOf();
    const keyName = `s_${roomTypeId}_${moment(arrivalDate).format('YYYYMMDD')}_${moment(departureDate).format('YYYYMMDD')}`;

    return (gresSelectRoom && gresSelectRoom[keyName]) || [];
  }

  getRoomNo = (roomId, roomTypeId, arrivalDepartureDate) => {
    const { checkIn: { gresSelectRoom, gresDetails } } = this.props;

    const curRoomList = (gresSelectRoom && this.getCurRoomList(
      roomTypeId, arrivalDepartureDate)) || [];
    return _.find(curRoomList, (item) => {
      return item.roomId === roomId;
    })?.roomNo || gresDetails?.roomNo;
  }

  init = () => {
    const { dispatch, checkIn: { gresDetails }, accTypeMap } = this.props;
    const accountInfo = _.map(Array.from(accTypeMap), (item) => {
      return plainToClassFromExist(new GresAccountTotalResp(), {
        ...(_.find(gresDetails?.accountInfo, accountItem => accountItem.accType === item[0]) || {}),
        accType: item[0],
      });
    });

    gresDetails.setAccountInfo(accountInfo);

    dispatch({
      type: 'checkIn/save',
      payload: {
        gresDetails,
      },
    });
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, values) => {
      // 对参数进行处理
      if (!error) {
        const gen = this.doSubmitOperate(values);

        runNext(gen, message.error);
      }
    });
  }

  * doSubmitOperate(defaultValues) {
    const { checkIn: { gresDetails }, isCheckIn } = this.props;
    let values = defaultValues;
    const arrKeys = _.filter(_.keys(values), key => key.match('addServiceKey__'));
    if (gresDetails?.isPreCheckIn) {
      values = _.omit(values, ['roomId', 'isChangeGuest']);
    }

    if (!isCheckIn) {
      const addServiceOrders = _.map(_.filter(values.addServiceOrders, item => item), item => ({ ..._.omit(item, 'serviceName') }));
      values = {
        ...values,
        addServiceOrders,
        assginServiceOrders: _.filter(gresDetails.assginServiceOrders,item =>
          _.find(addServiceOrders, service => service.serviceItemId === item.serviceItemId)),
      };
    }
    let p = { ...gresDetails, ..._.omit(values, arrKeys), rateCodeId: values?.rateCodeId || 0 };
    // p = yield this.checkDate(p);
    p = yield this.checkRoomTypeAndRate(p);
    if (!isCheckIn) {
      p = yield this.checkRemainRoom(p);
    }
    p = yield this.mergeAccountInfo(p);
    p = yield this.mergeTanantInfo(p);
    yield this.doAdd(p);
    yield this.showSubmitSuccess();
  }

  checkDate = (values) => {
    const { preRoomList, arrivalDepartureDate } = values;
    let minCreatedTime;
    let maxDepartureDate;
    _.forEach(preRoomList, (item) => {
      _.forEach(item.list, (room) => {
        if (!minCreatedTime || minCreatedTime > room.arrivalDate) {
          minCreatedTime = room.arrivalDate;
        }
        if (!maxDepartureDate || maxDepartureDate < room.departureDate) {
          maxDepartureDate = room.departureDate;
        }
      });
    });

    if (
      transformArrivalDate(arrivalDepartureDate[0]).valueOf()
      > transformArrivalDate(minCreatedTime).valueOf()
      ||
      transformDepartureDate(arrivalDepartureDate[1]).valueOf()
      < transformDepartureDate(maxDepartureDate).valueOf()
    ) {
      return next => next('入离店时间不能晚于预留房间的最早时间,早于预留房间的最晚时间');
    }

    return next => next('', values);
  }

  checkRoomTypeAndRate = (values) => {
    const { checkIn: { gresDetails, gresSelectRoomType, businessTime, selectedRoomTypeId },
      isCheckIn, isEdit } = this.props;
    let roomTypeAndRate = [];
    if (isCheckIn) {
      roomTypeAndRate = mergeRoomTypeAndRateByDate(
        values.roomTypeAndRate,
        gresDetails?.roomTypeAndRate,
        isEdit ? getGresSelectRoomType(this.props.checkIn, values.arrivalDepartureDate)
          : gresSelectRoomType);
      roomTypeAndRate = getAddServiceOrdersByDate(roomTypeAndRate, values.addServiceOrdersByDate, gresDetails);
    } else {
      const obj = getRoomTypeAndRate(values, gresSelectRoomType);
      const list = mergeRoomTypeAndRate(
        obj.roomTypeAndRate,
        gresDetails?.roomTypeAndRate,
        gresSelectRoomType);

      roomTypeAndRate = [];
      _.forEach(selectedRoomTypeId, (id) => {
        const arr = _.filter(list, item => item?.value?.roomTypeId === id);
        roomTypeAndRate = roomTypeAndRate.concat(arr);
      });
    }

    if (isCheckIn) {
      const arrivalDateFormat = transformArrivalDate(values.arrivalDepartureDate[0]).valueOf();
      const businessTimeFormat = transformArrivalDate(businessTime).valueOf();
      if (!isEdit && arrivalDateFormat > businessTimeFormat) {
        return next => next('不能提前入住');
      }
      if (!roomTypeAndRate[0]) {
        return next => next('请至少选择一个房间');
      }
      return next => next('', {
        ...values,
        roomTypeAndRate: { ...roomTypeAndRate, isCheckIn },
        roomTypeId: roomTypeAndRate[0]?.value?.roomTypeId,
      });
    }
    const arr = getPreRoomList(roomTypeAndRate);

    if (arr.length < 1) {
      return next => next('请至少选择一个房间');
    }

    // 预订单，把inputNumber的最大值限制去掉,不去掉，当切换时间时，库存发生变化，预留房间数量跟库存会存在问题。在此处进行判断
    // if (!isCheckIn) {
    //   const isExceed = _.find(arr, (item) => {
    //     const curRoomType = _.find(gresSelectRoomType, roomType =>
    //       roomType.roomTypeId === item.roomTypeId);
    //     return item.roomQty > curRoomType?.roomStock;
    //   });
    //
    //   if (isExceed) {
    //     return next => next(`房型：${isExceed.roomTypeName}，已预订间数不能大于最大可订间数`);
    //   }
    // }

    return next => next('', { ...values, roomTypeAndRate });
  }

  mergeAccountInfo = (values) => {
    const { checkIn: { gresDetails } } = this.props;
    const arrKeys = _.filter(_.keys(values), key => key.match('accountInfo'));
    return next => next('', { ..._.omit(values, arrKeys), accountInfo: gresDetails?.accountInfo || [] });
  }

  mergeTanantInfo = (values) => {
    const { checkIn: { gresDetails } } = this.props;

    return next => next('', { ...values, tanantInfo: values.tanantInfo || gresDetails?.tanantInfo || [] });
  }

  checkRemainRoom = (values) => {
    const isRepeat = checkRemainRoomRepeat(values);

    if (isRepeat.length) {
      const curItem = isRepeat[0];

      return next => next(`房间：${curItem.roomNo} 预留时间：${moment(curItem.arrivalDate).format('YYYY-MM-DD')} 存在重复预留`);
    }
    const isExceed = checkRemainRoom(
      formatDateRoomType(values, this.props.checkIn), formatDateRoomList(values));

    if (isExceed.length) {
      const curItem = isExceed[0];
      return next => next(`房型：${curItem.roomTypeName} 预留开始时间：${moment(curItem.arrivalDate).format('YYYY-MM-DD')} 超出了最大预留数： ${curItem.maxQty}`);
    }

    return next => next('', values);
  }

  doAdd = async (values) => {
    const { dispatch, resType, gresType, isCheckIn, checkIn: { gresDetails } } = this.props;

    dispatch({
      type: 'checkIn/save',
      payload: {
        gresAdd: null,
      },
    });

    const obj = {};

    if (isCheckIn && !gresDetails?.roomNo) {
      obj.roomNo = this.getRoomNo(values.roomId, values.roomTypeId, values?.arrivalDepartureDate);
    }
    await dispatch({
      type: 'checkIn/gresAdd',
      payload: {
        ..._.omit(values, 'addServiceOrdersByDate'),
        ...obj,
        isEdit: values.gresId,
        resType: isCheckIn ? (gresDetails?.resType || resType) : resType,
        gresType,
      },
    });
    return next => next('', values);
  }

  showSubmitSuccess = () => {
    const { pathname } = this.props.location;

    const { checkIn: { gresAdd } } = this.props;

    if (typeof gresAdd === 'number' || typeof gresAdd === 'string') {
      message.success('提交成功', 1, () => {
        goTo(pathname.split(/\/add|\/edit/)[0]);
      });
    }
    return next => next('');
  }

  goBackList = () => {
    const { pathname } = this.props.location;
    goTo(pathname.split(/\/add|\/edit/)[0]);
  }
}
