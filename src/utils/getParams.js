import moment from 'moment';

function orgId() {
  const data = JSON.parse(localStorage.getItem('user'));
  return data.orgIdSelected;
}
function accountId() {
  const data = JSON.parse(localStorage.getItem('user'));
  return data.accountId;
}
function orgType() {
  const data = JSON.parse(localStorage.getItem('user'));
  return Number(data.orgType); // 组织类型 1 项目门店型 2 管理架构型
}
function formatDate(dateArr, a = 'start', b = 'end') {
  let DateStart;
  let DateEnd;
  if (dateArr && Array.isArray(dateArr)) {
    if (dateArr.length) {
      [DateStart, DateEnd] = dateArr;
      DateStart = new Date(moment(DateStart)).getTime();
      DateEnd = new Date(moment(DateEnd)).getTime();
    }
  }
  const obj = {};
  obj[a] = DateStart;
  obj[b] = DateEnd;

  return obj;
}

/**
 * 获取当前组织类型
 */
function getOrgType() {
  const json = JSON.parse(localStorage.getItem('user'));
  const { orgType: selectedOrgType, orgVOSelected } = json || {};
  const { orgType: defaultOrgType } = orgVOSelected || {};

  return selectedOrgType || defaultOrgType; // 组织类型 1 门店级别 2 项目级别
}

/**
 * 判断当前组织是否是项目型组织
 */
function isProjectOrg() {
  return `${getOrgType()}` === '2';
}

/**
 * 判断当前组织是否是门店型组织
 */
function isStoreOrg() {
  return `${getOrgType()}` === '1';
}

export {
  orgId,
  formatDate,
  orgType,
  getOrgType,
  isProjectOrg,
  isStoreOrg,
  accountId,
};
