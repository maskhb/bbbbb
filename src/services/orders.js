/*
 * @Author: wuhao
 * @Date: 2018-04-04 14:32:15
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-15 16:24:21
 *
 * 订单接口类
 */

import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/mj/ht-mj-order-server';
  return requestBase(baseUrl + url, params);
}

/**
 * 运营后台 订单列表
 * @param {*} params
 */
async function list({ orderQueryVO }) {
  return request('/order/admin/list', {
    method: 'POST',
    body: {
      orderQueryVO,
    },
    pagination: true,
  });
}

/**
 * 审核订单
 */
async function audit({ orderSn, remainAmount, sellerRemark }) {
  return request('/order/admin/audit', {
    method: 'POST',
    body: {
      orderSn,
      remainAmount,
      sellerRemark,
    },
  });
}

/**
 * 取消订单
 */
async function cancel({ orderSn, reason }) {
  return request('/order/admin/cancel', {
    method: 'POST',
    body: {
      orderSn,
      reason,
    },

  });
}
/**
 * 修改发票
 * @param {*} param0
 */
async function invoiceModify({ orderSn, invoiceVO }) {
  return request('/order/admin/invoice/modify', {
    method: 'POST',
    body: {
      orderSn,
      invoiceVO,
    },

  });
}

/**
 * 商品备注
 * @param {*} param0
 */
async function goodsRemark({ orderSn, goodsRemarkVOList }) {
  return request('/order/admin/goods/remark', {
    method: 'POST',
    body: {
      orderSn,
      goodsRemarkVOList,
    },

  });
}

async function detail({ orderId }) {
  return request('/order/admin/detail', {
    method: 'POST',
    body: {
      orderId,
    },
  });
}

/**
 * 修改物流
 * @param {*} param0
 */
async function logisticsModify({ orderSn, logisticsRequestVO }) {
  return request('/order/admin/logistics/modify', {
    method: 'POST',
    body: {
      orderSn,
      logisticsRequestVO,
    },

  });
}

/**
 * 修改订单金额
 * @param {*} param0
 */
async function modifyMoney({ orderSn, remainMoney, discountMoney, orderRemark }) {
  return request('/order/admin/modifyMoney', {
    method: 'POST',
    body: {
      orderSn,
      remainMoney,
      discountMoney,
      orderRemark,
    },

  });
}

/**
 * 订单签收
 * @param {*} param0
 */
async function receipt({ orderSn }) {
  return request('/order/admin/receipt', {
    method: 'POST',
    body: {
      orderSn,
    },

  });
}

/**
 * 添加备注
 * @param {*} param0
 */
async function remarkAdd({ orderSn, orderRemark }) {
  return request('/order/admin/remark/add', {
    method: 'POST',
    body: {
      orderSn,
      orderRemark,
    },
  });
}

/**
 * 订单发货
 * @param {*} param0
 */
async function ship({ orderSn, logisticsRequestVO }) {
  return request('/order/admin/ship', {
    method: 'POST',
    body: {
      orderSn,
      logisticsRequestVO,
    },
  });
}

/**
 * 增加支付
 * @param {*} param0
 */
async function payRecordAdd({ orderSn, money, paymentMethodCode, payStatus, transactionId }) {
  return request('/order/admin/payRecord/add', {
    method: 'POST',
    body: {
      orderSn,
      money,
      paymentMethodCode,
      payStatus,
      transactionId,
    },
  });
}

/**
 * 修改支付记录状态
 * @param {*} param0
 */
async function payRecordUpdate({ paymentRecordId, paymentMethodCode, money, transactionId }) {
  return request('/order/admin/payRecord/update', {
    method: 'POST',
    body: {
      paymentRecordId,
      paymentMethodCode,
      money,
      transactionId,
    },
  });
}

/**
 * 修改收货地址
 * @param {*} param0
 */
async function addressModify({ orderSn, receiptVO }) {
  return request('/order/admin/address/modify', {
    method: 'POST',
    body: {
      orderSn,
      receiptVO,
    },
  });
}

/**
 * 查询支付方式
 */
async function getPaymentMethodList() {
  return request('/order/admin/getPaymentMethodList', {
    method: 'POST',
    body: {

    },
  });
}

/**
 * 查询（运营后台、商家后台）查询订单操作日志
 */
async function queryOrderRelatedLogs(params) {
  return request('/order/admin/queryOrderRelatedLogs', {
    method: 'POST',
    body: params,
    pagination: true,
  });
}

/**
 * 返回商品列表
 * @param {*} param0
 */
async function queryOrderGoods({ type, orderId }) {
  return request('/order/admin/queryOrderGoods', {
    method: 'POST',
    body: {
      orderId,
      type,
    },
  });
}

/**
 * 查询导出总数
 * @param {*} param0
 */
async function queryExportTotalCount({ platform, exportType, orderQueryVO }) {
  return request('/order/admin/queryExportTotalCount', {
    method: 'POST',
    body: {
      platform,
      exportType,
      orderQueryVO,
    },
  });
}

/**
 * 查询订单物流详情
 * @param {*} param0
 */
async function logisticsDetail({ orderId }) {
  return request('/order/wx/logisticsDetail', {
    method: 'POST',
    body: {
      orderId,
    },
  });
}

/**
 * 获取订单列表查询结果总数
 * @param {*} param0
 */
async function queryOrdeListTotalCount({ orderQueryVO }) {
  return request('/order/admin/queryExportTotalCount', {
    method: 'POST',
    body: {
      platform: 1,
      exportType: 0,
      orderQueryVO,
    },
  });
}

export default {
  list,
  audit,
  cancel,
  invoiceModify,
  goodsRemark,
  logisticsModify,
  modifyMoney,
  receipt,
  remarkAdd,
  ship,
  payRecordAdd,
  payRecordUpdate,
  detail,
  addressModify,
  getPaymentMethodList,
  queryOrderRelatedLogs,
  queryOrderGoods,
  queryExportTotalCount,
  logisticsDetail,
  queryOrdeListTotalCount,
};
