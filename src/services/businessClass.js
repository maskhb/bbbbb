// import { stringify } from 'qs';
import request from '../utils/request';


/* 查询商家分类列表接口 */
async function queryList(params) {
  return request('/mj/ht-mj-merchant-server/merchantCategory/queryTree', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 新增一级二级分类 */
async function addClassification(params) {
  return request('/mj/ht-mj-merchant-server/merchantCategory/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 编辑一级二级分类 */
async function editClassification(params) {
  return request('/mj/ht-mj-merchant-server/merchantCategory/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 删除商家分类 */
async function deleteCategory(params) {
  return request('/mj/ht-mj-merchant-server/merchantCategory/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export default {
  queryList,
  addClassification,
  editClassification,
  deleteCategory,
};
