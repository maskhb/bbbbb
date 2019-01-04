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
 * 启用禁用状态
 */
export declare const stateEnabledOrDisableOptions:Array<any>;

/**
 * 可用/不可用 状态
 */
export declare const stateAvailableOrUnavailable:Array<any>;
