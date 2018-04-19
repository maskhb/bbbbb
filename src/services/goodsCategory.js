// import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request('/goodsCategory/queryListAndHasChild', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function add(params) {
  return request('/api/goodsCategory/add', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function detail(params) {
  return request('/api/goodsCategory/detail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function edit(params) {
  return request('/api/goodsCategory/edit', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function remove(params) {
  return request('/api/goodsCategory/remove', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

async function status(params) {
  return request('/api/goodsCategory/status', {
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
  status,
};
