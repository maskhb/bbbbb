import request from '../utils/request';

async function current() {
  return request('/api/permission/current', {
  // return request('https://ht-yunying-sit.htmimi.com/2.0/api/authorization/iAuthService/getVerifiedAuthoritiesBycurrent', {
    method: 'POST',
    headers: {
      // Accept: '*/*',
      // 'Content-Type': 'application/x-thrift',
    },
    body: [1, 'getVerifiedAuthoritiesBycurrent', 1, 0, {}],
  });
}

export default {
  current,
};
