/*
 * @Author: fuanzhao
 * @Date: 2018-06-06 10:19:21
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-13 09:54:06
 */
/**
  * 售后类型
  */
export const afterSaleTypeOptions = [
  {
    value: 1,
    label: '退货退款',
    key: 'return',
  },
  {
    value: 2,
    label: '换货',
    key: 'exchange',
  },
  {
    value: 3,
    label: '仅退款',
    key: 'refund',
  },
];


/**
 * 是否实物退货
 */
export const returnOfGoodsTypeOptions = [
  {
    value: 1,
    label: '有实物退货',
  },
  {
    value: 2,
    label: '无实物退货',
  },
];

/**
 * 入库状态
 */
export const warehouseStatusOptions = [
  {
    value: 1,
    label: '已入库',
  },
  {
    value: 0,
    label: '待入库',
  },
  {
    value: 2,
    label: '无需入库',
  },
];

export const applyServiceTypeOptions = [
  {
    value: 1,
    label: '退货退款',
  },
  {
    value: 2,
    label: '换货',
  },
  {
    value: 3,
    label: '仅退款',
  },
  {
    value: 4,
    label: '仅退款(超额支付)',
  },
];

export const afterSaleStatusOptions = [
  {
    value: 1,
    label: '同意退货',
  },
  {
    value: 6,
    label: '同意线下退货',
  },
  {
    value: 3,
    label: '同意换货',
  },
  {
    value: 7,
    label: '同意线下换货',
  },
  {
    value: 2,
    label: '同意退款',
  },
  {
    value: 5,
    label: '同意线下退款',
  },
  {
    value: 4,
    label: '已取消',
  },
  {
    value: 0,
    label: '待审核',
  },
];

export const APPLY_PENDING_STATUS = 0;


export const closeStatusOptions = [
  {
    value: 1,
    label: '未关闭',
  },
  {
    value: 2,
    label: '已关闭',
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


/**
 * 退货类型(客服)
 */

export const RETURN_TYPES = [
  {
    value: 1,
    label: '无理由',
  },
  {
    value: 2,
    label: '有理由',
  },
];

/**
 * 退货原因
 */
export const RETURN_REASONS = [
  {
    value: 1,
    label: '产品原因',
    entity: true,
  },
  {
    value: 2,
    label: '物流破损',
    entity: true,
  },
  {
    value: 3,
    label: '货期延误',
  },
  {
    value: 4,
    label: '无理由退货',
  },
  {
    value: 5,
    label: '拒收/退件',
    entity: true,
  },
  {
    value: 6,
    label: '订单信息错误',
  },
  {
    value: 7,
    label: '业主原因',
  },
  {
    value: 8,
    label: '价格变动/活动赠品',
    entity: false,
  },
];

/**
 * 责任归属
 */
export const RETURN_DUTIES = [
  {
    value: 1,
    label: '厂家',
  },
  {
    value: 2,
    label: '商家',
  },
  {
    value: 3,
    label: '物流',
  },
  {
    value: 4,
    label: '业主',
  },
  {
    value: 5,
    label: '平台',
  },
  {
    value: 6,
    label: '物业',
  },
];

/**
 * 退货退款渠道
 */

export const RETURN_CHANNEL = [
  {
    value: 1,
    label: '线下处理退货退款',
  },
  {
    value: 2,
    label: '平台处理退货退款',
  },
];
export const REFUND_CHANNEL = [
  {
    value: 1,
    label: '线下处理退款',
  },
  {
    value: 2,
    label: '平台处理退款',
  },
];

export const RETURN_REFUND_CHANNEL = {
  RETURN_CHANNEL,
  REFUND_CHANNEL,
};

export const RETURN_WAY = [
  {
    value: 1,
    label: '客户寄回',
  },
  {
    value: 2,
    label: '上门取货',
  },
];

export const DISTRIBUTION_TYPE = [
  {
    value: 1,
    label: '物流配送',
  },
  {
    value: 2,
    label: '快递配送',
  },
];

export const FREIGHT_TYPE = [
  {
    value: 1,
    label: '客户',
  },
  {
    value: 2,
    label: '商家',
  },
];


export const REFUND_STATUS = [
  {
    value: 0,
    label: '未退款',
  },
  {
    value: 1,
    label: '退款中',
  },
  {
    value: 2,
    label: '已退款',
  },
  {
    value: 3,
    label: '无需退款',
  },
  {
    value: 4,
    label: '已取消',
  },
];

export const RETURN_TYPE = [
  {
    value: 1,
    label: '无理由退款',
  },
  {
    value: 2,
    label: '有理由退款',
  },
];

export const RETURN_STATUS = [
  {
    value: 0,
    label: '待入库',
  },
  {
    value: 1,
    label: '已入库',
  },
  {
    value: 2,
    label: '无需入库',
  },
];

export const SETTLEMENT_STATUS = [
  {
    value: 0,
    label: '未结算',
  },
  {
    value: 1,
    label: '已结算',
  },
];
