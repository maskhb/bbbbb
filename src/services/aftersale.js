/*
 * @Author: wuhao
 * @Date: 2018-06-21 14:37:16
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-27 18:35:21
 *
 * 售后接口类
 */
import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/mj/ht-mj-aftersale-server';
  return requestBase(baseUrl + url, params);
}

/**
 * 查询售后申请列表
 * @param {*} applyOrderQueryVO 查询条件
 */
async function queryApplyOrderList(applyOrderQueryVO) {
  return request('/aftersale/query/applyOrderList', {
    method: 'POST',
    body: {
      applyOrderQueryVO,
    },
    pagination: true,
  });
}

/**
 * 查询退货/换货单列表
 * @param {*} returnExchangeQueryVO
 */
async function queryReturnExchangeList(returnExchangeQueryVO) {
  return request('/aftersale/query/returnExchangeList', {
    method: 'POST',
    body: {
      returnExchangeQueryVO,
    },
    pagination: true,
  });
}

/**
 * 查询退货/换货单列表
 * @param {*} returnExchangeQueryVO
 */
async function queryRefundOrderList(refundOrderQueryVO) {
  return request('/aftersale/query/returnExchangeList', {
    method: 'POST',
    body: {
      refundOrderQueryVO,
    },
    pagination: true,
  });
}

/**
 * 查询换货单详情
 * @param {String} exchangeOrderSn 换货单编号
 */
async function queryExchangeOrderDetail({ returnSn }) {
  return request('/aftersale/query/exchangeOrderDetail', {
    method: 'POST',
    body: {
      returnSn,
    },
  });
}

/**
 * 查询退货单详情
 * @param {String} returnSn 退货单编号
 */
async function queryReturnOrderDetail({ returnSn }) {
  return request('/aftersale/query/returnOrderDetail', {
    method: 'POST',
    body: {
      returnSn,
    },
  });
}

/**
 * 查询退款单详情
 * @param {String} refundSn 退款单编号
 */
async function queryRefundOrderDetail({ refundSn }) {
  return request('/aftersale/query/refundOrderDetail', {
    method: 'POST',
    body: {
      refundSn,
    },
  });
}


/**
 * 查询售后申请表详情
 * @param {String} applyOrderSn 售后申请单编号
 */
async function queryApplyOrderDetail({ applyOrderSn }) {
  return request('/aftersale/query/applyOrderDetail', {
    method: 'POST',
    query: {
      applyOrderSn,
    },
  });
}

/**
 * 确认签收 -- 退货单
 * @param {Number} applyOrderId 售后申请单ID
 */
async function confirmReceiptForReturnOrder({ applyOrderId }) {
  return request('/aftersale/return/confirmReceipt', {
    method: 'POST',
    body: {
      applyOrderId,
    },
  });
}

/**
 * 退货/换货单 -- 新增退货单接口
 * @param {*} ReturnOrderVo  售后申请单ID
 */
async function returnUpdateAddress(addressVo) {
  return request('/aftersale/return/confirmReceipt', {
    method: 'POST',
    body: {
      addressVo,
    },
  });
}

/**
 * 售后 - 新增换货单
 */
async function applyOrderAddExchangeOrder(orderGoodsExchangePaymentVo) {
  return request('/aftersale/applyOrder/addExchangeOrder', {
    method: 'POST',
    body: {
      orderGoodsExchangePaymentVo,
    },
  });
}

/**
 * 售后 - 确认审核
 */
async function applyOrderAuditApplyOrder(updateAndAuditApplyVo) {
  return request('/aftersale/applyOrder/auditApplyOrder', {
    method: 'POST',
    body: {
      updateAndAuditApplyVo,
    },
  });
}

/**
 * 售后 - 取消审核
 */
async function applyOrderCancelApplyOrder({ applyOrderId }) {
  return request('/aftersale/applyOrder/cancelApplyOrder', {
    method: 'POST',
    query: {
      applyOrderId,
    },
  });
}

/**
 * 售后 - 检查结算状态
 */
async function applyOrderCheckSettlementStatus(auditVo) {
  return request('/aftersale/applyOrder/checkSettlementStatus', {
    method: 'POST',
    body: {
      auditVo,
    },
  });
}

/**
 * 售后 - 检查结算状态
 */
async function applyOrderCheckAuditStatus({ applyOrderId }) {
  return request('/aftersale/applyOrder/checkAuditStatus', {
    method: 'POST',
    query: {
      applyOrderId,
    },
  });
}

/**
 * 售后 - 保存申请售后信息
 */
async function applyOrderSaveApplyDetailInfo(applyInfoDetailVo) {
  return request('/aftersale/applyOrder/saveApplyDetailInfo', {
    method: 'POST',
    body: {
      applyInfoDetailVo,
    },
  });
}

/**
 * 售后 - 关闭售后申请单
 */
async function applyOrderShutdownApplyOrder({ applyOrderId }) {
  return request('/aftersale/applyOrder/shutdownApplyOrder', {
    method: 'POST',
    query: {
      applyOrderId,
    },
  });
}

/**
 * 售后 - 更新售后单
 */
async function applyOrderUpdateApplyDetailInfo(applyInfoDetailVo) {
  return request('/aftersale/applyOrder/updateApplyDetailInfo', {
    method: 'POST',
    body: {
      applyInfoDetailVo,
    },
  });
}

/**
 * 售后 - 查询原订单
 * @param {*} param0
 */
async function queryOrderDetails({ orderSn }) {
  return request('/aftersale/query/queryOrder', {
    method: 'POST',
    body: {
      orderSn,
    },
  });
}

/**
 * 获取售后原因列表
 */
async function getAfterSaleReasons({ afterSaleType }) {
  return request('/aftersale/query/getAfterSaleReasons', {
    method: 'POST',
    query: {
      afterSaleType,
    },
  });
}
/*
*** 换货单
*/
// 查询换货单详情
async function goOpenExchangeOrder({ applyOrderSn }) {
  return request('/aftersale/query/goOpenExchangeOrder', {
    method: 'POST',
    body: {
      applyOrderSn,
    },
  });
}

/*
*** 换货单
*/
// 预存款钱包查询
async function accountDetail(params) {
  return requestBase('/mj/ht-mj-account-server/getAcountsByAccountId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/*
*** 新增换货单
*/
// 修改地址
async function updateAddress(params) {
  return request('/aftersale/return/updateAddress', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/*
*** 新增换货单
*/
// 新增
async function addExchangeOrder(params) {
  return request('/aftersale/applyOrder/addExchangeOrder', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 检查换货商品的上下架状态及库存是否充足
 * @param {*} params
 */
async function checkExchangeGoods(params) {
  return request('/aftersale/query/checkExchangeGoods', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryReturnExchangeList,
  queryApplyOrderList,
  queryRefundOrderList,
  queryOrderDetails,

  queryApplyOrderDetail,
  queryExchangeOrderDetail,
  queryReturnOrderDetail,
  queryRefundOrderDetail,

  confirmReceiptForReturnOrder,
  returnUpdateAddress,

  applyOrderUpdateApplyDetailInfo,
  applyOrderShutdownApplyOrder,
  applyOrderSaveApplyDetailInfo,
  applyOrderCheckSettlementStatus,
  applyOrderCheckAuditStatus,
  applyOrderCancelApplyOrder,
  applyOrderAuditApplyOrder,
  applyOrderAddExchangeOrder,
  getAfterSaleReasons,

  goOpenExchangeOrder,
  accountDetail,
  updateAddress,
  addExchangeOrder,

  checkExchangeGoods,
};
