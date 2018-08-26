// import { stringify } from 'qs';
import request from '../utils/request';

/* 商家列表页 */


/* 上传三方支付文件 */
async function importInfo(params) {
  return request('/mj/ht-mj-order-server/order/transaction/compare/import', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询流水对账操作日志列表
async function queryLogList(params) {
  return request('/mj/ht-mj-order-server/order/transaction/compare/logs', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  importInfo, queryLogList,
};
