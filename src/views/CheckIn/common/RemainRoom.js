import React from 'react';
import { Button, Modal, Checkbox, message, DatePicker, Row, Col, Spin } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import qs from 'qs';
import {
  transformArrivalDate,
  transformDepartureDate,
  addRemainRoom,
} from 'viewmodels/GresDetailResp';

const { RangePicker } = DatePicker;

export default class ChooseRoom extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: [],
      timeArr: props.timeArr || [],
    };
  }

  componentDidMount() {
    this.getRoomList(this.props, this.state.timeArr);
  }

  componentWillReceiveProps(nextProps) {
    const nextTimeArr = [nextProps.timeArr[0].startOf('day').valueOf(), nextProps.timeArr[1].endOf('day').valueOf()];
    const timeArr = [this.props.timeArr[0].startOf('day').valueOf(), this.props.timeArr[1].endOf('day').valueOf()];

    if (String(nextTimeArr) !== String(timeArr)) {
      this.setState({ timeArr: nextProps.timeArr });
      this.getRoomList(nextProps, nextTimeArr);
    }
  }

  onChange = (arrSelected) => {
    this.setState({ value: arrSelected });
  }

  getKeyName = (roomTypeId, timeArr) => {
    const arrivalDate = transformArrivalDate(timeArr[0]).valueOf();
    const departureDate = transformDepartureDate(timeArr[1]).valueOf();
    return `s_${roomTypeId}_${moment(arrivalDate).format('YYYYMMDD')}_${moment(departureDate).format('YYYYMMDD')}`;
  }

  getRoomList = async (props, timeArr) => {
    const { roomTypeId, index, record, checkIn: { roomBookingTotalVOs } } = props;

    if (!timeArr) return;

    const arrivalDate = transformArrivalDate(timeArr[0]).valueOf();
    const departureDate = transformDepartureDate(timeArr[1]).valueOf();
    const response = await this.props.dispatch({
      type: 'checkIn/gresSelectRoom',
      payload: {
        roomTypeId,
        arrivalDate,
        departureDate,
        recordList: _.map(
          _.find(roomBookingTotalVOs, item => item.roomTypeId === roomTypeId)?.list,
          item => ({
            ..._.pick(item, ['roomId', 'roomNo', 'roomTypeId', 'roomDescription', 'buildingRoomNo']),
          })),
      },
    });

    const { checkIn: { gresDetails, gresSelectRoom } } = this.props;
    const { roomId, gresId } = qs.parse(this.props?.location?.search?.replace('?', '')) || {};

    const keyName = this.getKeyName(roomTypeId, timeArr);
    const isCurRoom = _.find(gresSelectRoom[keyName], item => item?.roomId === Number(roomId));
    // 选择一个房间预订
    if (!gresId && roomId && response?.length && isCurRoom) {
      const { value } = this.state;

      const isNotFirst = _.find(record.list, item => item.roomId === Number(roomId));

      this.props.onChange(
        addRemainRoom({
          gresDetails,
          value: isNotFirst ? [] : [Number(roomId)].concat(value),
          gresSelectRoom: gresSelectRoom[keyName],
          timeArr,
          index,
        }),
        gresDetails
      );
    }
  }

  handleModalShow = () => {
    if (!this.state.timeArr) {
      return message.error('请先选择入离店日期');
    }

    this.setState({
      visible: true,
      timeArr: this.props.timeArr,
    });
  }

  handleChangeTime = (timeArr) => {
    // debugger; 为啥timeArr跨月选择顺序会反过来？？？
    if(timeArr[0] > timeArr[1]){
      timeArr = [timeArr[1], timeArr[0]]
    }
    if (timeArr[0].format('YYYYMMDD') === timeArr[1].format('YYYYMMDD')) {
      return message.error('开始时间不能等于结束时间');
    }
    this.setState({ timeArr }, () => {
      this.getRoomList(this.props, timeArr);
    });
  }

  handleOk = () => {
    const { checkIn: { gresDetails, gresSelectRoom }, index, roomTypeId } = this.props;
    const { timeArr, value } = this.state;
    this.props.onChange(
      addRemainRoom({
        gresDetails,
        value,
        gresSelectRoom: gresSelectRoom[this.getKeyName(roomTypeId, timeArr)],
        timeArr,
        index,
      }),
      gresDetails
    );
    this.handleCancel();
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      value: [],
    });
  }

  filterSelectedRoom = (gresSelectRoom, timeArr) => {
    const { record } = this.props;
    const arrivalDate = transformArrivalDate(timeArr[0]).valueOf();
    const departureDate = transformDepartureDate(timeArr[1]).valueOf();

    const arrRoomId = _.map(_.filter(record.list, (item) => {
      return (item.arrivalDate >= arrivalDate && item.arrivalDate < departureDate)
        || (item.departureDate > arrivalDate && item.departureDate <= departureDate)
      || (item.arrivalDate <= arrivalDate && item.departureDate >= departureDate);
    }), item => Number(item.roomId));

    // 只要在入或离店时间之内的，都过滤掉
    return _.filter(gresSelectRoom, (item) => {
      return arrRoomId.indexOf(Number(item.roomId)) === -1;
    });
  }

  render() {
    const { checkIn: { gresSelectRoom }, loading, roomTypeId, timeArr } = this.props;

    const arr = this.filterSelectedRoom(
      gresSelectRoom[this.getKeyName(roomTypeId, this.state.timeArr)], this.state.timeArr);

    return (
      <span>
        <Button className="link-button" onClick={this.handleModalShow}>+预留房间</Button>
        <Modal
          title="预留房间"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: !this.state.value?.length }}
        >
          <Row>
            <Col span={6}>入离店日期：</Col>
            <Col span={18}>
              <RangePicker
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  return current && (current < moment(timeArr[0]).startOf('day') || current > moment(timeArr[1]).endOf('day'));
                }}
                defaultValue={timeArr}
                allowClear={false}
                onChange={this.handleChangeTime}
                value={this.state.timeArr}
              />
            </Col>
          </Row>

          <div>可选房源：</div>
          {
            (loading.effects['checkIn/gresSelectRoom'] || arr.length) ? (
              <Spin spinning={loading.effects['checkIn/gresSelectRoom'] || false}>
                <Checkbox.Group
                  onChange={this.onChange}
                  value={this.state.value}
                  options={arr}
                />
              </Spin>
            ) : '没有可预留房间'
          }
        </Modal>
      </span>
    );
  }
}
