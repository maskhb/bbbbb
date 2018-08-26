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
 * 判断是否是待入库状态
 * @param {Number} returnStatus
 */
export declare function isToBePutInStorage(returnStatus?: Number): Boolean;

/**
 * 是否实物退货
 */
export declare const returnOfGoodsTypeOptions : Array<any>;

/**
 * 入库状态
 */
export declare const warehouseStatusOptions : Array<any>;

/**
 * 服务类型
 */
export declare const applyServiceTypeOptions : Array<any>;

/**
 * 售后状态
 */
export declare const afterSaleStatusOptions : Array<any>;

/**
 * 关闭状态
 */
export declare const closeStatusOptions : Array<any>;


/**
 * 售后类型
 */
export declare const AfterSaleTypeOptions : Array<any>;

/**
 * 退款状态
 */
export declare const RefundStatusOptions : Array<any>;

/**
 * 责任归属
 */
export declare const ResponsibilityOptions : Array<any>;
/**
 * 退货类型
 */
export declare const ReturnTypeOptions : Array<any>;

/**
 * 结算状态
 */
export declare const SettlementStatusOptions : Array<any>;

/**
 * 配送方式
 */
export declare const DistributionTypeOptions : Array<any>;

/**
 * 运费承担方
 */
export declare const FreightTypeOptions : Array<any>;

/**
 * 商品返回方式
 */
export declare const ReturnWayOptions : Array<any>;

/**
 * 配送方式
 */
export declare const DeliveryMethodOptions : Array<any>;

/**
 * 订单状态
 */
export declare const OrderStatusOptions : Array<any>;

/**
 * 支付状态
 */
export declare const PayStatusOptions : Array<any>;

/**
 * 是否已删除
 */
export declare const IsDeleteOptions : Array<any>;

/**
 * 是否关闭
 */
export declare const shutDownStatusOptions : Array<any>;
