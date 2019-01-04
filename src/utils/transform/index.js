import { plainToClassFromExist, classToPlain } from 'class-transformer';

/**
 * ts数据转换
 * @param {*} params 要转换的参数
 * @param {*} model 转换TS的Model
 */
export const transformObjectToTSModal = (params, model, prefix) => {
  return classToPlain(plainToClassFromExist(
    model,
    params
  ), { excludePrefixes: prefix || ['_'] });
};

/**
 * 用于转换page的query对象
 * @param {*} params
 * @param {*} model
 */
export const transformPageModal = (params, model) => {
  const { currPage, pageSize, ...other } = params;
  return plainToClassFromExist(model, other);
};
