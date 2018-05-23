import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/space/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function enable(params) {
  return request(`/mj/ht-mj-goods-server/space/enable?${stringify(params)}`);
}
async function disable(params) {
  return request(`/mj/ht-mj-goods-server/space/disable?${stringify(params)}`);
}
async function remove(params) {
  return request(`/mj/ht-mj-goods-server/space/delete?${stringify(params)}`);
}
async function link(params) {
  return request('/mj/ht-mj-goods-server/space/link', {
    method: 'POST',
    body: {
      spaceId: params.spaceId,
      categoryIds: params.categoryIds,
    },
  });
}
async function detail(params) {
  return request(`/mj/ht-mj-goods-server/space/queryDetail?${stringify(params)}`);
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/space/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function edit(params) {
  return request('/mj/ht-mj-goods-server/space/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function listByCategoryId(params) {
  return request('/mj/ht-mj-goods-server/space/queryListByCategoryId', {
    method: 'POST',
    body: {
      ...params,
    },
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
  listByCategoryId,
};
