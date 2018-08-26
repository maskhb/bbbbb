/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:24:14
 * @Last Modified by:   wuhao
 * @Last Modified time: 2018-06-13 11:24:14
 *
 * 生成售后单 收货信息
 */

import React, { PureComponent } from 'react';

import { Card, Row, Col } from 'antd';

class ReceiptInfoCard extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { className, colLeftSpan = 3, orders } = this.props;
    const { detail } = orders || {};
    const { receiptVO } = detail || {};

    return (
      <Card title="收货信息" className={`${className || ''}`}>
        <Row>
          <Col span={colLeftSpan}>
            <span>所在项目：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <span>{detail?.communityName}</span>
          </Col>
        </Row>
        <Row>
          <Col span={colLeftSpan}>
            <span>所在地区：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <span>{receiptVO?.regionName}</span>
          </Col>
        </Row>
        <Row>
          <Col span={colLeftSpan}>
            <span>收货地址：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <span>
              {
                receiptVO?.regionName
              }{
                receiptVO?.detailedAddress
              }，{
                receiptVO?.consigneeName
              }，{
                receiptVO?.consigneeMobile
              }
            </span>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default ReceiptInfoCard;
