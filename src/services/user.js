import request from '../utils/request';
import { getToken } from '../utils/request/utils';

async function current() {
  return request('/mj/user-center-server/token/check', {
    query: {
      token: getToken(),
    },
  });
}

export default {
  current,
};
