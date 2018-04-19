import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request(`/api/model/list?${stringify(params)}`);
}

async function detail(params) {
  return request(`/api/model/detail?${stringify(params)}`);
}

async function add(params) {
  return request('/api/model/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function edit(params) {
  return request('/api/model/edit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function remove(params) {
  return request('/api/model/remove', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function update(params) {
  return request('/api/model/update', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export default {
  list,
  detail,
  add,
  edit,
  remove,
  update,
};
