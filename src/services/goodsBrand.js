import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/brand/queryListByPage', {
    method: 'POST',
    body: {
      brandVoQ: {
        ...params,
      },
    },
    pagination: true,
  });
}

async function detail(params) {
  return request('/mj/ht-mj-goods-server/brand/queryDetail', {
    method: 'POST',
    body: {
      brandVoQ: {
        ...params,
      },
    },
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/brand/save', {
    method: 'POST',
    body: {
      brandVoS: {
        ...params,
      },
    },
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/brand/delete', {
    method: 'POST',
    body: {
      brandVoD: {
        ...params,
      },
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-goods-server/brand/update', {
    method: 'POST',
    body: {
      brandVoU: {
        ...params,
      },
    },
  });
}

async function status(params) {
  return request('/mj/ht-mj-goods-server/brand/update', {
    method: 'POST',
    body: {
      brandVoU: {
        ...params,
      },
    },
  });
}

export default {
  list,
  detail,
  add,
  edit,
  remove,
  status,
};
