/*
 * @Author: wuhao
 * @Date: 2018-04-20 16:16:08
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-07 10:05:17
 *
 * 费用信息 --  支付信息
 */
import React, { PureComponent } from 'react';

import { Card, Row, Col } from 'antd';

import { fenToYuan } from 'utils/money';

import {
  isCustomGoodsOrder,
  isSetMealGoodsOrder,
  // isGiftGoodsOrder,
  IsExcessOrderAmount,
  isAftersaleOrderSource,
} from '../../../attr';

import {
  // transformSetMealAmount,
  transformGiftAmount,
} from '../../../transform';

class PayInfoForCostInfo extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { className, orders } = this.props;
    const { detail } = orders || {};
    const colSpan = 5;

    const giftAmount = transformGiftAmount(detail?.orderGoodsVOList);
    return (
      <Card
        type="inner"
        title="支付信息"
        className={`${className} cost_info_pay_info`}
      >
        <Row>
          <Col span={colSpan}>
            <span>{detail?.paidTimeFormat}</span>
          </Col>
          <Col span={colSpan}>
            <span>支付状态:{detail?.payStatusFormat}</span>
          </Col>
        </Row>

        <Row>
          <Col span={colSpan}>
            <Row>
              <Col>
                <span>商品金额:{detail?.orderAmountFormat}</span>
                {
                  isCustomGoodsOrder(detail?.orderGoodsType) && (
                  <span>
                  （含定金{detail?.depositAmountFormat}+尾款{detail?.remainAmountFormat}）
                  </span>
                )}
              </Col>

              <Col>
                <span>商品运费:{detail?.transportFeeFormat}</span>
              </Col>

              <Col>
                <span>订单金额:{detail?.orderTotalFormat}</span>
              </Col>


              {
                isAftersaleOrderSource(detail?.orderSource) ? [
                  <Col>
                    <span>原订单换货金额:{detail?.totalExchangeAmountFormat}</span>
                  </Col>,

                  <Col>
                    <span>原商品售后总额:{detail?.totalAfterSaleAmountFormat}</span>
                  </Col>,
                ] : null
              }


            </Row>
          </Col>

          <Col span={colSpan}>
            <Row>
              <Col>
                <span>商家优惠:{detail?.merchantDiscountAmountFormat}</span>
              </Col>

              {
                isSetMealGoodsOrder(detail?.orderGoodsType) && (
                <Col>
                  <span>套餐优惠:{detail?.packageDiscountAmountFormat}</span>
                </Col>
              )}

              {/* {
                isGiftGoodsOrder(detail?.orderGoodsType) && (
                <Col>
                  <span>赠品优惠:{fenToYuan(giftAmount)}</span>
                </Col>
              )} */}

              {
                  giftAmount < 0 ? (
                    <Col>
                      <span>赠品优惠:{fenToYuan(giftAmount)}</span>
                    </Col>
                  ) : null
               }
              <Col>
                <span>商家满减:{detail?.merchantFullDiscountFormat}</span>
              </Col>

              <Col>
                <span>商家优惠券:{detail?.merchantCouponFormat}</span>
              </Col>

              <Col>
                <span>平台满减:{detail?.platformFullDiscountFormat}</span>
              </Col>

              <Col>
                <span>平台优惠券:{detail?.platformCouponFormat}</span>
              </Col>
            </Row>
          </Col>

          <Col span={colSpan}>
            <Row>
              {
                !isCustomGoodsOrder(detail?.orderGoodsType) &&
                !isAftersaleOrderSource(detail?.orderSource) &&
                detail?.orderStatusFormat === '待发货' && (
                <Col>
                  <span>应付金额:{detail?.orderAmountRealFormat}</span>
                </Col>
              )}

              {
                isAftersaleOrderSource(detail?.orderSource) && detail?.needToPayAmountFormat ? (
                  <Col>
                    <span>需付金额:{detail?.needToPayAmountFormat}</span>
                  </Col>
                ) : null
              }

              <Col>
                <span>实付金额:{detail?.orderAmountRealFormat}</span>
              </Col>

              {
                detail?.orderStatusFormat !== '待审核' &&
                detail?.orderStatusFormat !== '待付尾款' &&
                !(isCustomGoodsOrder(detail?.orderGoodsType) && detail?.orderStatusFormat === '待发货')
                && (
                <Col>
                  <span>已付金额:{detail?.orderAmountPaidFormat}</span>
                </Col>
              )}

              {
                (
                  detail?.orderStatusFormat === '待支付' ||
                  (
                    !isCustomGoodsOrder(detail?.orderGoodsType) &&
                    detail?.orderStatusFormat === '待发货'
                  )
                ) && (
                <Col>
                  <span>待付金额:{detail?.waitTotalFormat}</span>
                </Col>
              )}

              {
                (
                  detail?.orderStatusFormat === '待审核' ||
                  detail?.orderStatusFormat === '待付尾款' ||
                  (isCustomGoodsOrder(detail?.orderGoodsType) && detail?.orderStatusFormat === '待发货')
                ) && (
                <Col>
                  <span>已付定金:{detail?.depositAmountPaidFormat}</span>
                </Col>
              )}

              {
                detail?.orderStatusFormat === '待审核' && (
                <Col>
                  <span>待付定金:{detail?.waitDepositAmountFormat}</span>
                </Col>
              )}

              {
                (
                  detail?.orderStatusFormat === '待付尾款' ||
                  (isCustomGoodsOrder(detail?.orderGoodsType) && detail?.orderStatusFormat === '待发货')
                ) && (
                <Col>
                  <span>已付尾款:{detail?.remainAmountPaidFormat}</span>
                </Col>
              )}

              {
                detail?.orderStatusFormat === '待付尾款' && (
                <Col>
                  <span>待付尾款:{detail?.waitRemainAmountFormat}</span>
                </Col>
              )}

              {
                detail?.orderStatusFormat === '已取消 ' &&
                (
                  detail?.depositAmountPaid > 0 ||
                  detail?.orderAmountPaid > 0 ||
                  detail?.remainAmountPaid > 0 ||
                  IsExcessOrderAmount(detail?.excessPay)
                ) &&
                (
                <Col>
                  <span>需退金额: {detail?.intentRefundAmountFormat}</span>
                </Col>
              )}

              {
                detail?.orderStatusFormat === '已取消 ' &&
                (
                  detail?.depositAmountPaid > 0 ||
                  detail?.orderAmountPaid > 0 ||
                  detail?.remainAmountPaid > 0 ||
                  IsExcessOrderAmount(detail?.excessPay)
                ) &&
                (
                <Col>
                  <span>已退金额: {detail?.hasRefundAmountFormat}</span>
                </Col>
              )}

            </Row>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default PayInfoForCostInfo;
