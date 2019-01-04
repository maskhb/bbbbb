import request from '../utils/request';

// async function list(params) {
//   // return request(`https://ht-yunying-sit.htmimi.com/2.0/api/json/dr-goods-api/decorate/platform/space/list?${stringify(params)}`);
//   return request(`/api/goods/list?${stringify(params)}`);
// }
/*  夜审 */
async function nightCheckList(params) {
  return request('/fc/ht-fc-pms-server/nightAuditRecord/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function nightCheckWrongList(params) {
  return request('/fc/ht-fc-pms-server/nightAuditRecord/exception/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function priceCheckList(params) {
  return request('/fc/ht-fc-pms-server/nightAuditRecord/price/check/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function getBusinessTime(params) {
  return request('/fc/ht-fc-pms-server/nightAuditRecord/businessTime', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function houseCancel(params) {
  return request('/fc/ht-fc-pms-server/gres/cancel', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function houseNoShow(params) {
  return request('/fc/ht-fc-pms-server/gres/noshow', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function getCompany(params) { // 获得协议单位
  return request('/fc/ht-fc-pms-server/accountReceivable/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function delay(params) { // 延到
  return request('/fc/ht-fc-pms-server/gres/delayArrivals', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function stayLong(params) { // 延住
  return request('/fc/ht-fc-pms-server/gres/delay', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function getDepositInfo(params) { // 获取客单的已付定金已退金额信息
  return request('/fc/ht-fc-pms-server/gres/getDepositInfo', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function doCheck(params) { // 获取客单的已付定金已退金额信息
  return request('/fc/ht-fc-pms-server/nightAuditRecord/execution', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function linkHouse(params) { // 联房
  return request('/fc/ht-fc-pms-server/gres/directLinkRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function linkHouseDetail(params) { // 联房详情
  return request('/fc/ht-fc-pms-server/gres/getLinkRooms', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function cancelLinkHouse(params) { // 取消联房
  return request('/fc/ht-fc-pms-server/gres/cancelLinkRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function preCheckOut(params) { // 检查房间费用
  return request('/fc/ht-fc-pms-server/gres/preCheckOut', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function returnHouse(params) { // 退房-现结
  return request('/fc/ht-fc-pms-server/gres/checkOut', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function returnHouseCredit(params) { // 退房-临时挂账
  return request('/fc/ht-fc-pms-server/tempAccountReg/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function returnHouseProtocol(params) { // 退房-协议单位挂账
  return request('/fc/ht-fc-pms-server/creditAccountDetails/addAgreementUnitAccount', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function appendCheckOut(params) { // 补结账
  return request('/fc/ht-fc-pms-server/gres/appendCheckOut', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function searchRoom(params) { // 获取联房下拉列表数据
  return request('/fc/ht-fc-pms-server/gres/searchRoom', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  nightCheckList,
  nightCheckWrongList,
  priceCheckList,
  getBusinessTime,
  houseNoShow,
  houseCancel,
  getCompany,
  delay,
  getDepositInfo,
  doCheck,
  stayLong,
  linkHouse,
  linkHouseDetail,
  cancelLinkHouse,
  preCheckOut,
  returnHouseCredit,
  returnHouse,
  returnHouseProtocol,
  appendCheckOut,
  searchRoom,
};
