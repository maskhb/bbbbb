import { stringify } from 'qs';
import request from '../utils/request';

async function querylist(params) {
  return request('/merchantBase/queryList', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function list(params) {
  return request(`/api/business/list?${stringify(params)}`);
}

async function add(params) {
  return request('/api/business/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function edit(params) {
  return request('/api/business/edit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function remove(params) {
  return request('/api/business/remove', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function exsit(params) {
  return request('/api/business/exsit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export default {
  querylist,
  list,
  add,
  edit,
  remove,
  exsit,
};
