import request from '../utils/request';

async function list(params) {
  return request('/api/goods/propertyValue/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function remove(params) {
  return request('/api/goods/propertyValue/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function add(params) {
  return request('/api/goods/propertyValue/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function edit(params) {
  return request('/api/goods/propertyValue/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function detail(params) {
  return request('/api/goods/propertyValue/queryDetail', {
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
