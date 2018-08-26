export const STATUS = [
  '待上架',
  '上架',
  '下架',
];

export const GOODS_STATUS = [
  '未知',
  '待上架',
  '上架',
  '下架',
];

export const TOP = [
  '非置顶',
  '置顶',
];

export const STATUSLEVELS = [
  'default',
  'success',
  'error',
];

export const STATUS_AUDIT = [
  '待审核',
  '审核通过',
  '审核不通过',
];

export const arrAuditStatus = [{
  value: 0,
  label: STATUS_AUDIT[0],
}, {
  value: 1,
  label: STATUS_AUDIT[1],
}, {
  value: 2,
  label: STATUS_AUDIT[2],
}];

export const arrAuditStatusFilters = [{
  value: 0,
  text: STATUS_AUDIT[0],
}, {
  value: 1,
  text: STATUS_AUDIT[1],
}, {
  value: 2,
  text: STATUS_AUDIT[2],
}];

export const arrTop = [{
  value: 0,
  label: TOP[0],
}, {
  value: 1,
  label: TOP[1],
}];

export const arrStatus = [{
  value: 0,
  label: STATUS[0],
}, {
  value: 1,
  label: STATUS[1],
}, {
  value: 2,
  label: STATUS[2],
}];

export const TAG_TYPES = {
  1: 'arrHouseTypeTags',
  2: 'arrDecorateStyle',
};

export const LIST = '/goods/package';
export const AUDIT = '/goods/pendingpackage';
export const UN_AUDIT = '/goods/unapprovalpackage';
