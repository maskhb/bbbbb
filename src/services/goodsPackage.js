import request from '../utils/request';

export const list = (params) => {
  return request('/mj/ht-mj-goods-server/package/queryListByPage', {
    method: 'POST',
    body: { packagePageInfo: params },
  });
};

export const top = (params) => {
  return request('/mj/ht-mj-goods-server/package/top', {
    method: 'POST',
    body: params,
  });
};

export const cancelTop = (params) => {
  return request('/mj/ht-mj-goods-server/package/canceltop', {
    method: 'POST',
    body: params,
  });
};

export const remove = (params) => {
  return request('/mj/ht-mj-goods-server/package/delete', {
    method: 'POST',
    body: params,
  });
};

export const detail = (params) => {
  return request('/mj/ht-mj-goods-server/package/queryDetail', {
    method: 'POST',
    body: params,
  });
};

export const spaceList = (params) => {
  return request('/mj/ht-mj-goods-server/space/queryList', {
    method: 'POST',
    body: params,
  });
};

export const queryTagList = (params) => {
  return request('/mj/ht-mj-goods-server/package/queryTagList', {
    method: 'POST',
    body: params,
  });
};

export const save = (params) => {
  return request('/mj/ht-mj-goods-server/package/save', {
    method: 'POST',
    body: params,
  });
};

export const audit = (params) => {
  return request('/mj/ht-mj-goods-server/package/audit', {
    method: 'POST',
    body: params,
  });
};

export const shelf = (params) => {
  return request('/mj/ht-mj-goods-server/package/shelf', {
    method: 'POST',
    body: params,
  });
};

export const update = (params) => {
  return request('/mj/ht-mj-goods-server/package/update', {
    method: 'POST',
    body: params,
  });
};

export const queryPackageGoods = (params) => {
  return request('/mj/ht-mj-goods-server/goods/queryPackageGoods', {
    method: 'POST',
    body: { packageGoodsVoQ: params },
  });
};
