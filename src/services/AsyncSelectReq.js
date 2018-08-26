import request from '../utils/request';

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
  queryListAndHasChild,
};
