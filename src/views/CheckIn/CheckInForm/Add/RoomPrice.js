import React from 'react';
import { Table, InputNumber } from 'antd';
import qs from 'qs';
import _ from 'lodash';
import { transformArrivalDate, transformDepartureDate, getGresSelectRoomType } from 'viewmodels/GresDetailResp';
import FormItem from '../../common/FormItem';
import { fenToYuan } from '../../../../utils/money/index';
import AddService from '../../common/AddService';

export default class BasicInfo extends React.Component {
  componentDidMount() {
    this.props.dispatch({
      type: 'checkIn/businessTime',
      payload: {
        orgId: Number(JSON.parse(localStorage.user)?.orgIdSelected),
      },
    });

    this.props.dispatch({
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
    const { dispatch } = this.props;
    const { gresId } = qs.parse(this.props.location.search?.replace('?', '')) || {};

    const {
      arrivalDepartureDate, rateCodeId, roomId,
      checkIn: { gresDetails, gresSelectRoomType },
    } = nextProps;

    if (this.checkCanRefresh(nextProps)) {
      const isDetail = Boolean(gresId);
      const hasChangeRateType = rateCodeId ? gresDetails?.rateCodeId !== rateCodeId
        : Boolean(rateCodeId) !== Boolean(gresDetails?.rateCodeId);
      dispatch({
        type: 'checkIn/gresSelectRoomType',
        payload: {
          rateCodeId: rateCodeId || 0,
          arrivalDate: arrivalDepartureDate[0].valueOf(),
          departureDate: arrivalDepartureDate[1].valueOf(),
          roomId,
          isCheckIn: true,
          hasChangeRateType: isDetail ? hasChangeRateType : true,
          gresRoomTypeVOs: gresDetails?.gresRoomTypeVOs || [],
        },
      }).then((g) => {
        dispatch({
          type: 'checkIn/save',
          payload: {
            gresSelectRoomType: g,
          },
        });
      });
    } else if ((!roomId || !arrivalDepartureDate) && gresSelectRoomType?.length) {
      dispatch({
        type: 'checkIn/save',
        payload: {
          gresSelectRoomType: [],
        },
      });
    }
  }

  getDefaultKey = (data, keyName) => {
    const { checkIn: { gresDetails } } = this.props;
    return _.map(_.get(data, keyName), (item, index) =>
      ({ id: index/*, disabled: gresDetails?.sourceType === 1 */}));
  }

  getGresSelectRoomType = () => {
    const { checkIn, isEdit, form } = this.props;
    if (!isEdit) return checkIn?.gresSelectRoomType;
    return getGresSelectRoomType(checkIn, form.getFieldValue('arrivalDepartureDate'));
  }

  columns = () => {
    const { form, checkIn: { gresDetails, businessTime }, isEdit } = this.props;
    const curBussinessDay = businessTime;
    return [{
      title: '日期',
      dataIndex: 'businessDayFormat',
    }, {
      title: '参考房价',
      dataIndex: 'stdPrice',
      render(val) {
        return `￥ ${fenToYuan(val)}`;
      },
    }, {
      title: <span><i style={{ color: 'red' }}>* </i>实际房价</span>,
      render(val, record, index) {
        return (
          <FormItem
            form={form}
            detailDefault={gresDetails}
            keyName={`roomTypeAndRate[${index}].value.realPriceFormat`}
            rules={[{ required: true, message: '请输入实际房价' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              precision={2}
              formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/￥\s?|(,*)/g, '')}
              disabled={isEdit && record.businessDay < curBussinessDay}
            />
          </FormItem>
        );
      },
    }, {
      title: '套餐服务',
      align: 'center',
      render: (val, record, index) => {
        return (
          <AddService
            disabled={record.businessDay < curBussinessDay}
            operate={(gresDetails?.isPreCheckIn || gresDetails?.parentId)
            ? [false, false, true] : [true, true, true]}
            keyName={`roomTypeAndRate[${index}].value.packageServiceOrders`}
            {...this.props}
            arrDefaultKey={this.getDefaultKey(gresDetails, `roomTypeAndRate[${index}].value.packageServiceOrders`)}
          />
        );
      },
    }, {
      title: '增值服务',
      align: 'center',
      render: (val, record) => {
        return (
          <AddService
            disabled={record.businessDay < curBussinessDay}
            keyName={`addServiceOrdersByDate._${record.businessDay}`}
            {...this.props}
            arrDefaultKey={this.getDefaultKey(gresDetails, `addServiceOrdersByDate._${record.businessDay}`)}
          />
        );
      },
    }];
  }

  checkCanRefresh = (nextProps) => {
    const { arrivalDepartureDate, rateCodeId, roomId } = nextProps;

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
      || ((String(arrivalDepartureDateFormat) !== String(curArrivalDepartureDateFormat)))
      || (roomId !== this.props.roomId))
      && (arrivalDepartureDate[0] && roomId);
  }

  render() {
    const { style } = this.props;

    return (
      <Table
        className="room-type-and-rate"
        columns={this.columns()}
        dataSource={this.getGresSelectRoomType()}
        rowKey="businessDay"
        pagination={false}
        bordered
        style={style}
        locale={{ emptyText: '暂无预订房型' }}
      />
    );
  }
}
