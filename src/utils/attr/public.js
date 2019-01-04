/*
 * @Author: wuhao
 * @Date: 2018-07-18 17:04:07
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-27 09:40:40
 *
 * 属性公共调用方法
 */


/**
 * 获取搜索用选项键值
 * @param {*} options
 */
export const getSearchOptions = (options) => {
  return [
    {
      label: '全部',
      value: '',
    },
    ...options,
  ];
};

/**
 * 根据options的label或value获取optionsItem
 * @param {*} options
 * @param {String:[label,value]} keyName
 * @param {Number|String} keyValue
 */
export const getOptionItemForLabelOrValue = (options, keyName, keyValue) => {
  return (options || []).find((item) => {
    return `${item[keyName]}` === `${keyValue}`;
  });
};

/**
 * 根据Value获取Label
 *
 * 例子: getOptionLabelForValue(options)(value)
 *
 * @param {*} options
 */
export const getOptionLabelForValue = (options) => {
  return (value) => {
    const optionItem = getOptionItemForLabelOrValue(options, 'value', value);
    return optionItem ? optionItem.label : null;
  };
};

/**
 * 根据Label获取Value
 *
 * 例子: getOptionValueForLabel(options)(label)
 *
 * @param {*} options
 */
export const getOptionValueForLabel = (options) => {
  return (label) => {
    const optionItem = getOptionItemForLabelOrValue(options, 'label', label);

    return optionItem ? optionItem.value : null;
  };
};


// 性别 通用
export const sexGeneralOptions = [
  {
    value: 1,
    label: '男',
  },
  {
    value: 2,
    label: '女',
  },
];

// 性别
export const sexOptions = [
  {
    value: 0,
    label: '保密',
  },
  ...sexGeneralOptions,
];

// 状态 启用/禁用
export const stateEnabledOrDisableOptions = [
  {
    value: 1,
    label: '启用',
  },
  {
    value: 2,
    label: '禁用',
  },
];

// 状态 可用/不可用
export const stateAvailableOrUnavailable = [
  {
    value: 1,
    label: '可用',
  },
  {
    value: 2,
    label: '不可用',
  },
];
