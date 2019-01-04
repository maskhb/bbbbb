/*
 * @Author: nic
 * @Date: 2018-07-23 17:13:16
 * @Last Modified by: nic
 * @Last Modified time: 2018-07-23 17:23:23
 *
 * 房态
 */
import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server';
  return requestBase(baseUrl + url, params);
}

/**
 * 维修单列表
 * @param {*} repairPageVO  查询条件
 */
async function queryRepairList(repairPageVO) {
  return request('/repair/page', {
    method: 'POST',
    body: {
      repairPageVO,
    },
    pagination: true,
  });
}

/**
 * 完成维修
 * @param {*} repairId
 */
async function repairFinish(repairId) {
  return request('/repair/finish', {
    method: 'POST',
    body: repairId,
  });
}

/**
 * 取消维修
 * @param {*} repairId
 */
async function repairCancel(repairId) {
  return request('/repair/cancel', {
    method: 'POST',
    body: repairId,
  });
}

/**
 * 新增维修
 * @param {*} repairVO
 */
async function repairSave(repairVO) {
  return request('/repair/save', {
    method: 'POST',
    body: {
      repairVO,
    },
  });
}

/**
 * 修改维修
 * @param {*} repairVO
 */
async function repairUpdate(repairVO) {
  return request('/repair/update', {
    method: 'POST',
    body: {
      repairVO,
    },
  });
}

/**
 * 维修详情
 * @param {*} obj
 */
async function repairDetail(obj) {
  return request('/repair/details', {
    method: 'POST',
    body: obj,
  });
}

/**
 * 自留详情
 * @param {*} obj
 */
async function retentionDetail(obj) {
  return request('/roomStatus/retention', {
    method: 'POST',
    body: obj,
  });
}

/**
 * 获取楼栋列表
 * @param {*} buildingQueryVO
 */
async function getBuildingList(buildingQueryVO) {
  return request('/building/page', {
    method: 'POST',
    body: {
      buildingQueryVO,
    },
  });
}

/**
 * 获取房间列表
 * @param {*} roomQueryVO
 */
async function getRoomList(roomQueryVO) {
  return request('/room/page', {
    method: 'POST',
    body: {
      roomQueryVO,
    },
  });
}

/**
 * 叫醒详情
 * @param {*} roomId
 */
async function getWakeDetail(roomId) {
  return request('/roomStatus/wake', {
    method: 'POST',
    body: {
      roomId,
    },
  });
}

/**
 * 新增叫醒
 * @param {*} roomWakeVO
 */
async function wakeAdd(roomWakeVO) {
  return request('/roomStatus/wake/add', {
    method: 'POST',
    body: {
      roomWakeVO,
    },
  });
}

/**
 * 取消叫醒
 * @param {*} roomIdList
 */
async function wakeCancel(roomIdList) {
  return request('/roomStatus/wake/cancel', {
    method: 'POST',
    body: roomIdList,
  });
}

/**
 * 获取标签列表
 * @param {*} tagQueryVO
 */
async function getTagList(tagQueryVO) {
  return request('/tag/page', {
    method: 'POST',
    body: {
      tagQueryVO,
    },
  });
}

/**
 * 打扫干净
 * @param {*} roomId
 */
async function clean(roomId) {
  return request('/roomStatus/clean', {
    method: 'POST',
    body: roomId,
  });
}

/**
 * 设置脏房
 * @param {*} roomId
 */
async function dirty(roomId) {
  return request('/roomStatus/dirty', {
    method: 'POST',
    body: roomId,
  });
}

/**
 * 房间锁定
 * @param {*} roomId
 */
async function lock(roomId) {
  return request('/roomStatus/lock', {
    method: 'POST',
    body: roomId,
  });
}

/**
 * 取消锁定
 * @param {*} roomId
 */
async function unlock(roomId) {
  return request('/roomStatus/unlock', {
    method: 'POST',
    body: roomId,
  });
}

/**
 * 新增房间自留
 * @param {*} roomRetentionVO
 */
async function retentionAdd(roomRetentionVO) {
  return request('/roomStatus/retention/add', {
    method: 'POST',
    body: {
      roomRetentionVO,
    },
  });
}

/**
 * 更新房间自留
 * @param {*} roomRetentionVO
 */
async function retentionUpdate(roomRetentionVO) {
  return request('/roomStatus/retention/update', {
    method: 'POST',
    body: {
      roomRetentionVO,
    },
  });
}

/**
 * 结束房间自留
 * @param {*} postData
 */
async function retentionClose(postData) {
  return request('/roomStatus/retention/close', {
    method: 'POST',
    body: postData,
  });
}

/**
 * 获取条件标签
 * @param {*} obj
 */
async function getTag(obj) {
  return request('/roomStatus/tag', {
    method: 'POST',
    body: obj,
  });
}

/**
 * 查询今日房态
 * @param {*} roomStatusCondition
 */
async function queryToday(roomStatusCondition) {
  return request('/roomStatus/today', {
    method: 'POST',
    body: {
      roomStatusCondition,
    },
  });
}

/**
 * 查询未来预订单
 * @param {*} roomId
 */
async function futureGres(roomId) {
  return request('/gres/futureGres', {
    method: 'POST',
    body: roomId,
  });
}


/**
 * 远期房态-获取楼栋列表
 * @param {*} buildingQueryVO
 */
async function queryBuild(buildingQueryVO) {
  return request('/building/page', {
    method: 'POST',
    body: {
      buildingQueryVO,
    },
  });
}

/**
 * 远期房态-获取房型列表
 * @param {*} roomTypeQueryVO
 */
async function queryRoomType(roomTypeQueryVO) {
  return request('/roomType/page', {
    method: 'POST',
    body: {
      roomTypeQueryVO,
    },
  });
}

/**
 * 查询远期房态
 * @param {*} roomStatusCondition
 */
async function queryForward(roomStatusCondition) {
  return request('/roomStatus/usance', {
    method: 'POST',
    body: {
      roomStatusCondition,
    },
  });
}


export default {
  queryRepairList,
  repairFinish,
  repairCancel,
  repairSave,
  repairUpdate,
  repairDetail,
  retentionDetail,
  getBuildingList,
  getRoomList,
  getWakeDetail,
  wakeAdd,
  wakeCancel,
  getTagList,
  clean,
  dirty,
  lock,
  unlock,
  retentionAdd,
  retentionUpdate,
  retentionClose,
  getTag,
  queryToday,
  futureGres,
  queryBuild,
  queryRoomType,
  queryForward,
};
