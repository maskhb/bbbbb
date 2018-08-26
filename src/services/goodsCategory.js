import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/queryList', {
    method: 'POST',
    body: {
      goodsCategoryVoQ: params,
    },
  });
}
async function listHasChild(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/queryListAndHasChild', {
    method: 'POST',
    body: {
      goodsCategoryVoQ: params,
    },
  });
}
async function listByMerchantId(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/queryListAndHasChildByMerchantId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/save', {
    method: 'POST',
    body: {
      goodsCategoryVoS: { ...params },
    },
  });
}

async function detail(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/queryDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/update', {
    method: 'POST',
    body: {
      goodsCategoryVoU: { ...params },
    },
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/delete', {
    method: 'POST',
    body: {
      goodsCategoryVoD: params,
    },
  });
}

async function status(params) {
  return request('/mj/ht-mj-goods-server/goodsCategory/updateStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  list,
  listHasChild,
  listByMerchantId,
  detail,
  add,
  edit,
  remove,
  status,
};
