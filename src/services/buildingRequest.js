import request from '../utils/request';

// 分页获取楼栋列表
async function queryListByPage(buildingQueryVO) {
  return request('/fc/ht-fc-pms-server/building/page', {
    method: 'POST',
    body: {
      buildingQueryVO,
    },
    pagination: true,
  });
}

// 新增
async function add(buildingAddVO) {
  return request('/fc/ht-fc-pms-server/building/save', {
    method: 'POST',
    body: {
      buildingAddVO,
    },
  });
}

// 编辑
async function update(buildingUpdateVO) {
  return request('/fc/ht-fc-pms-server/building/update', {
    method: 'POST',
    body: {
      buildingUpdateVO,
    },
  });
}

// 启用or禁用
async function updateStatus(params) {
  return request('/fc/ht-fc-pms-server/building/updateStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除
async function remove(params) {
  return request('/fc/ht-fc-pms-server/building/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 楼栋类型
async function buildType() {
  return request('/fc/ht-fc-pms-server/building/listBuildingType', {
    method: 'POST',
    body: {
    },
  });
}

export default {
  queryListByPage,
  add,
  update,
  updateStatus,
  remove,
  buildType,
};

