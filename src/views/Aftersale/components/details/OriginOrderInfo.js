/**
 * 原单据信息
 */
import React from 'react';
import { Card, Row, Col } from 'antd';
import styles from './styles.less';

export default function (props) {
  const { orderInfoVO, detailVO } = props;
  let info = orderInfoVO || detailVO?.orderInfoVO;
  if (!info && props.form) {
    info = props.form.getFieldsValue()?.orderInfoVo?.orderInfoVO;
  }
  return (
    <Card title="单据基本信息：" className={styles.basicCard}>
      <Row gutter="24" >
        <Col span={6}>
          买家姓名：
          <span> {info?.userNickname} </span>
        </Col>
        <Col span={6}>
        卖家商户：
          <span> {info?.merchantName} </span>
        </Col>
      </Row>

      <Row gutter="24">
        <Col span={6}>
          订单编号：
          <span> {info?.orderSn} </span>
        </Col>
        <Col span={6}>
        创建时间：
          <span> {info?.createdTimeFormat} </span>
        </Col>
      </Row>
      <Row gutter="24">
        <Col span={6}>
        订单状态：
          <span> {info?.orderStatusFormat}</span>
        </Col>
        <Col span={6}>
        订单支付金额：
          <span> {info?.orderAmountPaidFormat} </span>
        </Col>
      </Row>
      <Row gutter="24">
        <Col span={6}>
        收货人：
          <span>{info?.consigneeName}</span>
        </Col>
        <Col span={6}>
        收货地址：
          <span>
            {info?.regionName} {info?.detailedAddress}
          </span>
        </Col>
      </Row>
      <Row gutter="24">
        <Col span={6}>
        联系电话：
          <span> {info?.consigneeMobile} </span>
        </Col>
        <Col span={6}>
        配送方式：
          <span> {info?.deliveryMethodFormat || (info?.deliveryMethod === 1 ? '免费配送' : '')} </span>
        </Col>
      </Row>
    </Card>
  );
}
