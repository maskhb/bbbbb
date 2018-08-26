import _ from 'lodash';
import cookie from 'cookies-js';

const AUTHORITYKEY = 'permission';
let CURRENT_PERMISSIONS = [];
let readStorage = false;

export function getAuthority() {
  // 是否登录取决于是否存在cookie[x-manager-token]
  if (!readStorage) {
    try {
      readStorage = true;
      CURRENT_PERMISSIONS.push('user');
      // 兼容旧运营平台
      const pmsStr = localStorage.getItem(AUTHORITYKEY);
      let lsAuth;
      if (pmsStr) {
        lsAuth = _.compact(JSON.parse(
          localStorage.getItem(AUTHORITYKEY)
        ));
      }
      if (!lsAuth || lsAuth.length === 0) {
        lsAuth = _.compact(JSON.parse(
          localStorage.getItem('authority')
        ));
      }
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
