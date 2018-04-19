import joi from 'joi';

const list = (item) => {
  return joi.object({
    list: joi.array().items(item).required(),
    pagination: {
      total: joi.number().required(),
      pageSize: joi.number().required(),
      current: joi.number().required(),
    },
  });
};

const transferList = (res, schema, transferFileds) => {
  const { result = {} } = res?.data || {};

  return {
    list: result.dataList?.map((item) => {
      const itemR = item;
      for (const { orgin, name } of transferFileds) {
        itemR[name] = item[orgin];
        delete itemR[orgin];
      }
      return itemR;
    }),
    pagination: {
      total: result.totalCount,
      pageSize: result.pageSize,
      current: result.currPage,
    },
  };
};

const transferDetail = (res, schema, transferFileds) => {
  const { result = {} } = res?.data || {};

  for (const { orgin, name } of transferFileds) {
    result[name] = result[orgin];
    delete result[orgin];
  }

  return {
    ...result,
  };
};

export default {
  list,
  transferList,
  transferDetail,
};
