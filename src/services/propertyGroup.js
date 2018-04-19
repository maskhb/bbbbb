import request from '../utils/request';

async function list(params) {
  return request('/api/ht-mj-goods-server/propertyGroup/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function remove(params) {
  return request('/api/ht-mj-goods-server/propertyGroup/list/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function add(params) {
  return request('/api/goods/propertyGroup/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function edit(params) {
  return request('/api/goods/propertyGroup/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function detail(params) {
  return request('/api/goods/propertyGroup/queryDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  list,
  detail,
  add,
  edit,
  remove,
};
