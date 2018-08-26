import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-cms-server/ad/queryListByPage', {
    method: 'POST',
    body: {
      adItemVo: {
        ...params,
      },
    },
    pagination: true,
  });
}

async function add(params) {
  return request('/mj/ht-mj-cms-server/ad/save', {
    method: 'POST',
    body: {
      adItemVo: {
        ...params,
      },
    },
  });
}

async function detail(params) {
  return request('/mj/ht-mj-cms-server/ad/queryDetail', {
    method: 'POST',
    body: {
      adItemVo: {
        ...params,
      },
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-cms-server/ad/update', {
    method: 'POST',
    body: {
      adItemVo: {
        ...params,
      },
    },
  });
}

async function remove(params) {
  return request('/mj/ht-mj-cms-server/ad/delete', {
    method: 'POST',
    body: {
      adItemVo: {
        ...params,
      },
    },
  });
}

async function status(params) {
  return request('/mj/ht-mj-cms-server/ad/setOpen', {
    method: 'POST',
    body: {
      adItemVo: {
        ...params,
      },
    },
  });
}

export default {
  list,
  detail,
  add,
  edit,
  remove,
  status,
};
