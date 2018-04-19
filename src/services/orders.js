/*
 * @Author: wuhao
 * @Date: 2018-04-04 14:32:15
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-18 11:26:32
 *
 * 订单接口类
 */

import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-order-server/order/admin/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  list,
};
