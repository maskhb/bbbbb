import _ from 'lodash';
import cookie from 'cookies-js';

const AUTHORITYKEY = 'ht-authority';
let CURRENT_PERMISSIONS = [];
let readStorage = false;

export function getAuthority() {
  // 是否登录取决于是否存在cookie[x-manager-token]
  if (!readStorage) {
    try {
      readStorage = true;
      CURRENT_PERMISSIONS.push('user');
      // 兼容旧运营平台
      const lsAuth = _.compact(JSON.parse(
        localStorage.getItem(AUTHORITYKEY) || localStorage.getItem('permission')
      ));
      CURRENT_PERMISSIONS = _.uniq(_.concat(CURRENT_PERMISSIONS, lsAuth));
    } catch (e) {
      // setAuthority(auth);
    }
  }
  const token = cookie.get('x-manager-token');
  if (!token) {
    CURRENT_PERMISSIONS = ['guest'];
  }
  return CURRENT_PERMISSIONS;
}

export function setAuthority(authority) {
  let auth = [];
  if (authority?.constructor.name === 'Array') {
    auth = authority;
  } else if (authority?.constructor.name === 'String') {
    auth = [authority];
  }
  CURRENT_PERMISSIONS = _.uniq(_.compact(auth));
  localStorage.setItem(AUTHORITYKEY, JSON.stringify(CURRENT_PERMISSIONS));
}
