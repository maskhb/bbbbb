import { stringify } from 'qs';
import request from 'utils/request';


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

export default {
  queryCategory,
  list,

};
