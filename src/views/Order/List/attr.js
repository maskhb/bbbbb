/*
 * @Author: wuhao
 * @Date: 2018-04-04 14:31:10
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-16 10:10:57
 *
 * 订单列表公共选项
 */

import moment from 'moment';

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

    return optionItem ? optionItem.label : null;
  };
};

/**
 * 获取开始结束时间（6个月间隔）
 */
export const getStartTimeAndEndTimeFor6Months = () => {
  const nowMoment = moment();
  return [
    moment(nowMoment).subtract(6, 'months'),
    moment(nowMoment),
  ];
};

/**
 * 支付方式
 */
export const payTypeOptions = [
  {
    label: '微信手机支付',
    value: 1,
  },
  {
    label: '预存款支付',
    value: 2,
  },
  {
    label: 'POS机收款',
    value: 3,
  },
  {
    label: 'POS机刷卡支付',
    value: 4,
  },
  {
    label: '收银宝POS机刷卡支付',
    value: 5,
  },
  {
    label: '收银宝POS机刷卡支付（PC）',
    value: 6,
  },
  {
    label: '货到付款',
    value: 7,
  },
  {
    label: '密家钱包支付',
    value: 8,
  },
  {
    label: '品牌家居券电脑支付',
    value: 9,
  },
  {
    label: '品牌家居券手机支付',
    value: 10,
  },
  {
    label: '拉卡拉POS机刷卡支付（PC）',
    value: 11,
  },
  {
    label: 'T-拉卡拉POS机刷卡支付（移动端）',
    value: 12,
  },
  {
    label: '支付宝电脑支付',
    value: 13,
  },
  {
    label: '在线支付',
    value: 14,
  },
  {
    label: '微信扫码支付',
    value: 15,
  },
  {
    label: '支付宝手机支付',
    value: 16,
  },
  {
    label: '银联全渠道网关支付',
    value: 17,
  },
  {
    label: '现金支付',
    value: 18,
  },
];

/**
  * 支付状态
  */
export const payStatusOptions = [
  {
    label: '未支付',
    value: 1,
  },
  {
    label: '已支付',
    value: 2,
  },
  {
    label: '已付定金',
    value: 3,
  },
];


/**
 * 订单类型
 */
export const orderTypeOptions = [
  {
    label: '母订单',
    value: 1,
  },
  {
    label: '子订单',
    value: 2,
  },
];

/**
 * 订单来源
 */
export const orderSourceOptions = [
  {
    label: 'PC端',
    value: 1,
  },
  {
    label: '微信端 ',
    value: 2,
  },
  {
    label: '售后订单',
    value: 3,
  },
  {
    label: '后台订单',
    value: 4,
  },
];

/**
 * 订单状态
 */
export const orderStatusOptions = [
  {
    label: '待支付',
    value: 1,
  },
  {
    label: '待发货',
    value: 2,
  },
  {
    label: '待收货',
    value: 3,
  },
  {
    label: '已完成',
    value: 4,
  },
  {
    label: '已取消',
    value: 5,
  },
  {
    label: '待审核',
    value: 6,
  },
  {
    label: '待付尾款',
    value: 7,
  },
];

/**
 * 结算状态
 */
export const settleStatusOptions = [
  {
    label: '未结算',
    value: 1,
  },
  {
    label: '已结算',
    value: 2,
  },
];

/**
 * 发票类型
 */
export const invoiceTypeOptions = [
  {
    label: '不开发票',
    value: 1,
  },
  {
    label: '个人发票',
    value: 2,
  },
  {
    label: '公司发票',
    value: 3,
  },
];

/**
 * 配送方式
 */
export const deliveryMethodOptions = [
  {
    label: '全国免费配送',
    value: 1,
  },
];

/**
 * 是否需要发票
 */
export const needInvoiceTypeOptions = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
];

/**
 * 是否超额
 */
export const whenExcessTypeOptions = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
];

/**
 * 物流方式
 */
export const LogisticsTypeOptions = [
  {
    label: '物流发货',
    value: 1,
  },
  {
    label: '无需物流',
    value: 2,
  },
];
