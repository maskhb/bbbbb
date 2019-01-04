import React from 'react';
import { Card, Form, Row, Col } from 'antd';
import { d2Col } from 'components/Const';
import * as Basic from '../../common/BasicInfo';


export default class BasicInfo extends React.Component {
  render() {
    // const {} = this.props;

    return (
      <Card title="基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col {...d2Col} >
              <Basic.GuestName {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.Source {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.GuestPhone {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.SalesDept {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.DepartureDate {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.PriceType {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.RemainTime {...this.props} />
            </Col>
            <Col {...d2Col} >
              <Basic.Members {...this.props} />
            </Col>
          </Row>
          <Row>
            <Basic.Memo {...this.props} />
          </Row>
        </Form>
      </Card>
    );
  }
}
