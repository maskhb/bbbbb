import requestBase from '../utils/request';
import { getToken } from '../utils/request/utils';


function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server';
  return requestBase(baseUrl + url, params);
}

async function current() {
  return request('/token/check', {
    query: {
      token: getToken(),
    },
  });
}

// 修改密码
async function editUserPassword({ oldPwd, newPwd }) {
  return request('', {
    method: 'POST',
    body: {
      oldPwd,
      newPwd,
    },
  });
}
// /accountInfo/getAccountAuthsByOrgId 获取账户在某组织下的权限列表
async function getAccountAuthsByOrgId(params) {
  return request('/accountInfo/getAccountAuthsByOrgId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// /accountInfo/getAccountLoginSelectedOrg 获取账户登陆后所选的组织
async function getAccountLoginSelectedOrg(params) {
  return request('/accountInfo/getAccountLoginSelectedOrg', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// / accountInfo / queryAccountsByOrg 查询绑定于某组织下的账号列表
async function queryAccountsByOrg(params) {
  return request('/accountInfo/queryAccountsByOrg', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// /accountInfo/updateAccountLoginOrgId 登陆账号切换自己的组织ID
async function updateAccountLoginOrgId(params) {
  return request('/accountInfo/updateAccountLoginOrgId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


//  以树的形式展示当前账号的关联组织列表 /accountInfo/getAccountOrgsInTree
async function getAccountOrgsInTree(params) {
  return request('/accountInfo/getAccountOrgsInTree', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 获取账户在某组织下的角色列表
async function getAccountRolesByOrgId(params) {
  return request('/accountInfo/getAccountRolesByOrgId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  current,
  editUserPassword,
  getAccountOrgsInTree,
  getAccountRolesByOrgId,
  getAccountAuthsByOrgId,
  getAccountLoginSelectedOrg,
  queryAccountsByOrg,
  updateAccountLoginOrgId,
};
