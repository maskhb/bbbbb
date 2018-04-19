import request from '../utils/request';

async function list(params) {
  return request('/mj/goods/queryListByPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function detail(params) {
  return request('/mj/goods/queryDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function add(params) {
  return request('/mj/goods/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function edit(params) {
  return request('/mj/goods/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function remove(params) {
  return request('/mj/goods/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function audit(params) {
  return request('/mj/goods/updateAuditStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function online(params) {
  return request('/mj/goods/updateStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function copy(params) {
  return request('/mj/goods/copy', {
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
  audit,
  online,
  copy,
};
