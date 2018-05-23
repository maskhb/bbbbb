// import { stringify } from 'qs';
import request from '../utils/request';

async function add(params) {
  return request('/json/community-api/community/base/batchUpdateOpenPlatform', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function merchantCategoryList(params) {
  return request('/mj/ht-mj-merchant-server/merchantCategory/queryListByOrderNum', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function merchantCategoryOrder(params) {
  return request('/mj/ht-mj-merchant-server/merchantCommunityRef/globalSetting', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function merchantOrder(params) {
  return request('/mj/ht-mj-merchant-server/merchantCommunityRef/customSetting', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function merchantList(params) {
  return request('/mj/ht-mj-merchant-server/merchantCommunityRef/queryMerchantCategoryByCommunity', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  add,
  merchantCategoryList,
  merchantList,
  merchantCategoryOrder,
  merchantOrder,
};
