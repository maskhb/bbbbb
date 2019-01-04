import React from 'react';
import { Card, Form, Row, Col, Input } from 'antd';
import { d2Col } from 'components/Const';
import FormItem from '../../common/FormItem';
import * as Basic from '../../common/BasicInfo';

export default class BasicInfo extends React.Component {
  render() {
    const { form, checkIn: { gresDetails } } = this.props;

    return (
      <Card title="基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col {...d2Col} >
              <FormItem
                form={form}
                detailDefault={gresDetails}
                label="团队名称："
                keyName="groupName"
                rules={[{ required: true, message: '请输入团队名称' }]}
              >
                <Input maxLength="20" />
              </FormItem>
            </Col>
            <Col {...d2Col} >
              <Basic.Source {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.GuestName {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.SalesDept {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.GuestPhone {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.PriceType {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.DepartureDate {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.RemainTime {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.Members {...this.props} />
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
