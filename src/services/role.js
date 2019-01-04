import baseRequest from 'utils/request';

const request = (url, params) => {
  return baseRequest(`/fc/ht-fc-pms-server/role/${url}`, params);
};
/* 分页获取渠道列表 */
async function list(params) {
  return request('page', {
    method: 'POST',
    body: {
      rolePageVO: params,
    },
    pagination: true,
  });
}

async function remove({ roleId }) {
  return request('delete', {
    query: {
      roleId,
    },
  });
}

async function save(params) {
  return request('saveOrUpdateRole', {
    body: {
      roleAddOrUpdateParamVo: params,
    },
  });
}

async function update(params) {
  return request('saveOrUpdateRole', {
    body: {
      roleAddOrUpdateParamVo: params,
    },
  });
}

async function getRoleAuths({ roleId }) {
  return request('getAuthsOfRole', {
    query: {
      roleId,
    },
  });
}

async function setRoleAuths({ roleId, authIds }) {
  return request('setAuthForRole', {
    body: {
      roleAuthAddParamVO: {
        authIds,
        roleId,
      },
    },
  });
}

async function roleGroupList() {
  return baseRequest('/fc/ht-fc-pms-server/roleGroup/roleGroupListByPage', {
    body: {
      roleGroupPageVo: {
        pageSize: 100000,
        currPage: 1,
        roleGroupVo: {},
      },
    },
  });
}


export default {
  list,
  remove,
  save,
  update,
  getRoleAuths,
  setRoleAuths,
  roleGroupList,
};
