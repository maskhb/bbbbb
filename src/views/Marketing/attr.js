/**
  * 售后类型
  */
export const scopeTypeOptions = [
  {
    value: 1,
    label: '全场',
  },
  {
    value: 2,
    label: '指定供应商',
  },
  {
    value: 3,
    label: '指定品类',
  },
  {
    value: 4,
    label: '指定商品',
  },
];


/**
 *  优惠券列表状态
 */
export const couponStatusOptions = [
  {
    value: 1,
    label: '未启用',
  },
  {
    value: 2,
    label: '已启用',
  },
  {
    value: 3,
    label: '已禁用',
  },
  {
    value: 4,
    label: '进行中',
  },
  {
    value: 5,
    label: '已过期',
  },
];

/**
 *  优惠券券码列表状态
 */
export const couponCodeStatusOptions = [
  {
    value: 1,
    label: '未激活',
  },
  {
    value: 2,
    label: '已激活',
  },
  {
    value: 3,
    label: '已核销',
  },
  {
    value: 4,
    label: '已注销',
  },
  // {
  //   value: 5,
  //   label: '已过期',
  // },
];


/**
 * 入库状态
 */
export const receiveMethodOptions = [
  {
    value: 1,
    label: '线上派发',
  },
  {
    value: 2,
    label: '人工派发',
  },
  {
    value: 3,
    label: '线下派发',
  },
];

export const isOnlyOptions = [
  {
    value: 1,
    label: '是',
  },
  {
    value: 2,
    label: '否',
  },
];

export const isDeleteOptions = [
  {
    value: 1,
    label: '删除',
  },
  {
    value: 2,
    label: '未删除',
  },
];


export const codeTypeOptions = [
  {
    value: 2,
    label: '随机码',
  },
  {
    value: 1,
    label: '统一码',
  },
];

/**
 * 退货类型(客服)
 */

export const clientType = [
  // {
  //   value: 1,
  //   label: 'PC',
  // },
  {
    value: 2,
    label: '移动端',
  },
];

/**
 * 退货原因
 */
export const belongTypes = [
  {
    value: 1,
    label: '平台',
  },
  {
    value: 2,
    label: '商家',
  },
];

/**
 * 获取搜索用选项键值
 * @param {*} options
 */
export const getSearchOptions = (options, includeFlag = true) => {
  if (includeFlag) {
    return [
      {
        label: '全部',
        value: '',
      },
      ...options,
    ];
  }
  return options;
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
