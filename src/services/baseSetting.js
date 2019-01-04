import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server';
  return requestBase(baseUrl + url, params);
}

/**
 * 查询组织树
 * @param {*} orgId  查询条件
 */
async function searchOrgList(orgId) {
  return request('/org/searchOrgList', {
    method: 'POST',
    body: {
      orgId,
    },
  });
}

/**
 * 查询当前组织的部门树
 * @param {*} orgId   查询条件
 */
async function searchDepList(orgId) {
  return request('/dep/searchDepListByOrgId', {
    method: 'POST',
    body: {
      orgId,
    },
  });
}

/**
 * 查询所有角色组
 */
async function searchRoleGroupList() {
  return request('/roleGroup/roleGroupListByPage', {
    method: 'POST',
    body: {
      roleGroupPageVo: {
        currPage: 1,
        pageSize: 1000,
        roleGroupVo: {},
      },
    },
  });
}

/**
 * 查询所有角色
 */
async function searchRoleList() {
  return request('/role/page', {
    method: 'POST',
    body: {
      rolePageVO: {
        currPage: 1,
        pageSize: 1000,
        roleVO: {
          isDelete: 0,
        },
      },
    },
  });
}

/**
 * 新增编辑组织
 * @param {*} orgVO
 */
async function orgSave(orgVO) {
  return request('/org/saveOrUpdate', {
    method: 'POST',
    body: {
      orgVO,
    },
  });
}

/**
 * 删除组织
 * @param {*} orgId
 */
async function orgDel(orgId) {
  return request('/org/delete', {
    method: 'POST',
    body: {
      orgId,
    },
  });
}

/**
 * 查询城市下的所有门店
 * @param {*} regionId 
 */
async function orgGetOrgByRegion(params) {
  return request('/org/getOrgByRegion', {
    method: 'POST',
    body: params
  });
}

/**
 * 新增编辑部门
 * @param {*} depVO
 */
async function depSave(depVO) {
  return request('/dep/saveOrUpdate', {
    method: 'POST',
    body: {
      depVO,
    },
  });
}

/**
 * 批量新增部门
 * @param {*} depVOList
 */
async function depListAdd(depVOList) {
  return request('/dep/save/list', {
    method: 'POST',
    body: {
      depVOList,
    },
  });
}

/**
 * 删除部门
 * @param {*} depId
 */
async function depDel(depId) {
  return request('/dep/delete', {
    method: 'POST',
    body: {
      depId,
    },
  });
}
/**
 * 编辑角色组
 * @param {*} roleGroupVo
 */
async function roleGroupSave(roleGroupVo) {
  return request('/roleGroup/addOrUpdateRoleGroup', {
    method: 'POST',
    body: {
      roleGroupVo,
    },
  });
}

/**
 * 删除角色组
 * @param {*} roleGroupId
 */
async function roleGroupDel(roleGroupId) {
  return request('/roleGroup/deleteRoleGroup', {
    method: 'POST',
    body: {
      roleGroupId,
    },
  });
}

export default {
  searchOrgList,
  searchDepList,
  searchRoleGroupList,
  searchRoleList,
  orgSave,
  orgDel,
  orgGetOrgByRegion,
  depSave,
  depListAdd,
  depDel,
  roleGroupSave,
  roleGroupDel,
};
