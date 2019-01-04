/*
 * 房间管理 接口
 */
import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server/room/';
  return requestBase(baseUrl + url, params);
}

/**
 * 分页获取房型列表
 * @param {*} roomTypeQueryVO
 */
async function page(roomQueryVO) {
  return request('page', {
    body: {
      roomQueryVO,
    },
    pagination: true,
  });
}

/**
 * 查询房间详情
 * @param {Number} roomId
 */
async function details({ roomId }) {
  return request('details', {
    query: {
      roomId,
    },
  });
}


/**
 * 新增房间
 */
async function addRoom(roomVO) {
  return request('save', {
    body: {
      roomVO,
    },
  });
}

/**
 * 更新房间
 * @param {*}
 */
async function update(roomVO) {
  return request('update', {
    body: {
      roomVO,
    },
  });
}

/**
 * 新增业主，编辑业主，删除业主
 */
async function saveOwner(roomOwnerQuery) {
  return request('save', {
    body: {
      roomOwnerQuery,
    },
  });
}


/**
 * 启用禁用房型
 * @param {Number} roomTypeId
 * @param {Number} status
 */
async function updateStatus({ roomId, status }) {
  return request('updateStatus', {
    body: {
      roomId,
      status,
    },
  });
}


export default {
  page,
  details,
  addRoom,
  update,
  updateStatus,
  saveOwner,
};
