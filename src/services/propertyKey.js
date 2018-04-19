import request from '../utils/request';

async function list(params) {
  return request('/api/goods/propertyKey/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function remove(params) {
  return request('/api/goods/propertyKey/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function add(params) {
  return request('/api/goods/propertyKey/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function edit(params) {
  return request('/api/goods/propertyKey/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function detail(params) {
  return request('/api/goods/propertyKey/queryDetail', {
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
