import request from '../utils/request';
// import { getToken } from '../utils/request/utils';
import { encryptByAes, encryptSecure } from '../utils/crypto';

const xSecure = encryptSecure(JSON.stringify({
  loginParam: {
    username: 1,
    password: 1,
  },
}));

export async function login(params) {
  return request('/mj/user-center-server/systemSso/loginSys', {
    method: 'POST',
    transformResponse(res) {
      return res;
    },
    body: {
      loginParam: {
        username: encryptByAes(params.username, xSecure),
        password: encryptByAes(params.password, xSecure),
        systemType: 2,
      },
    },
    headers: {
      'x-secure': xSecure,
    },
    // body: {
    //   username: encryptByAes(params.username, xSecure),
    //   password: encryptByAes(params.password, xSecure),
    //   systemType: 2,
    // },
  });
}


export async function logout() {
  return request('/mj/user-center-server/sso/logout', {
    method: 'POST',
  });
}
