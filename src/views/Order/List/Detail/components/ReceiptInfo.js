/*
 * @Author: wuhao
 * @Date: 2018-04-20 10:27:16
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-20 09:12:07
 *
 * 收货信息
 */
import React, { PureComponent } from 'react';

import { Link } from 'dva/router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Card, Row, Col, Icon, Spin, message, Button } from 'antd';

import Authorized from 'utils/Authorized';
import { goTo, goToNewWin } from 'utils/utils';

import ModalAddRemark from '../../../components/ModalAddRemark';
import ModalEditMoney from '../../../components/ModalEditMoney';
import ModalCancelOrder from '../../../components/ModalCancelOrder';
import ModalAuditOrder from '../../../components/ModalAuditOrder';
import ModalConfirmShipment from '../../../components/ModalConfirmShipment';
import ModalConfirmReceipt from '../../../components/ModalConfirmReceipt';
import ModalEditLogistics from '../../../components/ModalEditLogistics';

import ModalEditAddress from '../../../components/ModalEditAddress';
import ModalEditInvoice from '../../../components/ModalEditInvoice';

import {
  getOptionLabelForValue,
  invoiceTypeOptions,
  orderStatusOptions,

  isCustomGoodsOrder,
  IsExcessOrderAmount,
} from '../../../attr';

class ReceiptInfo extends PureComponent {
  static defaultProps = {};

  state = {}

  handleCopyOrder = () => {
    message.success('复制成功');
  }

  handleAddAfterSale = () => {
    const orderId = this.props.match.params.id;
    goTo(`/order/list/aftersale/${orderId}`);
  }

  render() {
    const { className, dispatch, refresh, orders, loading = false } = this.props;
    const colLeftSpan = 8;
    const { detail } = orders || {};
    const { receiptVO, invoiceVO, orderStatus } = detail || {};

    const orderStatusName = getOptionLabelForValue(orderStatusOptions)(detail?.orderStatus);
    const isParentOrder = this.props.match.params.type === '0';
    return (
      <Spin size="large" spinning={loading}>
        <Card title="收货信息" className={`${className}`}>
          <Row>
            <Col span={colLeftSpan}>
              <div>
                <span style={{
                  wordBreak: 'break-all',
                }}
                >收货地址：{receiptVO?.regionName}{
                  receiptVO?.detailedAddress
                }，{
                  receiptVO?.consigneeName
                }，{
                  receiptVO?.consigneeMobile
                }
                </span>
                {
                  (
                    orderStatusName === '待支付' ||
                    orderStatusName === '待审核' ||
                    orderStatusName === '待付尾款' ||
                    orderStatusName === '待发货') &&
                  (
                    <Authorized authority={['OPERPORT_JIAJU_ORDERDETAILS_MODIFYADDRESS']}>
                      <ModalEditAddress
                        dispatch={dispatch}
                        orders={orders}
                        params={orders?.detail}
                        refresh={refresh}
                      />
                    </Authorized>
                  )
                }

              </div>
              <div>
                <span style={{
                  wordBreak: 'break-all',
                }}
                >发票信息：{
                  getOptionLabelForValue(invoiceTypeOptions)(invoiceVO?.type)
                }{
                  getOptionLabelForValue(invoiceTypeOptions)(invoiceVO?.type) !== '不开发票' ? `， ${invoiceVO?.title || ''}${invoiceVO?.taxId ? `， ${invoiceVO?.taxId}` : ''}， ${invoiceVO?.content || ''}` : ''
                }
                </span>
                {
                  (
                    orderStatusName === '待支付' ||
                    orderStatusName === '待审核' ||
                    orderStatusName === '待付尾款' ||
                    orderStatusName === '待发货') &&
                  (
                    <Authorized authority={['OPERPORT_JIAJU_ORDERDETAILS_MODIFYINVOICE']}>
                      <ModalEditInvoice
                        dispatch={dispatch}
                        orders={orders}
                        params={orders?.detail}
                        refresh={refresh}
                      />
                    </Authorized>
                  )
                }
              </div>
            </Col>
            <Col span={24 - colLeftSpan}>
              <div>
                <Icon type="info-circle" />
                <span>订单状态：{getOptionLabelForValue(orderStatusOptions)(orderStatus)}</span>
              </div>
              {
                (
                  orderStatusName === '已取消 ' ||
                  orderStatusName === '已取消'
                ) &&
                detail?.cancelRemark &&
                (
                  <div className="cancle-remark">
                    <span>取消理由：{detail?.cancelRemark}</span>
                  </div>
                )
              }
              {
                (
                  this.props.match.params.type === '0' &&
                  orderStatusName === '已取消 ' &&
                  IsExcessOrderAmount(detail?.excessPay)
                ) && (
                  <div className="cancle-remark-excesspay">
                    <span>该订单产生超额支付，可操作退款</span>
                  </div>
                )
              }
              {

                (
                  this.props.match.params.type === '1' &&
                  detail?.isOrderAftersaleFormat
                ) &&
                (
                  <div className="cancle-remark">
                    <a onClick={() => {
                      goToNewWin(detail?.orderAftersaleOperFormat);
                    }}
                    >该订单产生售后行为，点击查看详情
                    </a>
                  </div>
                )

              }

              <div>
                {
                 (orderStatusName === '待支付' || (orderStatusName === '待付尾款' && isCustomGoodsOrder(detail?.orderGoodsType))) &&
                 (
                 <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_CHANGEAMOUNT']}>
                   <ModalEditMoney
                     dispatch={dispatch}
                     orders={orders}
                     params={orders?.detail}
                     refresh={refresh}
                   />
                 </Authorized>
                 )
                }
                {
                  isParentOrder ? null : [
                    orderStatusName === '待审核' && isCustomGoodsOrder(detail?.orderGoodsType) ? (
                      <Authorized key="c_c_order_list_detail_check" authority={['OPERPORT_JIAJU_ORDERLIST_CHECK']}>
                        <ModalAuditOrder
                          dispatch={dispatch}
                          orders={orders}
                          params={orders?.detail}
                          refresh={refresh}
                        />
                      </Authorized>
                    ) : null,
                    orderStatusName === '待发货' ? (
                      <Authorized key="c_c_order_list_detail_delivery" authority={['OPERPORT_JIAJU_ORDERLIST_DELIVERY']}>
                        <ModalConfirmShipment
                          dispatch={dispatch}
                          orders={orders}
                          params={orders?.detail}
                          refresh={refresh}
                        />
                      </Authorized>
                    ) : null,
                    orderStatusName === '待收货' ? (
                      <Authorized key="c_c_order_list_detail_sign" authority={['OPERPORT_JIAJU_ORDERLIST_SIGN']}>
                        <ModalConfirmReceipt
                          dispatch={dispatch}
                          orders={orders}
                          params={orders?.detail}
                          refresh={refresh}
                        />
                      </Authorized>
                    ) : null,
                    orderStatusName === '待收货' ? (
                      <Authorized key="c_c_order_list_detail_modifylogistics" authority={['OPERPORT_JIAJU_ORDERLIST_MODIFYLOGISTICS']}>
                        <ModalEditLogistics
                          dispatch={dispatch}
                          orders={orders}
                          params={orders?.detail}
                          refresh={refresh}
                        />
                      </Authorized>
                    ) : null,
                  ]
                }
                {
                  orderStatusName !== '已取消 ' &&
                  orderStatusName !== '已取消' &&
                  orderStatusName !== '已完成' && (
                    <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_CLOSE']}>
                      <ModalCancelOrder
                        dispatch={dispatch}
                        orders={orders}
                        params={orders?.detail}
                        refresh={refresh}
                      />
                    </Authorized>
                  )
                }

                {
                  (
                    this.props.match.params.type === '0' &&
                    orderStatusName === '已取消 ' &&
                    // IsExcessOrderAmount(detail?.excessPay)
                    detail?.needShowAfterSaleBtnFormat
                  ) && (
                    <Authorized authority={null}>
                      <Button type="primary" onClick={this.handleAddAfterSale}>新增售后单</Button>
                    </Authorized>
                  )
                }

                <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_ADDNOTES']}>
                  <ModalAddRemark
                    btnTitle="备注"
                    dispatch={dispatch}
                    orders={orders}
                    params={orders?.detail}
                    refresh={refresh}
                  />
                </Authorized>
              </div>
            </Col>
          </Row>
          <Row>
            <div />
          </Row>
          <Row>
            <Col span={colLeftSpan}>
              <div>
                <span>{this.props.match.params.type === '0' ? '母单号' : '订单号'}：{detail?.orderSn}</span>
                <CopyToClipboard text={detail?.orderSn} onCopy={this.handleCopyOrder}>
                  <a>[复制]</a>
                </CopyToClipboard>
              </div>
              {
                detail?.parentOrderSn && (
                  <div>
                    <span>母单号：{detail?.parentOrderSn}</span>
                  </div>
                )
              }
              <div>
                <span>用户：</span>
                <Link to={`/member/list/detail/${detail?.createdBy}`}>{detail?.userName}  {detail?.userMobile}</Link>
              </div>
              <div>
                <span>留言：{receiptVO?.userRemark}</span>
              </div>
            </Col>
            <Col span={24 - colLeftSpan}>
              {
                detail?.factoryRemark && (
                <div>
                  <span>厂家备注：{detail?.factoryRemark}</span>
                </div>
              )}

              {
                detail?.sellerRemark && (
                <div>
                  <span>商家备注：{detail?.sellerRemark}</span>
                </div>
              )}

              {
                detail?.orderRemark && (
                <div>
                  <span>平台备注：{detail?.orderRemark}</span>
                </div>
              )}

            </Col>
          </Row>
        </Card>
      </Spin>
    );
  }
}

export default ReceiptInfo;
