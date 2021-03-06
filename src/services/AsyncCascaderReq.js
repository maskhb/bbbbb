import { stringify } from 'qs';
import request from '../utils/request';


async function list(params) {
  return request(`/mj/ht-mj-merchant-server/api/business/list?${stringify(params)}`);
}

/* 查询商家分类 */
async function queryCategory(params) {
  return request('/mj/ht-mj-merchant-server/merchantCategory/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 查询商家分类(多级) */
async function queryTree(params) {
  return request('/mj/ht-mj-merchant-server/merchantCategory/queryTree', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 经营范围 */
async function queryListAndHasChild(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/queryListAndHasChild', {
    method: 'POST',
    body: {
      ...params,
      parentId: 0,
    },
  });
}

export default {
  queryCategory,
  list,
  queryListAndHasChild,
  queryTree,
};
