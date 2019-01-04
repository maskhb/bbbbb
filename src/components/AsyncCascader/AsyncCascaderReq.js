// import { stringify } from 'qs';
import request from 'utils/request';

/* /paymentMethod/page
分页查询收款方式列表 */
async function paymentMethod(paymentMethodQueryVO) {
  return request('/fc/ht-fc-pms-server/paymentMethod/page', {
    method: 'POST',
    body: {
      paymentMethodQueryVO,
    },
  });
}


export default {
  paymentMethod,
};
