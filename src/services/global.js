// 公用 api 请求
import request from '../utils/request';

async function globalSettingDetail(params) {
  return request('/mj/ht-mj-cms-server/setting/getListMap', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function globalSettingAdd(params) {
  return request('/mj/ht-mj-cms-server/setting/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function queryGoodsAndPackageCount(params) {
  return request('/mj/ht-mj-goods-server/package/queryGoodsAndPackageCount', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  globalSettingDetail,
  globalSettingAdd,
  queryGoodsAndPackageCount,
};
