import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/mj/ht-mj-promotion-server';
  return requestBase(baseUrl + url, params);
}

async function queryDetail({ promotionRuleVoQ }) {
  return request('/promotionRule/queryDetail', {
    method: 'POST',
    body: {
      promotionRuleVoQ,
    },
  });
}

async function queryDetailFeign({ orderQueryVO }) {
  return request('/promotionRule/queryDetailFeign', {
    method: 'POST',
    body: {
      orderQueryVO,
    },
  });
}

async function queryGoodsPromotion(body) {
  return request('/promotionRule/queryGoodsPromotion', {
    method: 'POST',
    body,
  });
}
async function queryListAndCasadeByPage(body) {
  return request('/promotionRule/queryListAndCasadeByPage ', {
    method: 'POST',
    body,
    pagination: true,
  });
}

async function save(promotionRuleVoS) {
  return request('/promotionRule/save', {
    method: 'POST',
    body: {
      promotionRuleVoS,
    },
  });
}
async function update(promotionRuleVoU) {
  return request('/promotionRule/update', {
    method: 'POST',
    body: {
      promotionRuleVoU,
    },
  });
}

async function updateStatus(body) {
  return request('/promotionRule/updateStatus', {
    method: 'POST',
    body,
  });
}

async function exportData({ orderQueryVO }) {
  return request('/promotionExport/exportData', {
    method: 'POST',
    body: {
      orderQueryVO,
    },
  });
}


export default {
  queryDetail,
  queryDetailFeign,
  queryGoodsPromotion,
  queryListAndCasadeByPage,
  save,
  update,
  updateStatus,
  exportData,
};
