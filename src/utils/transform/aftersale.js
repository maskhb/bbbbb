/*
 * @Author: wuhao
 * @Date: 2018-06-22 11:02:00
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-22 11:05:15
 *
 * 售后 常用数据转换方法
 */
import { plainToClassFromExist, classToPlain } from 'class-transformer';

/**
 * ts数据转换
 * @param {*} params 要转换的参数
 * @param {*} model 转换TS的Model
 */
export const transformObjectToTSModal = (params, model) => {
  return classToPlain(plainToClassFromExist(
    model,
    params
  ), { excludePrefixes: ['_'] });
};
