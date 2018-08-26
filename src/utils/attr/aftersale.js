/*
 * @Author: wuhao
 * @Date: 2018-06-21 17:17:56
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-25 10:32:46
 *
 * 售后公共属性
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

// ////////////////////////////////////////////

/**
 * 判断是否是待入库状态
 * @param {Number} returnStatus
 */
export const isToBePutInStorage = (returnStatus) => {
  const label = getOptionLabelForValue(warehouseStatusOptions)(returnStatus);
  return label === '待入库';
};

// ///////////////////////////////////////////
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

/**
 * 服务类型
 */
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

/**
 * 售后状态
 */
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

/**
 * 关闭状态
 */
export const closeStatusOptions = [
  {
    value: 1,
    label: '是',
  },
  {
    value: 2,
    label: '否',
  },
];

/**
 * 售后类型
 */
export const AfterSaleTypeOptions = [
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
];

/**
 * 退款状态
 */
export const RefundStatusOptions = [
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

/**
 * 责任归属
 */
export const ResponsibilityOptions = [
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
 * 退货类型
 */
export const ReturnTypeOptions = [
  {
    value: 1,
    label: '无理由退款',
  },
  {
    value: 2,
    label: '有理由退款',
  },
];

/**
 * 结算状态
 */
export const SettlementStatusOptions = [
  {
    value: 1,
    label: '未结算',
  },
  {
    value: 2,
    label: '已结算',
  },
];

/**
 * 配送方式
 */
export const DistributionTypeOptions = [
  {
    value: 1,
    label: '物流配送',
  },
  {
    value: 2,
    label: '快递配送',
  },
];

/**
 * 运费承担方
 */
export const FreightTypeOptions = [
  {
    value: 1,
    label: '商家',
  },
  {
    value: 2,
    label: '客户',
  },
];

/**
 * 商品返回方式
 */
export const ReturnWayOptions = [
  {
    value: 1,
    label: '客户寄回',
  },
  {
    value: 2,
    label: '上门取货',
  },
];

/**
 * 配送方式
 */
export const DeliveryMethodOptions = [
  {
    value: 1,
    label: '免费配送',
  },
];

/**
 * 订单状态
 */
export const OrderStatusOptions = [
  {
    value: 1,
    label: '待支付',
  },
  {
    value: 2,
    label: '待审核',
  },
  {
    value: 3,
    label: '待付尾款',
  },
  {
    value: 4,
    label: '待发货',
  },
  {
    value: 5,
    label: '待收货',
  },
  {
    value: 6,
    label: '已完成',
  },
  {
    value: 7,
    label: '已取消',
  },
];

/**
 * 支付状态
 */
export const PayStatusOptions = [
  {
    value: 1,
    label: '未支付',
  },
  {
    value: 2,
    label: '已支付',
  },
];

/**
 * 是否已删除
 */
export const IsDeleteOptions = [
  {
    value: 0,
    label: '否',
  },
  {
    value: 1,
    label: '是',
  },
];


/**
 * 是否关闭
 */
export const shutDownStatusOptions = [
  {
    value: 1,
    label: '未关闭',
  },
  {
    value: 2,
    label: '已关闭',
  },
];
