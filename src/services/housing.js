import request from '../utils/request';

// async function list(params) {
//   // return request(`https://ht-yunying-sit.htmimi.com/2.0/api/json/dr-goods-api/decorate/platform/space/list?${stringify(params)}`);
//   return request(`/api/goods/list?${stringify(params)}`);
// }
/*  房价管理 */
async function housePriceList(params) {
  return request('/fc/ht-fc-pms-server/roomRate/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function rateCodeList(params) {
  return request('/fc/ht-fc-pms-server/rateCode/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function roomTypeList(params) {
  return request('/fc/ht-fc-pms-server/roomType/page', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function add(params) { // 设置房价
  return request('/fc/ht-fc-pms-server/roomRate/saveOrUpdate', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function sourceList(params) { // 业务来源
  return request('/fc/ht-fc-pms-server/source/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/*  房价日历查询 */
async function calendarPrice(roomRateCalendarListQueryVO) {
  return request('/fc/ht-fc-pms-server/roomRate/listCalendarPrice', {
    method: 'POST',
    body: {
      roomRateCalendarListQueryVO,
    },
  });
}
/*  清除房价 */
async function clearHousePrice(params) {
  return request('/fc/ht-fc-pms-server/roomRate/deletePrice', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function getBusinessTime(params) { // 获取当前营业日期
  return request('/fc/ht-fc-pms-server/nightAuditRecord/businessTime', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


export default {
  housePriceList,
  rateCodeList,
  roomTypeList,
  add,
  sourceList,
  calendarPrice,
  clearHousePrice,
  getBusinessTime,
};
