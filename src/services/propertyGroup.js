import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/propertyGroup/queryListByPage', {
    method: 'POST',
    body: {
      propertyGroupVoQ: {
        ...params,
        pageInfo: params.pageInfo || {
          pageSize: 10,
        },
      },
    },
    pagination: true,
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/propertyGroup/delete', {
    method: 'POST',
    body: {
      propertyGroupVoD: params,
    },
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/propertyGroup/save', {
    method: 'POST',
    body: {
      propertyGroupVoS: params,
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-goods-server/propertyGroup/update', {
    method: 'POST',
    body: {
      propertyGroupVoU: params,
    },
  });
}

async function detail(params) {
  return request('/mj/ht-mj-goods-server/propertyGroup/queryDetail', {
    method: 'POST',
    body: {
      propertyGroupVoQ: params,
    },
    transformResponse(json) {
      return json.data.result;
    },
  });
}

export default {
  list,
  detail,
  add,
  edit,
  remove,
};
