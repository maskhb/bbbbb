import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/propertyKey/queryListByPageAndValues', {
    method: 'POST',
    body: {
      propertyKeyVoQ: {
        propertyGroupId: params.propertyGroupId,
        pageInfo: params.pageInfo || {
          pageSize: 10,
        },
      },
    },
    pagination: true,
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/propertyKey/delete', {
    method: 'POST',
    body: {
      propertyKeyVoD: {
        propertyKeyId: params.propertyKeyId,
      },
    },
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/propertyKey/save', {
    method: 'POST',
    body: {
      propertyKeyVoS: {
        ...params,
        // inputType: parseInt(params.inputType, 10),
      },
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-goods-server/propertyKey/update', {
    method: 'POST',
    body: {
      propertyKeyVoU: {
        inputType: params.inputType,
        isCustmer: params.isCustmer,
        isFilter: params.isFilter,
        isRequired: params.isRequired,
        orderNum: params.orderNum,
        propertyKeyId: params.propertyKeyId,
        propertyName: params.propertyName,
      },
    },
  });
}

async function detail(params) {
  return request('/mj/ht-mj-goods-server/propertyKey/queryDetail', {
    method: 'POST',
    body: {
      ...params,
    },
    paginate: true,
    transformRequest(query) {
      return {
        propertyKeyVoQ: {
          ...query.query,
          pageInfo: query.pageInfo || {
            pageSize: 10,
          },
        },
      };
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
