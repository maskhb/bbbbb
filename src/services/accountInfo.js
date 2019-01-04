import baseRequest from 'utils/request';

const request = (url, params) => {
  return baseRequest(`/fc/ht-fc-pms-server/accountInfo/${url}`, params);
};
/* 分页获取渠道列表 */
async function list(params) {
  return request('page', {
    method: 'POST',
    body: {
      accountInfoPageVO: params,
    },
    pagination: true,
  });
}

async function remove({ accountId }) {
  return request('delete', {
    query: {
      accountId,
    },
  });
}

async function detail({ accountId }) {
  return request('details', {
    query: {
      accountId,
    },
  });
}

async function save(params) {
  return request('save', {
    body: {
      accountInfoVO: params,
    },
  });
}

async function update({ ...params }) {
  return request('update', {
    body: {
      accountInfoVO: params,
    },
  });
}

async function changeStatus({ accountId, status }) {
  return request('prohibitAndEnable', {
    query: {
      accountId,
      status,
    },
  });
}

async function setRoles(params) {
  request('setRoles', {
    body: {
      accountRoleRelationVOList: params,
    },
  });
}


async function rolesByOrgId({ accountId, orgId }) {
  request('getAccountRolesByOrgId', {
    query: {
      accountId,
      orgId,
    },
  });
}

async function orgsTree() {
  return request('getAccountOrgsInTree');
}

async function selectedOrgs(accountId) {
  return request('getAccountLoginSelectedOrg', {
    query: {
      accountId,
    },
  });
}

async function roleGroupsByAccount({ accountId }) {
  return baseRequest('/fc/ht-fc-pms-server/roleGroup/getRoleGroupsForAccount', {
    query: {
      accountId,
    },
  });
}

async function updatePassword({ oldPassWord, newPassWord, confirmPass }) {
  return request('updatePassWord', {
    query: {
      oldPassWord,
      newPassWord,
      confirmPass,
    },
  });
}


export default {
  list,
  remove,
  detail,
  save,
  update,
  changeStatus,
  setRoles,
  rolesByOrgId,
  orgsTree,
  selectedOrgs,
  roleGroupsByAccount,
  updatePassword,
};
