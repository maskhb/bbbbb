import request from '../utils/request';

// async function list(params) {
//   // return request(`https://ht-yunying-sit.htmimi.com/2.0/api/json/dr-goods-api/decorate/platform/space/list?${stringify(params)}`);
//   return request(`/api/goods/list?${stringify(params)}`);
// }
async function list(params) {
  return request('/json/sms-api/smsPush/getSmsTaskList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function recordList(params) {
  return request('/json/sms-api/smsPush/getSmsRecordList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function add(params) {
  return request('/json/sms-api/smsPush/addSmsPushTask', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function rePush(params) {
  return request('/json/sms-api/smsPush/rePush', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  list,
  recordList,
  rePush,
  add,
};
