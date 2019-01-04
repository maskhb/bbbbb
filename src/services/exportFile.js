import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/json/pub-export-api';
  return requestBase(baseUrl + url, params);
}

/**
 * 导出列表
 * @param {*} exportQueryBean  查询条件
 */
async function queryList(exportQueryBean) {
  return request('/export/findExportFileByToken', {
    method: 'POST',
    body: {
      exportQueryBean,
    },
    pagination: true,
  });
}

/**
 * 开始导出文件
 * @param {*} params
 */
async function startExportFileByToken(params) {
  return request('/export/startExportFileByToken', {
    method: 'POST',
    body: params,
  });
}

/**
 * 开始导出文件
 * @param {*} params
 */
async function startExportFile(params) {
  return request('/export/startExportFile', {
    method: 'POST',
    body: params,
  });
}

export default {
  queryList,
  startExportFileByToken,
  startExportFile,
};
