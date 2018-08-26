import request from '../utils/request';

async function list(params) {
  return request('/mj/user-center-server/member/list', {
    method: 'POST',
    body: {
      condition: {
        ...params,
      },
    },
    pagination: true,
  });
}

async function log(params) {
  return request('/mj/user-center-server/member/log/list', {
    method: 'POST',
    body: {
      logCondition: {
        ...params,
      },
    },
    pagination: true,
  });
}

async function detail(params) {
  return request('/mj/user-center-server/member/detail', {
    method: 'POST',
    body: {
      businessType: 2,
      ...params,
    },
  });
}

async function add(params) {
  return request('/mj/user-center-server/member/add-update', {
    method: 'POST',
    body: {
      userParam: {
        businessType: 2,
        accountType: 1, // 账号类型：1-C端用户，2-B端用户，3-A端用户
        userRoleType: 1, // 用户身份角色类别：1-C端普通用户；2-运营专员；3-物业人员；4-超级管理员；5-供应商（厂商）；6-采购商；7-经销商；8-小商家
        ...params,
      },
    },
  });
}

async function update(params) {
  return request('/mj/user-center-server/member/add-update', {
    method: 'POST',
    body: {
      userParam: {
        businessType: 2,
        accountType: 1, // 账号类型：1-C端用户，2-B端用户，3-A端用户
        userRoleType: 1, // 用户身份角色类别：1-C端普通用户；2-运营专员；3-物业人员；4-超级管理员；5-供应商（厂商）；6-采购商；7-经销商；8-小商家
        ...params,
      },
    },
  });
}

async function edit(params) {
  return request('/mj/user-center-server/member/add-update', {
    method: 'POST',
    body: {
      userParam: {
        businessType: 2,
        ...params,
      },
    },
  });
}

async function state(params) {
  return request('/mj/user-center-server/member/state', {
    method: 'POST',
    body: {
      businessType: 2,
      ...params,
    },
  });
}

async function getMobiles(params) {
  return request('/mj/user-center-server/member/mobiles', {
    method: 'POST',
    body: {
      businessType: 2,
      ...params,
    },
  });
}

async function downloadTem(params) {
  return request('/mj/user-center-server/member/download/template', {
    method: 'POST',
    body: {
      businessType: 2,
      ...params,
    },
  });
}

async function exportTem(params) {
  return request('/mj/user-center-server/member/export/prepare', {
    method: 'POST',
    body: {
      condition: {
        businessType: 2,
        ...params,
      },
    },
  });
}

async function importTem(params) {
  return request('/mj/user-center-server/user/import', {
    method: 'POST',
    body: {
      businessType: 2,
      accountType: 1,
      batchImportVo: {
        ...params,
      },
    },
  });
}

async function cart(params) {
  return request('/mj/ht-mj-cart-server/usercartskus', {
    method: 'POST',
    body: {
      ...params,
    },
    pagination: true,
  });
}

async function address(params) {
  return request('/mj/user-center-server/user/address/someone', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function password(params) {
  return request('/mj/user-center-server/secure/password/default', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function latestAddress(params) {
  return request('/mj/ht-mj-order-server/order/admin/queryLastOrder', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function accountDetail(params) {
  return request('/mj/ht-mj-account-server/getAcountsByAccountId', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export default {
  list,
  detail,
  update,
  add,
  edit,
  state,
  log,
  cart,
  getMobiles,
  downloadTem,
  exportTem,
  importTem,
  address,
  password,
  latestAddress,
  accountDetail,
};
