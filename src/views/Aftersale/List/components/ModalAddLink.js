/*
 * @Author: fuanzhao
 * @Date: 2018-06-06 09:52:57
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-05 10:49:11
 */

import React from 'react';

import { Modal, Button, Row, Col } from 'antd';

import { toFullPath } from 'utils/request/utils';


export default class extends React.PureComponent {
  openLink = (link) => {
    return () => {
      window.open(toFullPath(link), '_blank');
    };
  };
  render() {
    return (
      <Modal title="新增售后订单" {...this.props}>
        <p>请选择售后服务类型</p>
        <Row type="flex" justify="center">
          <Col span={8}>
            <Button type="primary" onClick={this.openLink('#/aftersale/list/return/add/0')}>退货退款</Button>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={this.openLink('#/aftersale/list/exchange/add/0')}>换货</Button>
          </Col>
          <Col span={8}>
            <Button type="primary" onClick={this.openLink('#/aftersale/list/refund/add/0')}>仅退款</Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}

