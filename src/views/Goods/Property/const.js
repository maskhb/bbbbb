export const STATUS_DRAFT = 3;
export const STATUS_ENABLE = 1;
export const STATUS_DISABLE = 2;
export const statuses = {
  [STATUS_DISABLE]: '禁用',
  [STATUS_DRAFT]: '草稿',
  [STATUS_ENABLE]: '启用',
};

export const TYPE_RADIO = 1;
export const TYPE_SELECT_MULTI = 2;
export const TYPE_SELECT_INPUT = 3;
export const TYPE_SELECT_SEARCH = 4;

export const PROPERTY_BASIC_TYPE = 1;
export const PROPERTY_SPEC_TYPE = 2;

export const inputTypes = {
  [TYPE_RADIO]: 'Radio单选',
  [TYPE_SELECT_MULTI]: 'Select多选组',
  [TYPE_SELECT_INPUT]: '下拉列表选择框',
  [TYPE_SELECT_SEARCH]: '带搜索下拉列表选择框',
};
