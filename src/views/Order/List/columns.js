import React from 'react';

import { Button, Tag } from 'antd';
import moment from 'moment';
import { Link } from 'dva/router';
import { format } from 'components/Const';

import Authorized from 'utils/Authorized';
import { fenToYuan } from 'utils/money';

import ModalAddRemark from '../components/ModalAddRemark';
import ModalAuditOrder from '../components/ModalAuditOrder';
import ModalCancelOrder from '../components/ModalCancelOrder';
import ModalConfirmReceipt from '../components/ModalConfirmReceipt';
import ModalConfirmShipment from '../components/ModalConfirmShipment';
import ModalEditLogistics from '../components/ModalEditLogistics';
import ModalEditMoney from '../components/ModalEditMoney';
import ModalRemarkGoods from '../components/ModalRemarkGoods';

import {
  getOptionLabelForValue,
  orderStatusOptions,
  orderSourceOptions,
  whenExcessTypeOptions,
  needInvoiceListOptions,
  GoodsTypeForOrderShowOptions,

  isCustomGoodsOrder,
  IsExcessOrderAmount,
  isSetMealOrderGoodsInfo,
  isPaidOrder,
} from '../attr';

import { transformGiftAmount } from '../transform';


export default () => {
  return {
    columns: [
      {
        title: '商品信息',
        dataIndex: 'goodsName',
        render: (val, record) => {
          let tagName = getOptionLabelForValue(GoodsTypeForOrderShowOptions)(record.goodsType);
          if (isSetMealOrderGoodsInfo(record.isPackage)) {
            tagName = '套餐';
          }

          return (
            <div className="order_list_table_goodsInfo">
              <div>
                <img className="order_list_table_goodsInfo_img" src={record.mainImgUrl || ''} alt="" />
              </div>
              <div className="flex-1">
                <div className="order_list_table_goodsInfo_name">
                  <span>
                    {val}
                  </span>
                </div>
                <div className="order_list_table_goodsInfo_desc">
                  <span>{record.propertyValue}</span>
                </div>
                {
                  tagName ? (
                    <Tag color="orange" className="order_list_table_goodsInfo_tag">{tagName}</Tag>
                  ) : null
                }
              </div>
            </div>
          );
        },
      },
      {
        title: '单价/数量',
        width: '150px',
        dataIndex: 'goodsNum',
        render: (text, row) => {
          return `￥${row.salePriceFormat} x ${row.goodsNum}`;
        },
      },
      {
        title: '用户',
        width: '120px',
        dataIndex: 'userName',
        render: (text, row, index, record) => {
          const { orderGoodsVOList } = record;
          return {
            children: (
              <div className="order_list_table_user">
                <Link to={`/member/list/detail/${record.createdBy}`}>
                  <span>{record.userName}</span>
                  <span>{record.userMobile}</span>
                </Link>
              </div>
            ),
            props: {
              rowSpan: index === 0 ? orderGoodsVOList.length : 0,
            },
          };
        },
      },
      {
        title: '订单金额',
        width: '200px',
        dataIndex: 'orderAmount',
        render: (text, row, index, record) => {
          const { orderGoodsVOList } = record;
          const orderStatusName = getOptionLabelForValue(orderStatusOptions)(record.orderStatus);
          const giftAmount = transformGiftAmount(orderGoodsVOList);

          return {
            children: (
              <div className="order_list_table_money">
                <span>订单金额：{record.orderTotalFormat}</span>
                <span>商家优惠：{record.merchantDiscountAmountFormat}</span>
                {/* <span>满减优惠：{fenToYuan(record.fullDiscountAmount)}</span>
                <span>优 惠 券：{fenToYuan(record.couponAmount)}</span> */}
                {
                  giftAmount > 0 && (
                    orderStatusName === '待发货' ||
                    orderStatusName === '待收货' ||
                    orderStatusName === '已完成' ||
                    orderStatusName === '已取消'
                  ) &&
                  <span>赠品优惠:{fenToYuan(giftAmount)}</span>
                }
                <span>实付金额：{record.orderAmountRealFormat}</span>

                {
                  isCustomGoodsOrder(record?.orderGoodsType) ? [
                    <span key="c_order_depositAmountPaidFormat">已付定金 : {record.depositAmountPaidFormat}</span>,
                    orderStatusName === '待支付' ? <span key="c_order_waitDepositAmountFormat">待付定金: {record.waitDepositAmountFormat}</span> : null,

                    orderStatusName !== '待支付' &&
                    orderStatusName !== '待审核'
                     ? (
                       <span key="c_order_remainAmountPaidFormat">已付尾款: {record.remainAmountPaidFormat}</span>
                    ) : null,

                    orderStatusName === '待付尾款' ? (
                      <span key="c_order_waitRemainAmountFormat">待付尾款:
                        {record.waitRemainAmountFormat}
                      </span>
                    ) : null,

                  ] : [
                    <span key="c_order_orderAmountPaidFormat">已付金额：{record.orderAmountPaidFormat}</span>,
                    orderStatusName === '待支付' ? <span key="c_order_waitTotalFormat">待付金额：{record.waitTotalFormat}</span> : null,
                  ]
                }

                {
                  (
                    orderStatusName === '已取消' ||
                    orderStatusName === '已取消 '
                  ) &&
                  (
                    !(
                      record.isParentOrder &&
                      isPaidOrder(record.payStatus)
                    )
                  ) &&
                  (
                    record.depositAmountPaid > 0 ||
                    record.orderAmountPaid > 0 ||
                    record.remainAmountPaid > 0 ||
                    IsExcessOrderAmount(record.excessPay)
                  ) && [
                    <span key="c_order_intentRefundAmountFormat">需退金额: {record.intentRefundAmountFormat}</span>,
                    <span key="c_order_hasRefundAmountFormat">已退金额: {record.hasRefundAmountFormat}</span>,
                  ]

                }
              </div>
            ),
            props: {
              rowSpan: index === 0 ? orderGoodsVOList.length : 0,
            },
          };
        },
      },
      {
        title: '收货信息',
        width: '220px',
        dataIndex: 'address',
        render: (text, row, index, record) => {
          const { orderGoodsVOList } = record;
          return {
            children: (
              <div className="order_list_table_address">
                <span>收货人：{record.receiptVO?.consigneeName}</span>
                <span>收货人手机号：{record.receiptVO?.consigneeMobile}</span>
                <span>收货地址：{record.receiptVO?.detailedAddressShowFormat}</span>
                <span>留言：{record.receiptVO?.userRemark}</span>
              </div>
            ),
            props: {
              rowSpan: index === 0 ? orderGoodsVOList.length : 0,
            },
          };
        },
      },
      {
        title: '订单状态',
        width: '100px',
        dataIndex: 'orderStatus',
        render: (text, row, index, record) => {
          const { orderGoodsVOList } = record;

          return {
            children: getOptionLabelForValue(orderStatusOptions)(record.orderStatus),
            props: {
              rowSpan: index === 0 ? orderGoodsVOList.length : 0,
            },
          };
        },
      },
      // {
      //   title: '售后',
      //   dataIndex: 'id',
      // },
      // {
      //   title: '结算状态',
      //   dataIndex: 'id',
      // },
      {
        title: '操作',
        width: '120px',
        dataIndex: 'oper',
        render: (text, row, index, record, {
          dispatch,
          orders,
          propertyKey,
          goods,
        }, refreshTableOrderList) => {
          const { orderGoodsVOList } = record;
          const orderStatusName = getOptionLabelForValue(orderStatusOptions)(record.orderStatus);
          return {
            children: (
              <div className="order_list_table_oper">
                <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_DETAILS']}>
                  <Button onClick={() => {
                    window.open(`#/order/list/detail/${record.isParentOrder ? 0 : 1}/${record.orderId}`, '_blank');
                  }}
                  >
                    查看详情
                  </Button>
                </Authorized>
                {
                  (orderStatusName === '待支付' || (orderStatusName === '待付尾款' && isCustomGoodsOrder(record?.orderGoodsType))) &&
                  (
                    <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_CHANGEAMOUNT']}>
                      <ModalEditMoney
                        dispatch={dispatch}
                        orders={orders}
                        params={record}
                        refresh={refreshTableOrderList}
                      />
                    </Authorized>
                  )
                }
                {
                  record.isParentOrder ? null : [
                    orderStatusName === '待审核' && isCustomGoodsOrder(record?.orderGoodsType) ? (
                      <Authorized key="c_order_auth_check" authority={['OPERPORT_JIAJU_ORDERLIST_CHECK']}>
                        <ModalAuditOrder
                          dispatch={dispatch}
                          orders={orders}
                          params={record}
                          refresh={refreshTableOrderList}
                        />
                      </Authorized>
                    ) : null,
                    orderStatusName === '待发货' ? (
                      <Authorized key="c_order_auth_delivery" authority={['OPERPORT_JIAJU_ORDERLIST_DELIVERY']}>
                        <ModalConfirmShipment
                          dispatch={dispatch}
                          orders={orders}
                          params={record}
                          refresh={refreshTableOrderList}
                        />
                      </Authorized>
                    ) : null,
                    orderStatusName === '待发货' && isCustomGoodsOrder(record?.orderGoodsType) ? (
                      <Authorized key="c_order_auth_remarkgoods" authority={['OPERPORT_JIAJU_ORDERLIST_REMARKGOODS']}>
                        <ModalRemarkGoods
                          dispatch={dispatch}
                          orders={orders}
                          params={record}
                          propertyKey={propertyKey}
                          goods={goods}
                          refresh={refreshTableOrderList}
                        />
                      </Authorized>
                    ) : null,
                    orderStatusName === '待收货' ? (
                      <Authorized key="c_order_auth_sign" authority={['OPERPORT_JIAJU_ORDERLIST_SIGN']}>
                        <ModalConfirmReceipt
                          dispatch={dispatch}
                          orders={orders}
                          params={record}
                          refresh={refreshTableOrderList}
                        />
                      </Authorized>
                    ) : null,
                    orderStatusName === '待收货' ? (
                      <Authorized key="c_order_auth_modifylogistics" authority={['OPERPORT_JIAJU_ORDERLIST_MODIFYLOGISTICS']}>
                        <ModalEditLogistics
                          dispatch={dispatch}
                          orders={orders}
                          params={record}
                          refresh={refreshTableOrderList}
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
                      params={record}
                      refresh={refreshTableOrderList}
                    />
                  </Authorized>
                )}


              </div>
            ),
            props: {
              rowSpan: index === 0 ? orderGoodsVOList.length : 0,
            },
          };
        },
      },
    ],
    parentRender: (text, row, idx, { dispatch, orders }, refreshTableOrderList) => {
      return (
        <div className="order_list_table_title_bar">
          <span>{row.isParentOrder ? '母单号' : '订单号'}：{row.orderSn}</span>
          <span>下单时间：{moment(row.createdTime).format(format)}</span>
          <span>订单来源：{getOptionLabelForValue(orderSourceOptions)(row.orderSource)}</span>
          <span>所属项目：{row.communityName}</span>
          {
            !row.isParentOrder && row.merchantName && row.merchantName.length > 0 && (
              <span>所属商家：{row.merchantName}</span>
            )
          }

          {
            row.factoryName && row.factoryName.length > 0 && (
              <span>所属厂商：{row.factoryName}</span>
            )
          }

          {
            !row.isParentOrder && row.needInvoice > 0 && (
              <span>需要发票：{getOptionLabelForValue(needInvoiceListOptions)(row.invoiceVO?.type) || '否'}</span>
            )
          }

          {
            row.excessPay > 0 && (
              <span>是否超额：{getOptionLabelForValue(whenExcessTypeOptions)(row.excessPay) || '否'}</span>
            )
          }
          <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_ADDNOTES']}>
            <ModalAddRemark
              btnClassName="order_list_table_btn_addremark"
              dispatch={dispatch}
              orders={orders}
              params={row}
              refresh={refreshTableOrderList}
            />
          </Authorized>
        </div>
      );
    },
    childrenTableRemarks: (record) => {
      const descArr = [];

      if (record?.sellerRemark && record?.sellerRemark?.length > 0) {
        descArr.push((
          <span key="c_order_child_desc_sellerRemark">商家备注：{record.sellerRemark}</span>
        ));
      }

      if (record?.factoryRemark && record?.factoryRemark?.length > 0) {
        descArr.push((
          <span key="c_order_child_desc_factoryRemark">厂家备注：{record.factoryRemark}</span>
        ));
      }

      if (record?.orderRemark && record?.orderRemark?.length > 0) {
        descArr.push((
          <span key="c_order_child_desc_orderRemark">平台备注：{record.orderRemark}</span>
        ));
      }

      return descArr.length > 0 ? descArr : null;
    },
    childrenDataSource: (record) => {
      return record?.orderGoodsVOList;
    },
  };
};
