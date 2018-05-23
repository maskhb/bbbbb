/**
 * Created by rebecca on 2018/4/5.
 */
import request from '../utils/request';

/*
*** 支付记录列表
*/
// 查询支付记录列表
async function searchPayOrderHis(params) {
  return request('/json/payment-api/paybehind/searchPayOrderHis', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}

// 导出查询的支付记录
async function exportPayOrderHis(params) {
  return request('/json/payment-api/paybehind/exportPayOrderHis/asynExportMJPayBills', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 保存人工修改的支付记录
async function saveManualTransaction(params) {
  return request('/json/payment-api/paybehind/saveManualTransaction', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 查询人工修改的支付流水
async function searchTransactionManualLogList(params) {
  return request('/json/payment-api/paybehind/searchTransactionManualLogList', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}


/*
 * 支付配置相关
 */
// 获取支付方式列表
async function searchPayTypeAndInfoList(params) {
  return request('/json/payment-api/paybehind/searchPayTypeAndInfoList', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
  });
}

// 更新支付方式信息
async function modifyPayTypeAndInfo(params) {
  return request('/json/payment-api/paybehind/modifyPayTypeAndInfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  searchPayTypeAndInfoList,
  exportPayOrderHis,
  saveManualTransaction,
  searchTransactionManualLogList,
  modifyPayTypeAndInfo,
  searchPayOrderHis,
};
