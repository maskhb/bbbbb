import request from '../utils/request';
/* 查询退款单列表 */
async function refundOrderList(params) {
  return request('mj/ht-mj-aftersale-server/aftersale/query/refundOrderList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 查询退款单详情 */
async function refundOrderDetail(params) {
  return request('mj/ht-mj-aftersale-server/aftersale/query/refundOrderDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function executeRefund(params) {
  return request('mj/ht-mj-aftersale-server/aftersale/refund/executeRefund', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function agreeRefund(params) {
  return request('mj/ht-mj-aftersale-server/aftersale/refund/agreeRefund', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function cancelRefund(params) {
  return request('mj/ht-mj-aftersale-server/aftersale/refund/cancelRefund', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  refundOrderList,
  refundOrderDetail,
  executeRefund,
  agreeRefund,
  cancelRefund,
};

