import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-cms-server/adPos/queryListByPage', {
    method: 'POST',
    body: {
      adPosVo: {
        ...params,
      },
    },
    pagination: true,
  });
}

async function add(params) {
  return request('/mj/ht-mj-cms-server/adPos/save', {
    method: 'POST',
    body: {
      adPosVo: {
        ...params,
      },
    },
  });
}

async function detail(params) {
  return request('/mj/ht-mj-cms-server/adPos/queryDetail', {
    method: 'POST',
    body: {
      adPosVo: {
        ...params,
      },
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-cms-server/adPos/update', {
    method: 'POST',
    body: {
      adPosVo: {
        ...params,
      },
    },
  });
}

async function remove(params) {
  return request('/mj/ht-mj-cms-server/adPos/update', {
    method: 'POST',
    body: {
      adPosVo: {
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
};
