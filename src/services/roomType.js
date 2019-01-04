/*
 * @Author: wuhao
 * @Date: 2018-09-25 16:29:48
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-26 15:26:51
 *
 * 房型管理 接口
 */
import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server/roomType/';
  return requestBase(baseUrl + url, params);
}

/**
 * 分页获取房型列表
 * @param {*} roomTypeQueryVO
 */
async function page(roomTypeQueryVO) {
  return request('page', {
    body: {
      roomTypeQueryVO,
    },
    pagination: true,
  });
}

/**
 * 查询房型详情
 * @param {Number} roomTypeId
 */
async function details({ roomTypeId }) {
  return request('details', {
    body: {
      roomTypeId,
    },
  });
}

/**
 * 获取房型图片信息
 * @param {Number} roomTypeId
 */
async function getRoomTypeImages({ roomTypeId }) {
  return request('getRoomTypeImages', {
    body: {
      roomTypeId,
    },
  });
}

/**
 * 新增房型
 * @param {*} roomTypeAddVO
 */
async function saveRoomType(roomTypeAddVO) {
  return request('save', {
    body: {
      roomTypeAddVO,
    },
  });
}

/**
 * 更新房型
 * @param {*} roomTypeUpdateVO
 */
async function update(roomTypeUpdateVO) {
  return request('update', {
    body: {
      roomTypeUpdateVO,
    },
  });
}

/**
 * 根据房型id删除房型
 * @param {Number} roomTypeId
 */
async function deleteRoomType({ roomTypeId }) {
  return request('delete', {
    body: {
      roomTypeId,
    },
  });
}

/**
 * 启用禁用房型
 * @param {Number} roomTypeId
 * @param {Number} status
 */
async function updateStatus({ roomTypeId, status }) {
  return request('updateStatus', {
    body: {
      roomTypeId,
      status,
    },
  });
}

/**
 * 更新房型图片信息
 * @param {Number} roomTypeId
 * @param {Array<String>} images
 */
async function upDateRoomTypeImage(roomTypeImageUpdateVO) {
  return request('upDateRoomTypeImage', {
    body: {
      roomTypeImageUpdateVO,
    },
  });
}

export default {
  page,
  details,
  deleteRoomType,
  getRoomTypeImages,
  saveRoomType,
  update,
  upDateRoomTypeImage,
  updateStatus,
};
