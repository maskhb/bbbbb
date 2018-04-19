import request from '../utils/request';

async function current() {
  return request('/api/authorization/iAuthService/getVerifiedAuthoritiesByCurrentUser');
}

export default {
  current,
};
