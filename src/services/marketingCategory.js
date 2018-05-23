import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/goodsSaleCategory/queryList', {
    method: 'POST',
    body: {
      goodsSaleCategoryVoQ: {
        ...params,
      },
    },
    // pagination: true,
  });
}

export default {
  list,
};
