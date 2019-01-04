import React from 'react';
import _ from 'lodash';
import { Table, InputNumber, message, Row, Col, Checkbox, Button, Modal, Select, Input } from 'antd';
import {
  transformArrivalDate, transformDepartureDate, checkRemainRoomExceedStock,
  formatDateRoomTypeStock, formatDateRoomList,
} from 'viewmodels/GresDetailResp';
import qs from 'qs';
import FormItem from './FormItem';
import '../index.less';
import { div } from '../../../utils/number/index';
import { fenToYuan } from '../../../utils/money/index';
import RemainInput from './RemainInput';
import AddService from '../common/AddService';

const keyFn = (record) => {
  return `${record.roomTypeId}${record.businessDay}`;
};

const fn = dayDiff => (value, record, index) => {
  const obj = {
    children: value,
    props: {},
  };
  if (index % dayDiff === 0) {
    obj.props.rowSpan = dayDiff;
  } else {
    obj.props.rowSpan = 0;
  }
  return obj;
};
export default class RoomTypeAndRate extends React.Component {
  state = {
    resetRoomType: false,
  };

  componentDidMount() {
    const { dispatch, checkIn: { gresDetails } } = this.props;
    dispatch({
      type: 'checkIn/save',
      payload: {
        selectedRoomTypeId: _.uniq(_.map(gresDetails?.gresRoomTypeVOs, item => item.roomTypeId)),
      },
    });

    dispatch({
      type: 'checkIn/roomTypePage',
      payload: {
        roomTypeQueryVO: {
          currPage: 1,
          pageSize: 9999,
          status: 1,
        },
      },
    });

    dispatch({
      type: 'checkIn/serviceItemList',
      payload: {
        serviceItemVO: {
          source: 1,
          status: 1,
          isDelete: 0,
        },
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      checkIn: { gresDetails }, dispatch,
    } = this.props;

    const isDetail = Boolean(gresDetails?.sourceId);

    const { arrivalDepartureDate, rateCodeId } = nextProps;
    if (this.checkCanRefresh(nextProps)) {
      let hasChangeDate = true;

      if (isDetail) {
        const arrivalDepartureDateFormat = [
          arrivalDepartureDate[0] ? transformArrivalDate(arrivalDepartureDate[0]).valueOf() : 0,
          arrivalDepartureDate[0] ? transformDepartureDate(arrivalDepartureDate[1]).valueOf() : 0];

        const gresDetailDateFormat = [
          gresDetails?.arrivalDate ? transformArrivalDate(gresDetails?.arrivalDate).valueOf() : 0,
          gresDetails?.departureDate ? transformDepartureDate(gresDetails?.departureDate).valueOf()
            : 0];

        hasChangeDate = !(arrivalDepartureDateFormat[0] >= gresDetailDateFormat[0]
          && arrivalDepartureDateFormat[1] <= gresDetailDateFormat[1]);
      }

      const hasChangeRateType = rateCodeId ? gresDetails?.rateCodeId !== rateCodeId
        : Boolean(rateCodeId) !== Boolean(gresDetails?.rateCodeId);
      dispatch({
        type: 'checkIn/gresSelectRoomType',
        payload: {
          rateCodeId: rateCodeId || 0,
          arrivalDate: arrivalDepartureDate[0].valueOf(),
          departureDate: arrivalDepartureDate[1].valueOf(),
          hasChangeRateType: isDetail ? hasChangeRateType : true,
          gresRoomTypeVOs: gresDetails?.gresRoomTypeVOs || [],
          status: gresDetails?.status,
          hasChangeDate,
          gresId: gresDetails?.gresId || 0,
        },
      }).then((gresSelectRoomType) => {
        this.resetData(gresSelectRoomType);
      });
    }
  }

  setRealPrice = (record) => {
    const { form } = this.props;
    form.setFieldsValue({
      [`roomTypeAndRate._${record.businessDay}.@${record.roomTypeId}.value.realPriceFormat`]: fenToYuan(record.stdPrice, true),
    });
  }

  getRoomTypeList = () => {
    const { checkIn: { gresSelectRoomType, selectedRoomTypeId } } = this.props;
    let list = [];
    _.forEach(selectedRoomTypeId, (id) => {
      const curItem = _.filter(gresSelectRoomType, item => item.roomTypeId === id);
      if (curItem) {
        list = list.concat(curItem);
      }
    });

    return list;
  }

  getDefaultKey = (data, keyName) => {
    const { checkIn: { gresDetails } } = this.props;
    return _.map(_.get(data, keyName), (item, index) =>
      ({ id: index, disabled: (gresDetails?.sourceType === 2 && item.source === 2) }));
  }

  checkRoomQtyExceed = (gresSelectRoomType) => {
    const { form } = this.props;
    const values = form.getFieldsValue();

    const objRoomTypeAndRate = values.roomTypeAndRate;
    const arrKeys = _.filter(_.keys(objRoomTypeAndRate), key => key.match('roomQty'));

    const roomQtyExceedStock = [];
    _.forEach(arrKeys, (key) => {
      const roomQty = objRoomTypeAndRate[key];
      if (roomQty) {
        const roomTypeId = Number(key.replace('roomQty', ''));
        const curRoomType = _.find(gresSelectRoomType, roomType =>
          roomType.roomTypeId === roomTypeId);
        if (roomQty > curRoomType?.roomStock) {
          roomQtyExceedStock.push({ roomQty, roomTypeId, roomStock: curRoomType?.roomStock });
        }
      }
    });

    return roomQtyExceedStock;
  }

  checkStock = (arrivalDepartureDate, gresSelectRoomType, preRoomList) => {
    const isExceed = checkRemainRoomExceedStock(
      formatDateRoomTypeStock(arrivalDepartureDate, gresSelectRoomType),
      formatDateRoomList({ preRoomList })
    );

    if (isExceed.length) {
      const curItem = isExceed[0];
      message.warn(`房型：${curItem.roomTypeName} 库存：${curItem.maxQty} 小于已预留数： ${curItem.roomQty},无法更改入离店时间`);
      return false;
    }

    const roomQtyExceedStock = this.checkRoomQtyExceed(gresSelectRoomType);

    // 超过库存时，重置
    if (roomQtyExceedStock.length) {
      _.forEach(roomQtyExceedStock, (item) => {
        if (item) {
          this.props.form.setFieldsValue({
            [`roomTypeAndRate.roomQty${item.roomTypeId}`]: item?.roomStock,
          });
        }
      });
    }

    return true;
  }

  resetData = async (gresSelectRoomType) => {
    const { checkIn: { gresDetails }, dispatch, form } = this.props;
    const { roomId, gresId } = qs.parse(this.props?.location?.search?.replace('?', '')) || {};

    dispatch({
      type: 'checkIn/save',
      payload: {
        ...gresDetails,
        gresSelectRoomType,
      },
    });

    const { resetRoomType } = this.state;
    if (roomId && !gresId && !resetRoomType) {
      this.setState({ resetRoomType: true });
      const roomPage = await dispatch({
        type: 'checkIn/roomPage',
        payload: {
          currPage: 1,
          pageSize: 1,
          roomId,
        },
      });

      if (roomPage?.dataList?.length > 0) {
        const { checkIn } = this.props;
        const roomType = _.find(checkIn.gresSelectRoomType, item =>
          item.roomTypeId === roomPage?.dataList[0]?.roomTypeId);

        dispatch({
          type: 'checkIn/save',
          payload: {
            selectedRoomTypeId: [roomType.roomTypeId],
          },
        });
        form.setFieldsValue({
          [`roomTypeAndRate.roomQty${roomType.roomTypeId}`]: roomType?.roomStock ? 1 : 0,
        });
      }
    }
  }

  checkCanRefresh = (nextProps) => {
    const { arrivalDepartureDate = [], rateCodeId } = nextProps;

    const arrivalDepartureDateFormat = [
      arrivalDepartureDate[0] ? transformArrivalDate(arrivalDepartureDate[0]).valueOf() : 0,
      arrivalDepartureDate[0] ? transformDepartureDate(arrivalDepartureDate[1]).valueOf() : 0];

    const curArrivalDepartureDate = this.props.arrivalDepartureDate || [];

    const curArrivalDepartureDateFormat = [
      curArrivalDepartureDate[0] ? transformArrivalDate(curArrivalDepartureDate[0]).valueOf() : 0,
      curArrivalDepartureDate[0] ? transformDepartureDate(curArrivalDepartureDate[1]).valueOf() : 0,
    ];
    const propsRateCodeId = this.props.rateCodeId;

    return ((rateCodeId !== propsRateCodeId
      && (rateCodeId || Boolean(rateCodeId) !== Boolean(propsRateCodeId)))
      || (String(arrivalDepartureDateFormat) !== String(curArrivalDepartureDateFormat)
      )) && arrivalDepartureDate[0];
  }

  columns = () => {
    const { form, checkIn: { gresDetails, gresSelectRoomType } } = this.props;

    const { roomTypeId } = (gresSelectRoomType || [])[0] || {};
    const dayDiff = _.filter(gresSelectRoomType, item =>
      item.roomTypeId === roomTypeId)?.length || 0;

    const disabled = gresDetails?.sourceType === 2;

    const comp = (
      <AddService
        keyName="addServiceOrders"
        {...this.props}
        arrDefaultKey={this.getDefaultKey(gresDetails, 'addServiceOrders')}
        randomKey="addServiceOrders"
      />
    );

    return [{
      title: '房型名称',
      dataIndex: 'roomTypeName',
      render: fn(dayDiff),
    },
    {
      title: '预订间数',
      dataIndex: 'roomStock',
      align: 'center',
      render: (value, record, index) => {
        const obj = fn(dayDiff)(value, record, index);
        obj.children = (
          <div>
            <FormItem
              form={form}
              detailDefault={gresDetails}
              keyName={`roomTypeAndRate.roomQty${record.roomTypeId}`}
            >
              <RemainInput
                disabled={disabled}
                remainValue={this.checkRoomTypeHasRemain(record.roomTypeId)}
              />
            </FormItem>
            <div style={{ textAlign: 'center' }}>剩余{value}间</div>
          </div>
        );
        return obj;
      },
    }, {
      title: '日期',
      className: 'btn-set-price',
      dataIndex: 'businessDayFormat',
    }, {
      title: '参考房价',
      className: 'btn-set-price',
      dataIndex: 'stdPriceFormat',
      align: 'center',
    }, {
      title: '',
      className: 'btn-set-price no-padding',
      render: (val, record, index) => {
        return (
          <Button size="small" disabled={disabled} icon="arrow-right" onClick={this.setRealPrice.bind(this, record, index)} />
        );
      },
    }, {
      title: <span><i style={{ color: 'red' }}>* </i>实际房价</span>,
      render(val, record) {
        return (
          <FormItem
            form={form}
            detailDefault={gresDetails}
            keyName={`roomTypeAndRate._${record.businessDay}.@${record.roomTypeId}.value.realPriceFormat`}
            rules={form.getFieldValue(`roomTypeAndRate.roomQty${record.roomTypeId}`) ? [{
                required: true,
                message: '请输入自定义房价',
              }] : []}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/￥\s?|(,*)/g, '')}
              disabled={disabled}
            />
          </FormItem>
        );
      },
    }, {
      title: '套餐服务',
      width: 360,
      align: 'center',
      render: (val, record, index) => {
        const obj = fn(dayDiff)(val, record, index);
        obj.children = (
          <AddService
            disabled={disabled}
            keyName={`roomTypeAndRate.packageServiceOrders${record.roomTypeId}`}
            {...this.props}
            arrDefaultKey={this.getDefaultKey(gresDetails, `roomTypeAndRate.packageServiceOrders${record.roomTypeId}`)}
          />
        );
        return obj;
      },
    }, {
      title: '增值服务',
      width: 360,
      align: 'center',
      render: (val, record, index) => {
        return {
          children: comp,
          props: {
            rowSpan: index === 0 ? this.getRoomTypeList()?.length : 0,
          },
        };
      },
    }];
  }

  checkRoomTypeHasRemain = (id) => {
    const { checkIn: { gresDetails } } = this.props;
    const remainObj = formatDateRoomList({ preRoomList: gresDetails?.preRoomList });

    let remainValue = 0;
    _.forEach(_.keys(remainObj), (key) => {
      const roomTypeId = (key?.replace('r_')?.split('_') || [])[1];
      if (String(roomTypeId) === String(id) && remainObj[key].roomQty > remainValue) {
        remainValue = remainObj[key].roomQty;
      }
    });

    return remainValue;
  }

  handleChangeRoomType = (checkedValues) => {
    const { dispatch, checkIn: { selectedRoomTypeId, gresDetails } } = this.props;

    if (selectedRoomTypeId.length > checkedValues.length) {
      const value = _.difference(selectedRoomTypeId, checkedValues)[0];
      if (this.checkRoomTypeHasRemain(value)) {
        return message.error('当前该房型存在预留或入住房间，请先取消');
      }
      Modal.confirm({
        title: '提示',
        content: '确认删除该房型信息吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.props.form.resetFields(`roomTypeAndRate.roomQty${value}`);

          const { gresRoomTypeVOs } = gresDetails;
          gresDetails.setGresRoomTypeVOs(_.filter(gresRoomTypeVOs, item =>
            item.roomTypeId !== value));

          dispatch({
            type: 'checkIn/save',
            payload: {
              selectedRoomTypeId: checkedValues,
              gresDetails,
            },
          });
        },
      });
    } else {
      const value = _.difference(checkedValues, selectedRoomTypeId)[0];
      dispatch({
        type: 'checkIn/save',
        payload: {
          selectedRoomTypeId: [value, ...selectedRoomTypeId],
        },
      });
      setTimeout(() => {
        this.props.form.setFieldsValue({ [`roomTypeAndRate.roomQty${value}`]: 1 });
      }, 200);
    }
  }

  render() {
    const {
      checkIn: { roomTypePage, selectedRoomTypeId, gresDetails }, style,
      gresSelectRoomTypeLoading,
    } = this.props;

    return (
      <div
        style={style}
      >
        <Row style={{ marginBottom: 20 }}>
          <Col span={2}>房型：</Col>
          <Col span={22}>
            <Checkbox.Group
              onChange={this.handleChangeRoomType}
              value={selectedRoomTypeId}
              key={selectedRoomTypeId}
              disabled={gresDetails?.sourceType === 2}
            >
              {_.map(roomTypePage?.dataList, item =>
                <Checkbox value={item.roomTypeId} key={item.roomTypeId}>{item.roomTypeName}</Checkbox>)}
            </Checkbox.Group>
          </Col>
        </Row>
        <Table
          className="room-type-and-rate"
          columns={this.columns()}
          dataSource={this.getRoomTypeList()}
          rowKey={keyFn}
          pagination={false}
          bordered
          loading={gresSelectRoomTypeLoading}
          locale={{ emptyText: '暂无预订房型' }}
        />
      </div>
    );
  }
}
