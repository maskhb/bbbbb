/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:24:27
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-09 10:26:03
 *
 * 生成售后单 用户信息
 */


import React, { PureComponent } from 'react';

import { Card, Row, Col } from 'antd';

class UserInfoCard extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { className, colLeftSpan = 3, orders } = this.props;
    const { detail } = orders || {};

    return (
      <Card title="用户信息" className={`${className || ''}`}>
        <Row>
          <Col span={colLeftSpan}>
            <span>昵称：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <span>{detail?.userNickname}</span>
          </Col>
        </Row>
        <Row>
          <Col span={colLeftSpan}>
            <span>内部ID：</span>
          </Col>
          <Col span={24 - colLeftSpan}>
            <span>{detail?.createdBy}</span>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default UserInfoCard;
