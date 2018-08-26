/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:22:56
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-01 17:58:44
 *
 * 生成售后单 价格统计
 */

import React, { PureComponent } from 'react';

import { Row, Col } from 'antd';

import { add, mul, sub } from 'utils/number';
import { fenToYuan } from 'utils/money';

class AfterSaleMoenyLayer extends PureComponent {
  static defaultProps = {};

  state = {}

  /**
   * 获取商品总额
   */
  getGoodsSumMoney = () => {
    const { form } = this.props;
    const orderGoodsList = form?.getFieldValue('orderGoodsList') || [];

    let sumMoney = 0;

    orderGoodsList?.forEach((item) => {
      sumMoney = add(sumMoney, mul(item.goodsNum, item.salePrice));
    });

    return sumMoney;
  }

  render() {
    const { className, colRightSpan = 3, orders } = this.props;
    const { detail } = orders || {};

    // 商品金额
    const goodsSumMoney = this.getGoodsSumMoney();
    const goodsSumMoneyForFenToYuan = fenToYuan(goodsSumMoney);

    // 优惠金额
    const discountAmount = sub(goodsSumMoney, detail?.intentRefundAmount || 0);
    const discountAmountForFenToYuan = fenToYuan(discountAmount);

    return (
      <div className={`${className || ''} views_order_aftersale_money_component`}>
        <div>
          <Row>
            <Col span={24 - colRightSpan}>
              <span>商品金额：</span>
            </Col>
            <Col span={colRightSpan}>
              <span>¥ {goodsSumMoneyForFenToYuan}</span>
            </Col>
          </Row>
          <Row>
            <Col span={24 - colRightSpan}>
              <span>运费：</span>
            </Col>
            <Col span={colRightSpan}>
              <span>¥ 0.00</span>
            </Col>
          </Row>
          <Row>
            <Col className="dotted-line" />
          </Row>
          <Row>
            <Col span={24 - colRightSpan}>
              <span>订单金额：</span>
            </Col>
            <Col span={colRightSpan}>
              <span>¥ {goodsSumMoneyForFenToYuan}</span>
            </Col>
          </Row>
        </div>
        <div>
          <Row>
            <Col span={24 - colRightSpan}>
              <span>优惠金额：</span>
            </Col>
            <Col span={colRightSpan}>
              <span>¥ {discountAmountForFenToYuan}</span>
            </Col>
          </Row>
          <Row>
            <Col span={24 - colRightSpan}>
              <span>实付金额：</span>
            </Col>
            <Col span={colRightSpan}>
              <span>¥ {detail?.intentRefundAmountFormat}</span>
            </Col>
          </Row>
          <Row>
            <Col span={24 - colRightSpan}>
              <span>需退金额：</span>
            </Col>
            <Col span={colRightSpan}>
              <span className="red">¥ {detail?.intentRefundAmountFormat}</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default AfterSaleMoenyLayer;
