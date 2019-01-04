import request from 'utils/request';
/* 分页获取渠道列表 */
async function queryStatisticsInfo(statisticsPageVO) {
  return request('/fc/ht-fc-pms-server/statistics/page', {
    method: 'POST',
    body: {
      statisticsPageVO,
    },
    pagination: true,
  });
}
// 下载
async function download(params) {
  return request('/fc/ht-fc-pms-server/statistics/receivables/download', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


export default {
  queryStatisticsInfo,
  download,
};

