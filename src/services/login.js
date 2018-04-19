import request from '../utils/request';
import { encryptByAes, encryptSecure } from '../utils/crypto';

const xSecure = encryptSecure('password,username');

export async function login(params) {
  return request('/json/sys-sso-api/systemSso/loginSys', {
    method: 'POST',
    headers: {
      'x-secure': xSecure,
    },
    body: {
      username: encryptByAes(params.username, xSecure),
      password: encryptByAes(params.password, xSecure),
      systemType: 2,
    },
  });
}
