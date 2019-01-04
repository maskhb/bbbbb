import request from 'utils/request';
/* 分页获取渠道列表 */
async function queryListByPage(params) {
  return request('/fc/ht-fc-pms-server/channel/page', {
    method: 'POST',
    body: {
      ...params,
    },
    pagination: true,
  });
}


async function updateData(params) {
  return request('/fc/ht-fc-pms-server/channel/updateStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新业务来源状态
async function updateSourceStatus(params) {
  return request('/fc/ht-fc-pms-server/source/updateSourceStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询业务来源
async function querySourceList(params) {
  return request('/fc/ht-fc-pms-server/source/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function querySourceListByPage(params) {
  return request('/fc/ht-fc-pms-server/source/page', {
    method: 'POST',
    body: {
      ...params,
    },
    pagination: true,
  });
}


// 新增渠道
async function addSource(params) {
  return request('/fc/ht-fc-pms-server/source/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 根据条件更新数据
async function updateSource(params) {
  return request('/fc/ht-fc-pms-server/source/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除数据

async function deleteSource(params) {
  return request('/fc/ht-fc-pms-server/source/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 删除渠道
async function deleteChannel(params) {
  return request('/fc/ht-fc-pms-server/channel/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 新增渠道
async function addChannel(params) {
  return request('/fc/ht-fc-pms-server/channel/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 更新渠道
async function updateChannel(params) {
  return request('/fc/ht-fc-pms-server/channel/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询所有得到渠道列表
async function queryChannelList(params) {
  return request('/fc/ht-fc-pms-server/channel/list', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryListByPage,
  updateData,
  updateSourceStatus,
  querySourceList,
  querySourceListByPage,
  addSource,
  updateSource,
  deleteSource,
  deleteChannel,
  addChannel,
  updateChannel,
  queryChannelList,
};

