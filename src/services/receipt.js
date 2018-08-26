/**
 * 电子收据接口
 */

import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/mj/ht-mj-order-server';
  return requestBase(baseUrl + url, params);
}

/**
 * 查询收据列表
 * @param queryVO
 * @returns {Promise<*>}
 */
async function queryList(queryVO) {
  return request('/order/eleReceipt/list', {
    method: 'POST',
    body: {
      queryVO,
    },
    pagination: true,
  });
}

/**
 * 查询收据详情
 * @param eleReceiptId
 * @returns {Promise<*>}
 */
async function queryDetail({ eleReceiptId }) {
  return request('/order/eleReceipt/detail', {
    method: 'POST',
    body: {
      eleReceiptId,
    },
  });
}

/**
 * 根据手机号码查询收货人已支付的待开具收据的列表
 * @param queryVO
 * @returns {Promise<*>}
 */
async function queryPrintList(queryVO) {
  return request('/order/eleReceipt/print/list', {
    method: 'POST',
    body: {
      queryVO,
    },
  });
}

/**
 * 保存收据
 * @param receiptInfoVO
 * @returns {Promise<*>}
 */
async function saveReceipt(receiptInfoVO) {
  return request('/order/eleReceipt/save', {
    method: 'POST',
    body: {
      receiptInfoVO,
    },
  });
}

/**
 * 更新收据状态
 * @param eleReceiptId
 * @returns {Promise<*>}
 */
async function updateStatus({ eleReceiptId }) {
  return request('/order/eleReceipt/status/update', {
    method: 'POST',
    body: {
      eleReceiptId,
    },
  });
}

export default {
  queryList,
  queryDetail,
  queryPrintList,
  saveReceipt,
  updateStatus,
};
