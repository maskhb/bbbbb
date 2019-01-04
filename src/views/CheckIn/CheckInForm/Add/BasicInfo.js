import React from 'react';
import _ from 'lodash';
import qs from 'qs';
import { Card, Form, Row, Col, Input } from 'antd';
import { d2Col } from 'components/Const';
import { transformArrivalDate, transformDepartureDate } from 'viewmodels/GresDetailResp';
import FormItem from '../../common/FormItem';
import ChooseRoom from './ChooseRoom';
import * as Basic from '../../common/BasicInfo';

export default class BasicInfo extends React.Component {
  checkIsDetailDate = () => {
    const { form, checkIn: { gresDetails } } = this.props;
    const arrivalDepartureDate = form.getFieldValue('arrivalDepartureDate') || [];
    const detailDate = [transformArrivalDate(gresDetails.arrivalDepartureDate[0]).valueOf(),
      transformDepartureDate(gresDetails.arrivalDepartureDate[1]).valueOf()];

    const curDate = [transformArrivalDate(arrivalDepartureDate[0]).valueOf(),
      transformDepartureDate(arrivalDepartureDate[1]).valueOf()];

    return String(detailDate) === String(curDate);
  }

  render() {
    const { form, checkIn } = this.props;
    const { roomId: curRoomId, arrivalDate, gresId } = qs.parse(this.props.location.search?.replace('?', '')) || {};

    const { gresSelectRoom } = checkIn;

    const roomId = form.getFieldValue('roomId');
    const keyName = _.find(_.keys(gresSelectRoom), key =>
      _.find(gresSelectRoom[key], item => item.roomId === Number(roomId))) || '';

    let { roomTypeId } = (gresSelectRoom[keyName] || [])[0] || {};

    if (!roomTypeId && curRoomId && this.checkIsDetailDate()) {
      roomTypeId = checkIn?.gresDetails?.roomTypeId;
    }

    const detailDefault = checkIn?.gresDetails;
    return (
      <Card title="基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col {...d2Col} >
              <Basic.DepartureDate {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.Source {...this.props} />
            </Col>
            <Col {...d2Col} >
              {
                (gresId && arrivalDate) ? (
                  <FormItem
                    form={form}
                    detailDefault={detailDefault}
                    label="入住房间："
                    keyName="roomNo"
                    rules={[{ required: true, message: '请选择入住房间' }]}
                  >
                    <Input disabled />
                  </FormItem>
                ) : (
                  <FormItem
                    form={form}
                    detailDefault={detailDefault}
                    label="入住房间："
                    keyName="roomId"
                    rules={[{ required: true, message: '请选择入住房间' }]}
                  >
                    {
                      (form.getFieldValue('arrivalDepartureDate')) ? (
                        <ChooseRoom
                          timeArr={form.getFieldValue('arrivalDepartureDate')}
                          roomTypeId={roomTypeId}
                          {...this.props}
                        />
                      ) : <Input disabled />}
                  </FormItem>
                )
              }
            </Col>
            <Col {...d2Col} >
              <Basic.SalesDept {...this.props} />
            </Col>
            <Col {...d2Col} >
              <FormItem
                form={form}
                detailDefault={detailDefault}
                label="预订单号："
                keyName="parentGresNo"
              >
                <Input disabled />
              </FormItem>
            </Col>
            <Col {...d2Col} >
              <Basic.PriceType {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.Memo {...this.props} />
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
