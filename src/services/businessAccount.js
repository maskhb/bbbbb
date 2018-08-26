// import { stringify } from 'qs';
import request from '../utils/request';


/* 分页获取商家账号信息表接口 */
async function queryListByPage(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccount/queryListByPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 新增商家账号信息接口 */
async function saveAccount(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccount/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 更新商家账号信息接口 */
async function updateAccount(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccount/update', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 查询商家账号详情 */
async function queryDetail(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccount/queryDetail', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 查询商家账号角色列表接口 */
async function queryList(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccountRole/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 保存商家账号角色接口 */
async function saveAccountpermissions(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccountRole/save', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
/* 更新商家账号状态接口 */
async function updateStatus(params) {
  return request('/mj/ht-mj-merchant-server/merchantAccount/updateStatus', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 查询全部商家
async function queryRoleListWeb(params) {
  return request('/json/sys-privilege-api/auth/queryRoleListWeb', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 根据角色Id获取角色的权限列表（权限超级管理员专用）
async function getAuthoritySettersByRoleId(params) {
  return request('/json/sys-privilege-api/auth/getAuthoritySettersByRoleId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 请求树节点
async function queryAuthorityList(params) {
  return request('/json/sys-privilege-api/auth/queryAuthorityList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  queryListByPage,
  saveAccount,
  updateAccount,
  queryDetail,
  queryList,
  saveAccountpermissions,
  updateStatus,
  queryRoleListWeb,
  queryAuthorityList,
  getAuthoritySettersByRoleId,
};
