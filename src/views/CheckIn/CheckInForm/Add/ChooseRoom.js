import React from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Input, Button, Modal, Select, Radio, Row, Col, message, Spin } from 'antd';
import { transformArrivalDate, transformDepartureDate } from 'viewmodels/GresDetailResp';
import qs from 'qs';

export default class ChooseRoom extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: props.value || '',
      radioValue: '',
      selectValue: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/save',
      payload: {
        roomTypePage: {},
      },
    });
    dispatch({
      type: 'checkIn/roomTypePage',
      payload: {
        roomTypeQueryVO: {
          currPage: 1,
          pageSize: 9999,
        },
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
        radioValue: nextProps.value,
      });
    }

    if (nextProps.roomTypeId !== this.props.roomTypeId) {
      this.setState({ selectValue: nextProps.roomTypeId });
    }

    const { timeArr } = nextProps;
    const dateForm = [transformArrivalDate(timeArr[0]).valueOf(),
      transformDepartureDate(timeArr[1]).valueOf()];
    const lastDateForm = [transformArrivalDate(this.props.timeArr[0]).valueOf(),
      transformDepartureDate(this.props.timeArr[1]).valueOf()];

    // 切换时间的时候，重置选择的房间
    if (String(dateForm) !== String(lastDateForm)) {
      if (this.state.value) {
        this.props.form.setFieldsValue({ roomId: '' });
      }
      this.setState({
        value: '',
        radioValue: '',
        selectValue: '',
      });
    }
  }

  onChange = (e) => {
    const radioValue = e.target.value;
    this.setState({ radioValue });
  }

  getRoomNo = (roomId) => {
    const { checkIn: { gresSelectRoom, gresDetails }, form } = this.props;
    const { gresId, roomId: curRoomId } = qs.parse(this.props.location.search?.replace('?', '')) || {};

    const keyName = _.find(_.keys(gresSelectRoom), key =>
      _.find(gresSelectRoom[key], item => item.roomId === Number(roomId))) || '';

    let { roomTypeId } = (gresSelectRoom[keyName] || [])[0] || {};

    if (!roomTypeId && gresId && curRoomId) {
      roomTypeId = gresDetails?.roomTypeId;
    }

    let isDetailDate = false;
    if (gresDetails?.roomNo) {
      const arrivalDepartureDate = form.getFieldValue('arrivalDepartureDate');
      const detailDate = [transformArrivalDate(gresDetails.arrivalDepartureDate[0]).valueOf(),
        transformDepartureDate(gresDetails.arrivalDepartureDate[1]).valueOf()];

      const curDate = [transformArrivalDate(arrivalDepartureDate[0]).valueOf(),
        transformDepartureDate(arrivalDepartureDate[1]).valueOf()];

      isDetailDate = String(detailDate) === String(curDate);
    }

    const curRoomList = (gresSelectRoom && this.getCurRoomList(roomTypeId)) || [];
    return _.find(curRoomList, (item) => {
      return item.roomId === roomId;
    })?.roomNo || (isDetailDate ? gresDetails?.roomNo : '');
  }

  getCurRoomList = (roomTypeId) => {
    const { checkIn: { gresSelectRoom, gresDetails }, form } = this.props;
    const { gresId, roomId, roomNo, buildingRoomNo } = qs.parse(this.props.location.search?.replace('?', '')) || {};

    const arrivalDepartureDate = form.getFieldValue('arrivalDepartureDate');
    const arrivalDate = transformArrivalDate(arrivalDepartureDate[0]).valueOf();
    const departureDate = transformDepartureDate(arrivalDepartureDate[1]).valueOf();
    const keyName = `s_${roomTypeId}_${moment(arrivalDate).format('YYYYMMDD')}_${moment(departureDate).format('YYYYMMDD')}`;

    let curRoomList = (gresSelectRoom && gresSelectRoom[keyName]) || [];
    const isPreCheckIn = gresId && roomId;

    if (isPreCheckIn && gresDetails?.roomTypeId === roomTypeId) {
      curRoomList = curRoomList.concat({
        buildingRoomNo,
        roomNo,
        roomId: Number(roomId),
        roomTypeId,
      });
    }

    return curRoomList;
  }

  getRadioValue = () => {
    const { radioValue, value } = this.state;
    const { checkIn: { gresDetails }, form } = this.props;
    if (radioValue) {
      return Number(radioValue);
    } else if (this.getRoomNo(value)) {
      if (!form.getFieldValue('roomId') && gresDetails?.roomId) {
        form.setFieldsValue({ roomId: gresDetails?.roomId });
      }
      return Number(gresDetails?.roomId);
    }

    return radioValue;
  }

  getRoomTypeId = () => {
    const { selectValue, value } = this.state;
    if (selectValue) {
      return Number(selectValue);
    } else if (this.getRoomNo(value)) {
      return Number(this.props.roomTypeId);
    }

    return selectValue;
  }

  handleOk = () => {
    const value = this.getRadioValue();

    this.setState({
      value,
      visible: false,
    }, () => {
      if (this.props.onChange instanceof Function) {
        this.props.onChange(value);
      }
    });
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleModalShow = () => {
    if (!this.props.timeArr) {
      return message.error('请先选择入离店日期');
    }
    this.setState({
      visible: true,
    });
    const { value, radioValue } = this.state;
    if (value !== radioValue) {
      this.setState({
        radioValue: value,
        selectValue: '',
      });
    }
  }

  handleChange = (selectValue) => {
    this.setState({ selectValue, radioValue: '' });

    const { dispatch, timeArr } = this.props;

    dispatch({
      type: 'checkIn/gresSelectRoom',
      payload: {
        roomTypeId: selectValue,
        arrivalDate: transformArrivalDate(timeArr[0]).valueOf(),
        departureDate: transformDepartureDate(timeArr[1]).valueOf(),
      },
    });
  }

  render() {
    const { timeArr = [], checkIn: { roomTypePage }, loading, isPreCheckIn } = this.props;
    const { radioValue } = this.state;

    const selectValue = this.getRoomTypeId();
    const curRoomList = this.getCurRoomList(selectValue);

    return (
      <Row gutter={16}>
        <Col span={12}>
          <Input
            disabled
            value={this.getRoomNo(this.state.value)}
          />
        </Col>
        <Col span={12}>
          <Button disabled={isPreCheckIn} onClick={this.handleModalShow}>选择</Button>
        </Col>
        <Modal
          title="选择房间"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{
            disabled: (this.state.selectValue ? !radioValue :
              !this.getRadioValue()),
          }}
        >
          <p>入离店日期：{timeArr[0]?.format('YYYY-MM-DD')} ~ {timeArr[1]?.format('YYYY-MM-DD')}</p>
          <Row>
            <Col span={6}>房型：</Col>
            <Col span={18}>
              <Select
                onChange={this.handleChange}
                value={this.getRoomTypeId()}
                style={{ minWidth: 200 }}
                notFoundContent={loading.effects['checkIn/roomTypePage'] ? <Spin spinning /> : '没有数据'}
              >
                {
                  roomTypePage?.dataList?.map(item => (
                    <Select.Option value={item.roomTypeId} key={item.roomTypeId}>
                      {item.roomTypeName}
                    </Select.Option>))
                }
              </Select>
            </Col>
          </Row>
          <br />
          <Spin spinning={loading.effects['checkIn/gresSelectRoom'] || false}>
            <Row>
              <Col span={6} />
              <Col span={18}>
                <Radio.Group
                  onChange={this.onChange}
                  value={this.getRadioValue()}
                >
                  {
                    curRoomList?.map(item =>
                      <Radio value={item.roomId}>{item.buildingRoomNo}</Radio>)
                  }
                </Radio.Group>
              </Col>
            </Row>
          </Spin>

        </Modal>
      </Row>
    );
  }
}
