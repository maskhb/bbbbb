import request from '../utils/request';

async function list(params) {
  return request('/api/brand/queryListByPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function detail(params) {
  return request('/api/brand/queryDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function add(params) {
  return request('/api/brand/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function remove(params) {
  return request('/api/brand/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function status(params) {
  return request('/api/brand/update', {
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
  remove,
  status,
};
