import request from '../utils/request';
/* 价格代码管理 */
// 分页获取列表
async function queryListByPage(rateCodePageQueryVO) {
  return request('/fc/ht-fc-pms-server/rateCode/page', {
    method: 'POST',
    body: {
      rateCodePageQueryVO,
    },
    pagination: true,
  });
}
// 新增和编辑
async function saveOrUpdate(rateCodeSaveOrUpdateVO) {
  return request('/fc/ht-fc-pms-server/rateCode/saveOrUpdate', {
    method: 'POST',
    body: {
      rateCodeSaveOrUpdateVO,
    },
  });
}
// 启用or禁用
async function updateStatus(rateCodeUpdateStatusVO) {
  return request('/fc/ht-fc-pms-server/rateCode/updateStatus', {
    method: 'POST',
    body: {
      rateCodeUpdateStatusVO,
    },
  });
}
// 删除
async function rateCodeDelete(rateCodeDeleteVO) {
  return request('/fc/ht-fc-pms-server/rateCode/delete', {
    method: 'POST',
    body: {
      rateCodeDeleteVO,
    },
  });
}
async function queryTempAccountReg(tempAccountRegPageVO) {
  return request('/fc/ht-fc-pms-server/tempAccountReg/page', {
    method: 'POST',
    body: {
      tempAccountRegPageVO,
    },
    pagination: true,
  });
}

async function queryAccountReceivable(params) {
  return request('/fc/ht-fc-pms-server/accountReceivable/page', {
    method: 'POST',
    body: {
      ...params,
    },
    pagination: true,
  });
}
async function accountReceivableDelete(params) {
  return request('/fc/ht-fc-pms-server/accountReceivable/delete', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function updateAccountReceivable(accountReceivableVO) {
  return request('/fc/ht-fc-pms-server/accountReceivable/update', {
    method: 'POST',
    body: {
      accountReceivableVO,
    },
  });
}
// 查询账务详情
async function queryCreditAccountDetails(params) {
  return request('/fc/ht-fc-pms-server/accountReceivable/details', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 分页获取账务详情
async function queryCreditAccountDetailsByPage(creditAccountDetailsQueryVO) {
  return request('/fc/ht-fc-pms-server/creditAccountDetails/page', {
    method: 'POST',
    body: {
      creditAccountDetailsQueryVO,
    },
    pagination: true,
  });
}
/* 查询所有时段订单账目 */
// /gres/account/listHisAccount 分页获取历史账务查询
async function queryHisAccount(gresAccountPageVO) {
  return request('/fc/ht-fc-pms-server/gres/account/listHisAccount', {
    method: 'POST',
    body: {
      gresAccountPageVO,
    },
    pagination: true,
  });
}
// 结算
async function addSettlement(params) {
  return request('/fc/ht-fc-pms-server/creditAccountDetails/addSettlement', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 调账
async function addReconciliation(creditAccountDetailsVO) {
  return request('/fc/ht-fc-pms-server/creditAccountDetails/addReconciliation', {
    method: 'POST',
    body: {
      creditAccountDetailsVO,
    },
  });
}
// 新增帐号
async function addAccountReceivable(accountReceivableVO) {
  return request('/fc/ht-fc-pms-server/accountReceivable/save', {
    method: 'POST',
    body: {
      accountReceivableVO,
    },
  });
}


export default {
  queryListByPage,
  saveOrUpdate,
  updateStatus,
  rateCodeDelete,
  queryTempAccountReg,
  queryAccountReceivable,
  updateAccountReceivable,
  queryCreditAccountDetails,
  queryCreditAccountDetailsByPage,
  queryHisAccount,
  addSettlement,
  addReconciliation,
  accountReceivableDelete,
  addAccountReceivable,
};

