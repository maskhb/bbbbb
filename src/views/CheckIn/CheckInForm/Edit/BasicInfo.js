import React from 'react';
import { Card, Form, Row, Col, Input } from 'antd';
import { d2Col } from 'components/Const';
import FormItem from '../../common/FormItem';
import AddRoom from './AddRoom';
import * as Basic from '../../common/BasicInfo';

export default class BasicInfo extends React.Component {
  render() {
    const { form, checkIn: { gresDetails } } = this.props;

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
          </Row>

          <Row gutter={16}>
            <Col {...d2Col} >
              <FormItem
                form={form}
                detailDefault={gresDetails}
                label="入住房间："
                keyName="roomNo"
                rules={[{ required: true, message: '请选择入住房间' }]}
              >
                <Input disabled />
              </FormItem>
            </Col>
            <Col {...d2Col} >
              <Basic.PriceType {...this.props} />
            </Col>
          </Row>

          <Row gutter={16}>
            {gresDetails?.resType === 2 || (gresDetails?.linkId ? (
              <Col {...d2Col} >
                <FormItem
                  form={form}
                  detailDefault={gresDetails}
                  label="所属主房："
                  keyName="parentLinkRoom"
                >
                  <Input disabled />
                </FormItem>
              </Col>
            ) : (
              <Col {...d2Col} >
                <FormItem
                  form={form}
                  detailDefault={gresDetails}
                  label="下属次房："
                  keyName="arrLinkRoomIds"
                >
                  <AddRoom
                    {...this.props}
                  />
                </FormItem>
              </Col>
            ))}
            <Col {...d2Col} >
              <FormItem
                form={form}
                detailDefault={gresDetails.parentId ? gresDetails : {}}
                label="预订单号："
                keyName="parentGresNo"
              >
                <Input disabled />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col {...d2Col} >
              <Basic.SalesDept {...this.props} />
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
