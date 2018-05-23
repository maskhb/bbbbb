/**
 * Created by rebecca on 2018/4/5.
 */
import request from '../utils/request';

/*
*** 预存款列表
*/
// 查询预存款列表
async function predepositList(params) {
  return request('/mj/ht-mj-account-server/predeposit', {
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

// 预存款充值
async function rechargepredeposit(params) {
  return request('/mj/ht-mj-account-server/rechargepredeposit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 设置预存款有效期
async function validpredeposit(params) {
  return request('/mj/ht-mj-account-server/validpredeposit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/*
*** 交易明细
*/
// 获取预存款交易明细
async function dealpredeposit(params) {
  return request('/mj/ht-mj-account-server/dealpredeposit', {
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

// 导出预存款交易明细
async function exportpredeposit(params) {
  return request('/mj/ht-mj-account-server/exportpredeposit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/*
*** 操作日志
*/
// 查询预存款操作日志
async function predepositlogsbypage(params) {
  return request('/mj/ht-mj-account-server/predepositlogsbypage', {
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


export default {
  rechargepredeposit,
  predepositList,
  validpredeposit,
  dealpredeposit,
  exportpredeposit,
  predepositlogsbypage,
};
