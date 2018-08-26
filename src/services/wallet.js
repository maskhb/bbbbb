/**
 * Created by rebecca on 2018/4/5.
 */
import request from '../utils/request';

/*
*** 钱包相关
*/
// 获取钱包查询列表接口
async function wallet(params) {
  return request('/mj/ht-mj-account-server/wallet', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
    pagination: true,
  });
}

// 充值钱包接口
async function rechargewallet(params) {
  return request('/mj/ht-mj-account-server/rechargewallet', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 钱包交易明细接口
async function dealwallet(params) {
  return request('/mj/ht-mj-account-server/dealwallet', {
    method: 'POST',
    body: {
      ...params,
    },
    transformResponse(response) {
      return response?.data?.result;
    },
    pagination: true,
  });
}

// 导出钱包交易明细
async function exportwallet(params) {
  return request('/mj/ht-mj-account-server/exportwallet', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  wallet,
  rechargewallet,
  dealwallet,
  exportwallet,
};
