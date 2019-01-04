// 公用 api 请求
import request from '../utils/request';

async function getProvincesWithCommunities() {
  return request('/mj/ht-mj-cms-server/community/getAllComCommunity', {
    mock: false,
  });
}
async function queryCommunityList(params) {
  return request('/json/community-api/community/base/listPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function queryRegionInfo(params) {
  // return request("/json/region-api/region/getChildRegions", {
  return request('/fc/ht-fc-pms-server/region/getChildRegions', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function regionGetOrgRegion(params) {
  return request('/fc/ht-fc-pms-server/region/getOrgRegion', {
    method: 'POST',
    body: params,
  });
}

/**
 * 公共异步导出接口
 * @param {prefix:Number,dataUrl:String,param:String,page:Object} params
 *
 * prefix 业务码
 * dataUrl 业务方提供的Http Controller API接口
 * param 查询参数
 * page 分页参数
 *    {pageSize:Number,totalCount:Number}
 *    pageSize 每页记录数 一般每页不超过500条
 *    totalCount 估计总记录数
 */
async function startExportFile(params) {
  return request('/json/pub-export-api/export/startExportFile', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 查询全部层级
async function queryHierarchy(sourcePageVO) {
  return request('/fc/ht-fc-pms-server/source/list', {
    method: 'POST',
    body: {
      sourcePageVO,
    },
  });
}

/**
 * 获取可叫醒列表
 * @param {*} obj
 */
async function canWake(obj) {
  return request('/fc/ht-fc-pms-server/roomStatus/canWake', {
    method: 'POST',
    body: obj,
  });
}

/**
 * 完成叫醒
 * @param {*} roomId
 */
async function wakeFinish(roomId) {
  return request('/fc/ht-fc-pms-server/roomStatus/wake/finish', {
    method: 'POST',
    body: roomId,
  });
}

export default {
  getProvincesWithCommunities,
  queryCommunityList,
  queryRegionInfo,
  startExportFile,
  queryHierarchy,
  canWake,
  wakeFinish,
  regionGetOrgRegion,
};
