import { stringify } from 'qs';
import request from '../utils/request';


async function list(params) {
  return request(`/api/business/list?${stringify(params)}`);
}

/* 查询商家分类 */
async function queryCategory(params) {
  return request('/merchantCategory/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 经营范围 */
async function queryListAndHasChild(params) {
  return request('/goodsCategory/queryListAndHasChild', {
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
};
