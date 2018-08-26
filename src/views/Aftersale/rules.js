/*
 * @Author: wuhao
 * @Date: 2018-05-21 12:14:38
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-21 12:23:50
 *
 * 表单校验规则
 */

/**
 * 地区选择校验 --  必须选择地区
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validatorRegionSelectIsArea = (rule, value, callback) => {
  const { value: region } = value || {};
  const [provinceId, cityId, areaId] = region || [];

  if (!provinceId) {
    callback('请选择所在省份');
  } else if (!cityId) {
    callback('请选择所在城市');
  } else if (!areaId) {
    callback('请选择所在地区');
  }

  callback();
};
