import request from '../utils/request';
// import { getToken } from '../utils/request/utils';
import { encryptByAes, encryptSecure } from '../utils/crypto';
import { getToken } from '../utils/request/utils';

const xSecure = encryptSecure(JSON.stringify({
  loginName: 1,
  passWord: 1,
}));

// /accountInfo/login 账号登录
export async function login(params) {
  return request('/fc/ht-fc-pms-server/accountInfo/login', {
    method: 'POST',
    transformResponse(res) {
      return res;
    },
    body: {
      loginName: encryptByAes(params.username, xSecure),
      passWord: encryptByAes(params.password, xSecure),
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
  return request('/fc/ht-fc-pms-server/accountInfo/logout', {
    method: 'POST',
    body: {
      token: getToken(),
    },
  });
}
