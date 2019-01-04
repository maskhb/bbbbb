// 公用 api 请求
import request from '../utils/request';

/**
 * 首页信息查询
 */
async function homeInfo() {
  return request('/fc/ht-fc-pms-server/gres/getFromPage', {
    method: 'POST',
    body: {},
  });
}
async function getBusinessTime(params) {
  return request('/fc/ht-fc-pms-server/nightAuditRecord/businessTime', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  homeInfo,
  getBusinessTime,
};
