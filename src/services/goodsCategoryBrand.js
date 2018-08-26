import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/goodsCategoryBrand/queryListByPageAndBond', {
    method: 'POST',
    body: {
      goodsCategoryBrandVoQ: {
        ...params,
        pageInfo: params.pageInfo || {
          pageSize: 10,
        },
      },
    },
    pagination: true,
  });
}

async function listOnlyBond(params) {
  return request('/mj/ht-mj-goods-server/goodsCategoryBrand/queryListByPageOnlyBond', {
    method: 'POST',
    body: {
      goodsCategoryBrandVoQ: {
        ...params,
        pageInfo: params.pageInfo || {
          pageSize: 10,
        },
      },
    },
    pagination: true,
  });
}

async function listAndBond(params) {
  return request('/mj/ht-mj-goods-server/goodsCategoryBrand/queryListByPageAndBond', {
    method: 'POST',
    body: {
      goodsCategoryBrandVoQ: {
        ...params,
        pageInfo: params.pageInfo || {
          pageSize: 10,
        },
      },
    },
    pagination: true,
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/goodsCategoryBrand/save', {
    method: 'POST',
    body: {
      goodsCategoryBrandVoS: {
        ...params,
      },
    },
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/goodsCategoryBrand/delete', {
    method: 'POST',
    body: {
      goodsCategoryBrandVoD: {
        ...params,
      },
    },
  });
}

export default {
  list,
  listOnlyBond,
  listAndBond,
  add,
  remove,
};
