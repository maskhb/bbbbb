/*
 * @Author: wuhao
 * @Date: 2018-04-04 14:31:10
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-09 14:42:55
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

    return optionItem ? optionItem.value : null;
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
 * 判断订单是否是指定类型订单
 * @param {Number} orderGoodsType
 * @param {String} appointName
 */
export const isAppointNameGoodsOrder = (orderGoodsType, appointName) => {
  return getOptionLabelForValue(OrderGoodsTypeOptions)(orderGoodsType) === appointName;
};
/**
 * 判断订单是否是定制商品订单
 * @param {Number} orderGoodsType
 */
export const isCustomGoodsOrder = (orderGoodsType) => {
  return isAppointNameGoodsOrder(orderGoodsType, '定制');
};

/**
 *  判断订单是否是套餐的商品订单
 * @param {Number} orderGoodsType
 */
export const isSetMealGoodsOrder = (orderGoodsType) => {
  return isAppointNameGoodsOrder(orderGoodsType, '套餐');
};

/**
 * 判断订单是否是赠品的商品订单
 * @param {Number} orderGoodsType
 */
export const isGiftGoodsOrder = (orderGoodsType) => {
  return isAppointNameGoodsOrder(orderGoodsType, '赠品');
};

/**
 * 判断商品是否是套餐商品
 * @param {*} isPackage
 */
export const isSetMealOrderGoodsInfo = (isPackage) => {
  return getOptionLabelForValue(GoodsIsPackageOptions)(isPackage) === '套餐';
};
/**
 * 判断订单商品是否是已发货状态
 * @param {*} shippedStatus
 */
export const isOrderGoodsShipped = (shippedStatus) => {
  return getOptionLabelForValue(OrderGoodsShippedStatusOptions)(shippedStatus) === '已发货';
};

/**
 * 判断订单商品是否是定制商品
 * @param {*} isRemark
 */
export const IsOrderGoodsIsRemark = (isRemark) => {
  return getOptionLabelForValue(OrderGoodsIsRemarkOptions)(isRemark) === '是';
};

/**
 * 是否超额支付
 * @param {*} excessPay
 */
export const IsExcessOrderAmount = (excessPay) => {
  return getOptionLabelForValue(whenExcessTypeOptions)(excessPay) === '是';
};

/**
 * 判断是否是已支付订单（全部支付订单）
 * @param {*} payStatus
 */
export const isPaidOrder = (payStatus) => {
  return getOptionLabelForValue(payStatusOptions)(payStatus) === '已支付';
};

/**
 * 判断是否是部分发货
 */
export const isPartialShipments = (orderDetail) => {
  return (orderDetail?.orderGoodsVOList || []).some(
    item => isOrderGoodsShipped(item?.shippedStatus)
  );
};

/**
 * 判断是否是已结算
 * @param {*}} settleStatus
 */
export const isAlreadySettled = (settleStatus) => {
  return getOptionLabelForValue(settleStatusOptions)(settleStatus) === '已结算';
};

/**
 * 判断是否是售后订单来源
 * @param {*} orderSource
 */
export const isAftersaleOrderSource = (orderSource) => {
  return getOptionLabelForValue(orderSourceOptions)(orderSource) === '售后订单';
};

/**
 * 支付方式
 */
export const payTypeOptions = [
  {
    value: 'cash_offline',
    label: '线下现金转账',
  },
  {
    value: 'union_pay',
    label: '银联全渠道网关支付',
  },
  {
    value: 'ali_wap',
    label: '支付宝手机支付',
  },
  {
    value: 'wx_native',
    label: '微信扫码支付',
  },
  {
    value: 'ali_pc',
    label: '支付宝电脑支付',
  },
  {
    value: 'lakala_pos',
    label: 'T-拉卡拉POS机刷卡支付（移动端）',
  },
  {
    value: 'lakala_pos_pc',
    label: '拉卡拉POS机刷卡支付（PC）',
  },
  {
    value: 'jjq_h5',
    label: '品牌家居券手机支付',
  },
  {
    value: 'jjq_pc',
    label: '品牌家居券电脑支付',
  },
  {
    value: 'wx_jsapi',
    label: '微信手机（公众号）支付',
  },
  {
    value: 'wallet',
    label: '钱包',
  },
  {
    value: 'KKK',
    label: '支付宝',
  },
  {
    value: 'pre_deposit',
    label: '预存款',
  },
  {
    value: 'FFF',
    label: '微信',
  }];

/**
 * 支付方式  -- 无已付定金
 */
export const payStatusNoDepositOptions = [
  {
    label: '未支付',
    value: 1,
  },
  {
    label: '已支付',
    value: 2,
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
    label: '待审核',
    value: 2,
  },
  {
    label: '待付尾款',
    value: 3,
  },
  {
    label: '待发货',
    value: 4,
  },
  {
    label: '待收货',
    value: 5,
  },
  {
    label: '已完成',
    value: 6,
  },
  {
    label: '已取消',
    value: 7,
  },
  {
    label: '已取消 ',
    value: 8,
  },
];

/**
 * 订单状态  查询用
 */
export const orderStatusSelectOptions = [
  {
    label: '待支付',
    value: 1,
  },
  {
    label: '待审核',
    value: 2,
  },
  {
    label: '待付尾款',
    value: 3,
  },
  {
    label: '待发货',
    value: 4,
  },
  {
    label: '待收货',
    value: 5,
  },
  {
    label: '已完成',
    value: 6,
  },
  {
    label: '已取消',
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
export const invoiceTypeNeedOptions = [
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
export const needInvoiceTypeForNameOptions = [
  {
    label: '需要',
    value: 1,
  },
  {
    label: '不需要',
    value: 2,
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
 * 列表展示是否需要发票
 */
export const needInvoiceListOptions = [
  {
    label: '否',
    value: 1,
  },
  {
    label: '是',
    value: 2,
  },
  {
    label: '是',
    value: 3,
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

/**
 * 商品类型
 */
export const GoodsTypeOptions = [
  {
    label: '标准',
    value: 1,
  },
  {
    label: '普通',
    value: 2,
  },
  {
    label: '定制',
    value: 3,
  },
  {
    label: '赠品',
    value: 4,
  },
  {
    label: '套餐',
    value: 5,
  },
];

/**
 * 商品类型 -- 用于订单列表商品标签显示
 */
export const GoodsTypeForOrderShowOptions = [
  {
    label: '定制',
    value: 3,
  },
  {
    label: '赠品',
    value: 4,
  },
];

/**
 * 订单商品类型
 */
export const OrderGoodsTypeOptions = [
  ...GoodsTypeOptions,
];

/**
 * 是否套餐
 */
export const GoodsIsPackageOptions = [
  {
    label: '套餐',
    value: 1,
  },
  {
    label: '非套餐',
    value: 2,
  },
];

/**
 * 订单商品发货状态
 */
export const OrderGoodsShippedStatusOptions = [
  {
    label: '已发货',
    value: 1,
  },
  {
    label: '未发货',
    value: 2,
  },
];

/**
 * 是否是定制备注商品
 */
export const OrderGoodsIsRemarkOptions = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '不是',
    value: 2,
  },
];
