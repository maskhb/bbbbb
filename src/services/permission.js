import request from '../utils/request';

async function current() {
  return request('/json/sys-privilege-api/auth/getVerifiedAuthoritiesByCurrentUser');
}

export default {
  current,
};
