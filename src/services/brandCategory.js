// import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/brandCategory/queryList', {
    method: 'POST',
    body: {
      brandCategoryVoQ: params,
    },
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/brandCategory/save', {
    method: 'POST',
    body: {
      BrandCategoryVoS: params,
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-goods-server/brandCategory/update', {
    method: 'POST',
    body: {
      BrandCategoryVoU: params,
    },
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/brandCategory/delete', {
    method: 'POST',
    body: {
      BrandCategoryVoD: params,
    },
  });
}

export default {
  list,
  add,
  edit,
  remove,
};
