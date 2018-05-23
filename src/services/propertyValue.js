import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/propertyValue/queryListByPage', {
    method: 'POST',
    body: {
      propertyValueVoQ: params,
    },
    pagination: true,
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/propertyValue/delete', {
    method: 'POST',
    body: {
      propertyValueVoD: params,
    },
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/propertyValue/save', {
    method: 'POST',
    body: {
      propertyValueVoS: params,
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-goods-server/propertyValue/update', {
    method: 'POST',
    body: {
      propertyValueVoU: params,
    },
  });
}

export default {
  list,
  add,
  edit,
  remove,
};
