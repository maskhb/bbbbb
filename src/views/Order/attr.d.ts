/**
 * 获取搜索用选项键值
 * @param {*} options
 */
export declare function getSearchOptions(options: Object): Array<Object>;


/**
 * 根据options的label或value获取optionsItem
 * @param {*} options
 * @param {String:[label,value]} keyName
 * @param {Number|String} keyValue
 */
export declare function getOptionItemForLabelOrValue(options: Object, keyName: string, keyValue: string): Object;

/**
 * 根据Value获取Label
 *
 * 例子: getOptionLabelForValue(options)(value)
 *
 * @param {*} options
 */
export declare function getOptionLabelForValue(options: Object): any ;

/**
 * 根据Label获取Value
 *
 * 例子: getOptionValueForLabel(options)(label)
 *
 * @param {*} options
 */
export declare function getOptionValueForLabel(options: Object): Function;

/**
 * 获取开始结束时间（6个月间隔）
 */
export declare function getStartTimeAndEndTimeFor6Months(): Array<any>;

/**
 * 支付方式
 */
export declare const payTypeOptions: Array<any>;

/**
 * 支付方式  -- 无已付定金
 */
export declare const payStatusNoDepositOptions: Array<any>;

/**
 * 支付状态
 */
export declare const payStatusOptions: Array<any>;

/**
 * 订单类型
 */
export declare const orderTypeOptions: Array<any>;

/**
 * 订单来源
 */
export declare const orderSourceOptions: Array<any>;

/**
 * 订单状态
 */
export declare const orderStatusOptions: Array<any>;

/**
 * 结算状态
 */
export declare const settleStatusOptions: Array<any>;

/**
 * 发票类型
 */
export declare const invoiceTypeNeedOptions: Array<any>;

/**
 * 发票类型
 */
export declare const invoiceTypeOptions: Array<any>;

/**
 * 配送方式
 */
export declare const deliveryMethodOptions: Array<any>;

/**
 * 是否需要发票
 */
export declare const needInvoiceTypeForNameOptions: Array<any>;

/**
 * 是否需要发票
 */
export declare const needInvoiceTypeOptions: Array<any>;

/**
 * 列表展示是否需要发票
 */
export declare const needInvoiceListOptions: Array<any>;

/**
 * 是否超额
 */
export declare const whenExcessTypeOptions: Array<any>;

/**
 * 物流方式
 */
export declare const LogisticsTypeOptions: Array<any>;
