/**
 * 原cookie 存在bug, 直接引入第三方库cookies-js 来处理cookie
 * last-modify: fuanzhao
 */
import cookies from 'cookies-js';

function clear() {
  cookies.expire('x-manager-token');
  cookies.expire('x-client-id');
  sessionStorage.clear();
  localStorage.clear();
}
export default {
  ...cookies,
  del: cookies.expire,
  clear,
};
