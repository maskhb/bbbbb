import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request('/space/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function enable(params) {
  return request(`/space/enable?${stringify(params)}`);
}
async function disable(params) {
  return request(`/space/disable?${stringify(params)}`);
}
async function remove(params) {
  return request(`/space/delete?${stringify(params)}`);
}
async function link(params) {
  return request(`/space/link?${stringify(params)}`);
}
async function detail(params) {
  return request(`/space/queryDetail?${stringify(params)}`);
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
  disable,
  enable,
  link,
  detail,
  add,
  edit,
  remove,
  audit,
  unit,
};
