import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  // return request(`https://ht-yunying-sit.htmimi.com/2.0/api/json/dr-goods-api/decorate/platform/space/list?${stringify(params)}`);
  return request(`/api/goods/list?${stringify(params)}`);
}

async function detail(params) {
  return request(`/api/goods/detail?${stringify(params)}`);
}

async function add(params) {
  return request('/api/goods/add', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function edit(params) {
  return request('/api/goods/edit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function remove(params) {
  return request('/api/goods/remove', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function audit(params) {
  return request('/api/goods/audit', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function unit() {
  return request('/api/goods/unit', {
    method: 'POST',
    body: {},
  });
}

export default {
  list,
  detail,
  add,
  edit,
  remove,
  audit,
  unit,
};
