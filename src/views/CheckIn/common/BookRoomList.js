import React from 'react';
import { Table } from 'antd';
import { getPreRoomList } from 'viewmodels/GresDetailVO';
import { classToPlain } from 'class-transformer';
import {
  mergeRoomTypeAndRate,
  getRoomTypeAndRate,
} from 'viewmodels/GresDetailResp';
import _ from 'lodash';
import { mul } from 'utils/number';
import '../index.less';
import RoomList from './RoomList';
import RemainRoom from './RemainRoom';

let timer = null;

// preRoomList : [{
//   list: [{
//     roomId: 22,
//     roomNo: '30号',
//     gresStatus: 'WI',
//     arrivalDate: 1543384800000,
//     departureDate: 1543464000000,
//     roomRate: 0,
//     buildingRoomNo: '清泉八街30号_30号',
//     roomDescription: null
//   }, {
//     roomId: 14,
//     roomNo: '32号',
//     gresStatus: 'WI',
//     arrivalDate: 1543384800000,
//     departureDate: 1543464000000,
//     roomRate: 0,
//     buildingRoomNo: '清泉五街32号_32号',
//     roomDescription: null
//   }], roomTypeId: 5, roomTypeName: '五房别墅', roomQty: 1, roomRealPrice: 0
// }];

export default class BookRoomList extends React.Component {
  state = {
    lastFormRoomTypeAndRate: [],
  }

  componentDidMount() {
    const { form, checkIn: { gresDetails, gresSelectRoomType }, isCheckIn } = this.props;
    const values = form.getFieldsValue();

    this.resetPreRoomList(this.getRoomTypeAndRate(
      getRoomTypeAndRate(values, gresSelectRoomType)?.roomTypeAndRate,
      gresDetails?.roomTypeAndRate,
      gresSelectRoomType,
      isCheckIn
    ), gresDetails);
  }

  componentWillReceiveProps(nextProps) {
    const { form, checkIn: { gresDetails, gresSelectRoomType }, isCheckIn } = nextProps;
    const values = form.getFieldsValue();
    const { lastFormRoomTypeAndRate = [] } = this.state;

    const roomTypeAndRate = mergeRoomTypeAndRate(
      getRoomTypeAndRate(values, gresSelectRoomType)?.roomTypeAndRate,
      gresDetails?.roomTypeAndRate, gresSelectRoomType
    );

    const isChanged = roomTypeAndRate?.length !== lastFormRoomTypeAndRate?.length
      || _.find(roomTypeAndRate, (item, index) => {
        const { roomQty, realPriceFormat, rate } = lastFormRoomTypeAndRate[index]?.value || {};
        return roomQty !== item?.value.roomQty
          || realPriceFormat !== item?.value.realPriceFormat
          || rate !== item?.value.rate;
      });

    if (isChanged) {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        this.setState({ lastFormRoomTypeAndRate: _.cloneDeep(roomTypeAndRate) });
        this.resetPreRoomList(
          this.getRoomTypeAndRate(
            getRoomTypeAndRate(values, getRoomTypeAndRate)?.roomTypeAndRate,
            nextProps.checkIn.gresDetails?.roomTypeAndRate,
            gresSelectRoomType, isCheckIn
          ),
          nextProps.checkIn.gresDetails
        );
      }, 200);
    }
  }

  componentWillUnmount() {
    timer && clearTimeout(timer);
  }

  getRoomTypeAndRate = (formValues, gresDetailsValues, gresSelectRoomType) => {
    return mergeRoomTypeAndRate(
      formValues,
      gresDetailsValues,
      gresSelectRoomType);
  }

  resetPreRoomList = (roomTypeAndRate, gresDetails) => {
    const oldRoomList = _.cloneDeep(gresDetails?.preRoomList);

    // 获取详情里面的数据，跟初始数据合并   但是如果是修改过的，
    const preRoomList = _.map(
      _.uniqBy(getPreRoomList(roomTypeAndRate), 'roomTypeId'), (item) => {
        const curRoom = _.find(gresDetails?.roomBookingTotalVOs, (room) => {
          return room.roomTypeId === item.roomTypeId;
        }) || {};
        const roomRealPrice = item.realPriceFormat ? mul(item.realPriceFormat, 100) : item.rate;
        return {
          ..._.pick(item, ['roomTypeId', 'roomTypeName', 'roomQty', 'orgId']),
          ..._.pick(curRoom, ['list', 'orgId', 'remainQtyFormat', 'roomsFormat']),
          roomRealPrice,
        };
      });

    const arrRoomTypeId = [];
    let formatList = _.map(oldRoomList, (item) => {
      const curRoom = _.find(preRoomList, (room) => {
        return room.roomTypeId === item.roomTypeId;
      });

      if (curRoom) {
        arrRoomTypeId.push(item.roomTypeId);
        return {
          ...classToPlain(item),
          ..._.pick(curRoom, ['roomTypeId', 'roomTypeName', 'roomQty', 'roomRealPriceFormat', 'roomRealPrice']),
          list: _.map(item.list, (room) => {
            room.roomRate = curRoom.roomRealPrice;
            return room;
          }),
        };
      }
    });

    formatList = _.filter(formatList, item =>
      arrRoomTypeId.indexOf(item?.roomTypeId) !== -1).concat(
      _.filter(preRoomList, item => arrRoomTypeId.indexOf(item.roomTypeId) === -1)
    );

    this.resetStorePreRoomList(formatList, gresDetails);
  }

  resetStorePreRoomList = (preRoomList, gresDetails) => {
    gresDetails.preRoomList = preRoomList;

    this.props.dispatch({
      type: 'checkIn/save',
      payload: {
        gresDetails,
      },
    });
  }

  columns = () => {
    const { form, checkIn } = this.props;
    const { gresDetails } = checkIn;
    return [{
      title: '房型',
      dataIndex: 'roomTypeName',
    }, {
      title: '预订数量',
      dataIndex: 'roomQty',
    }, {
      title: '已预留数量',
      dataIndex: 'remainQtyFormat',
    }, {
      title: '预留房间',
      dataIndex: 'roomsFormat',
    }, {
      title: '操作',
      dataIndex: '',
      render: (val, record, index) => {
        const showOperate = [4, 5].indexOf(gresDetails.status) === -1;
        return (
          <div>
            {showOperate ? (
              <RemainRoom
                timeArr={form.getFieldValue('arrivalDepartureDate')}
                roomTypeId={record.roomTypeId}
                gresId={gresDetails?.gresId}
                index={index}
                onChange={this.resetStorePreRoomList}
                record={record}
                {...this.props}
              />
            ) : null}
          </div>
        );
      },
    }];
  }

  render() {
    const { checkIn: { gresDetails }, style } = this.props;
    return (
      <Table
        expandedRowRender={(record, index) => (
          <RoomList
            record={record}
            {...this.props}
            index={index}
            onChange={this.resetStorePreRoomList}
          />
        )}
        className="tanant-info"
        columns={this.columns()}
        dataSource={gresDetails?.preRoomList}
        rowKey="roomTypeId"
        pagination={false}
        style={style}
      />
    );
  }
}
