import _ from 'lodash';
import cookie from 'cookies-js';

const AUTHORITYKEY = 'ht-authority';

export function getAuthority() {
  // 是否登录取决于是否存在cookie[x-manager-token]
  const token = cookie.get('x-manager-token');
  let auth = token ? ['user'] : ['guest'];
  try {
    const lsAuth = _.compact(JSON.parse(localStorage.getItem(AUTHORITYKEY)));
    auth = _.uniq(_.concat(auth, lsAuth));
  } catch (e) {
    // setAuthority(auth);
  }
  return auth;
}

export function setAuthority(authority) {
  let auth = [];
  if (authority?.constructor.name === 'Array') {
    auth = authority;
  } else if (authority?.constructor.name === 'String') {
    auth = [authority];
  }
  auth = _.uniq(_.compact(auth));
  localStorage.setItem(AUTHORITYKEY, JSON.stringify(auth));
}
