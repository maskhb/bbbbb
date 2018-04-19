import joi from 'joi';
import templates from './templates';

const detail = (res = {}, schema, transferFileds) => {
  const validMock = joi.validate(res, schema, { allowUnknown: true }); // 模拟接口数据
  if (!validMock.error) {
    return res;
  }

  const result = templates.transferDetail(res, schema, transferFileds); // 真实接口数据
  const validReal = joi.validate(result, schema, { allowUnknown: true });
  if (!validReal.error) {
    return result;
  }

  /* eslint no-console: 0 */
  if (validMock.error) {
    console.error(validMock);
  } else if (validReal.error) {
    console.error(validReal);
  }

  return {};
};

/**
 * 转换列表数据
 * Transfer data of list formation method
 * @param { 接口响应 Response type:Object } res
 * @param { 数据结构 Data structure type:Object} schema
 */
const list = (res = {}, schema, transferFileds) => {
  const validMock = joi.validate(res, schema, { allowUnknown: true }); // 模拟接口数据
  if (!validMock.error) {
    return res;
  }

  const result = templates.transferList(res, schema, transferFileds); // 真实接口数据
  const validReal = joi.validate(result, schema, { allowUnknown: true });
  if (!validReal.error) {
    return result;
  }

  /* eslint no-console: 0 */
  if (validMock.error) {
    console.error(validMock);
  } else if (validReal.error) {
    console.error(validReal);
  }

  return {
    list: [],
    pagination: {
      total: 0,
      pageSize: 20,
      current: 1,
    },
  };
};

export default {
  detail,
  list,
};
