// eslint-disable-next-line
import baseRequest from '../utils/request';

const request = (url, params) => {
  return baseRequest(`/mj/ht-mj-order-server/${url}`, params);
};

async function list(params) {
  return request('jiaJuQuanRefundApply/list', {
    method: 'POST',
    body: {
      jiaJuQuanRefundApplyListQueryVO: {
        ...params,
        pageInfo: params.pageInfo || {
          pageSize: 10,
        },
      },
    },
    pagination: true,
  });
}

async function log(params) {
  return request('jiaJuQuanRefundApply/log/list', {
    method: 'POST',
    body: {
      jiaJuQuanRefundApplyOperationLogListQueryVO: {
        ...params,
        pageInfo: params.pageInfo || {
          pageSize: 10,
        },
      },
    },
    pagination: true,
  });
}

async function approve(params) {
  return request('jiaJuQuanRefundApply/approve', {
    method: 'POST',
    body: {
      jiaJuQuanRefundApplyApproveVO: params,
    },
  });
}

async function sync(params) {
  return request('jiaJuQuanRefundApply/sync', {
    method: 'POST',
    body: {
      jiaJuQuanRefundApplySyncVO: params,
    },
  });
}

export default {
  list,
  approve,
  sync,
  log,
};
