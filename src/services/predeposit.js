/**
 * Created by rebecca on 2018/4/5.
 */
import request from '../utils/request';

/*
*** 支付记录列表
*/
// 查询支付记录列表
async function predepositList(params) {
  return request('/api/ht-mj-account-server/predeposit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/*
 * 支付配置相关
 */
// 获取支付方式列表
async function searchPayTypeAndInfoList(params) {
  return request('/payment/paybehind/searchPayTypeAndInfoList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 更新支付方式信息
async function modifyPayTypeAndInfo(params) {
  return request('/payment/paybehind/modifyPayTypeAndInfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  searchPayTypeAndInfoList,
  modifyPayTypeAndInfo,
  predepositList,
};
