import request from '../utils/request';

// 分页获取楼栋列表
async function queryListByPage(floorQueryVO) {
  return request('/fc/ht-fc-pms-server/floor/page', {
    method: 'POST',
    body: {
      floorQueryVO,
    },
    pagination: true,
  });
}

// 新增
async function add(floorAddVO) {
  return request('/fc/ht-fc-pms-server/floor/save', {
    method: 'POST',
    body: {
      floorAddVO,
    },
  });
}

// 编辑
async function update(floorUpdateVO) {
  return request('/fc/ht-fc-pms-server/floor/update', {
    method: 'POST',
    body: {
      floorUpdateVO,
    },
  });
}

// 启用or禁用
async function updateStatus({ floorId, status }) {
  return request('/fc/ht-fc-pms-server/floor/updateStatus', {
    method: 'POST',
    body: {
      floorId,
      status,
    },
  });
}

// 删除
async function remove(params) {
  return request('/fc/ht-fc-pms-server/floor/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryListByPage,
  add,
  update,
  updateStatus,
  remove,
};

