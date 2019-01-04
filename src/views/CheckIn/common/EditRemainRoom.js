import React from 'react';
import _ from 'lodash';
import { Button, Modal, message, DatePicker, Row, Col } from 'antd';
import moment from 'moment/moment';
import { plainToClassFromExist } from 'class-transformer/index';
import { RoomBookingTotalResp, transformArrivalDate, transformDepartureDate } from 'viewmodels/GresDetailResp';
import { fenToYuan } from 'utils/money';
import { mul } from 'utils/number';

const { RangePicker } = DatePicker;
export default class EditRemainRoom extends React.PureComponent {
  constructor(props) {
    super(props);
    const { record } = props;
    this.state = {
      visible: false,
      timeArr: [moment(record.arrivalDate), moment(record.departureDate)] || [],
      price: fenToYuan(record.roomRate || 0, true),
    };
  }

  handleModalShow = () => {
    const arrivalDepartureDate = this.props.form.getFieldValue('arrivalDepartureDate');
    if (!arrivalDepartureDate) {
      return message.error('请先选择入离店日期');
    }
    const { record } = this.props;

    this.setState({
      visible: true,
      timeArr: [moment(record.arrivalDate), moment(record.departureDate)] || [],
      price: fenToYuan(record.roomRate || 0, true),
    });
  }

  handleOk = () => {
    const { checkIn: { gresDetails }, index, parentIndex } = this.props;
    const { timeArr, price } = this.state;

    const oldRoomList = _.cloneDeep(gresDetails?.preRoomList);
    const arrivalDate = transformArrivalDate(timeArr[0]).valueOf();
    const departureDate = transformDepartureDate(timeArr[1]).valueOf();

    oldRoomList[parentIndex].list[index] = {
      ...oldRoomList[parentIndex].list[index],
      arrivalDate,
      departureDate,
      roomRate: mul(price, 100),
    };

    oldRoomList[parentIndex] = plainToClassFromExist(
      new RoomBookingTotalResp(), oldRoomList[parentIndex]);

    gresDetails.preRoomList = oldRoomList;

    this.props.dispatch({
      type: 'checkIn/save',
      payload: {
        gresDetails,
      },
    });
    this.handleCancel();
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleChangeDate = (timeArr) => {
    this.setState({ timeArr });
  }

  handleChangePrice = (price) => {
    this.setState({ price });
  }

  render() {
    const { record, form } = this.props;
    const { timeArr, price } = this.state;

    const arrivalDepartureDate = form.getFieldValue('arrivalDepartureDate');
    return (
      <span>
        <Button className="link-button" onClick={this.handleModalShow}>修改</Button>
        <Modal
          title="修改预留房间"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okButtonProps={{ disabled: !(price || price === 0) }}
        >
          <Row gutter={16}>
            <Col span={6}>当前房号：</Col>
            <Col span={18}>{record.buildingRoomNo}</Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={6}>房间描述：</Col>
            <Col span={18}>{record.roomDescription}</Col>
          </Row>
          <br />
          <Row gutter={16}>
            <Col span={6}>入离店日期：</Col>
            <Col span={18}>
              <RangePicker
                format="YYYY-MM-DD"
                defaultValue={[moment(record.arrivalDate), moment(record.departureDate)]}
                disabledDate={(current) => {
                  return current && (current < moment(arrivalDepartureDate[0]).startOf('day') || current > moment(arrivalDepartureDate[1]).endOf('day'));
                }}
                onChange={this.handleChangeDate}
                allowClear={false}
                value={timeArr}
              />
            </Col>
          </Row>
          <br />
          {/*<Row gutter={16}>*/}
            {/*<Col span={6}>价格：</Col>*/}
            {/*<Col span={18}>*/}
              {/*<InputNumber*/}
                {/*min={0}*/}
                {/*step={0.01}*/}
                {/*precision={2}*/}
                {/*formatter={value => `￥ ${value}`.replace(/￥(?=(\d{3})+(?!\d))/g, ',')}*/}
                {/*parser={value => value.replace(/￥\s?|(,*)/g, '')}*/}
                {/*onChange={this.handleChangePrice}*/}
                {/*value={price}*/}
              {/*/>*/}
            {/*</Col>*/}
          {/*</Row>*/}
          {/*<br />*/}
        </Modal>
      </span>
    );
  }
}
