import { stringify } from 'qs';
import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-log-server/readImportLogPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function exportFile(params) {
  return request(`/mj/ht-mj-log-server/downloadResultFile?${stringify({
    fileUrl: params.fileUrl,
    fileName: params.fileName,
  })}`);
}
async function exportList(params) {
  return request('/json/pub-export-api/export/query', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  list,
  exportFile,
  exportList,
};
