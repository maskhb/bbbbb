import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server/';
  return requestBase(baseUrl + url, params);
}

/**
 * 下载分析表
 * @param {*} exportQueryBean  查询条件
 */
async function queryList(statisticsInfoPageVO) {
  return request('/statistics/page', {
    method: 'POST',
    body: {
      statisticsInfoPageVO,
    },
    pagination: true,
  });
}

/**
 * 开始导出文件
 * @param {*} params
 */
async function statsDownload(params) {
  return request('/statistics/receivables/download', {
    method: 'POST',
    body: params,
  });
}

export default {
  queryList,
  statsDownload,
};
