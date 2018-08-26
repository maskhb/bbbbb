import * as permissions from 'config/permission';

export function getRealAuthority(authority) {
  if (authority) {
    if (typeof authority === 'string') {
      return permissions[authority] || authority;
    } else if (typeof authority.map === 'function') {
      return authority.map(auth => permissions[auth] || auth);
    }
  }
  return authority;
}
