import request from '../utils/request';

// 分页获取楼栋列表
async function queryListByPage(tagQueryVO) {
  return request('/fc/ht-fc-pms-server/tag/page', {
    method: 'POST',
    body: {
      tagQueryVO,
    },
    pagination: true,
  });
}

// 新增
async function add(tagVO) {
  return request('/fc/ht-fc-pms-server/tag/save', {
    method: 'POST',
    body: {
      tagVO,
    },
  });
}

// 编辑
async function update(tagVO) {
  return request('/fc/ht-fc-pms-server/tag/update', {
    method: 'POST',
    body: {
      tagVO,
    },
  });
}

// 启用or禁用
async function updateStatus(params) {
  return request('/fc/ht-fc-pms-server/tag/updateStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 删除
async function remove(tagVO) {
  return request('/fc/ht-fc-pms-server/tag/delete', {
    method: 'POST',
    body: {
      ...tagVO,
    },
  });
}

// 查询证件类型
async function tagDocType() {
  return request('/fc/ht-fc-pms-server/tag/docType', {
    method: 'POST',
    body: {},
  });
}

export default {
  queryListByPage,
  add,
  update,
  updateStatus,
  remove,
  tagDocType,
};

