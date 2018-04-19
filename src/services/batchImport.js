import request from '../utils/request';

async function list(params) {
  return request('/space/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function exportList(params) {
  return request('/space/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  list,
  exportList,
};
