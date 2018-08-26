import request from '../utils/request';

async function list(params) {
  return request('/mj/ht-mj-goods-server/goods/queryListByPage', {
    method: 'POST',
    body: {
      goodsBaseVoList: {
        ...params,
      },
    },
    pagination: true,
  });
}
async function recoveryList(params) {
  return request('/mj/ht-mj-goods-server/goods/queryRecoveryListByPage', {
    method: 'POST',
    body: {
      goodsBaseVoList: {
        ...params,
      },
    },
    pagination: true,
  });
}

async function detail(params) {
  return request('/mj/ht-mj-goods-server/goods/queryDetail', {
    method: 'POST',
    body: {
      goodsBaseVo: {
        ...params,
      },
    },
  });
}

async function add(params) {
  return request('/mj/ht-mj-goods-server/goods/save', {
    method: 'POST',
    body: {
      goodsVo: {
        ...params,
      },
    },
  });
}

async function edit(params) {
  return request('/mj/ht-mj-goods-server/goods/update', {
    method: 'POST',
    body: {
      goodsVo: {
        ...params,
      },
    },
  });
}

async function remove(params) {
  return request('/mj/ht-mj-goods-server/goods/delete', {
    method: 'POST',
    body: {
      goodsBaseVo: {
        ...params,
      },
    },
  });
}

async function audit(params) {
  return request('/mj/ht-mj-goods-server/goods/updateAuditStatus', {
    method: 'POST',
    body: {
      goodsAuditStatusVo: {
        ...params,
      },
    },
  });
}

async function online(params) {
  return request('/mj/ht-mj-goods-server/goods/updateStatus', {
    method: 'POST',
    body: {
      GoodsStatusVo: {
        ...params,
      },
    },
  });
}

async function copy(params) {
  return request('/mj/ht-mj-goods-server/goods/copy', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

async function auditStatusList(params) {
  return request('/mj/ht-mj-goods-server/goods/queryAuditStatusListByPage', {
    method: 'POST',
    body: {
      ...params },
  });
}

/**
 * 查询商品信息--订单
 * @param {*} param0
 */
async function orderGoodsList({ skuIds }) {
  return request('/mj/ht-mj-goods-server/goods/orderGoodsList', {
    method: 'POST',
    body: {
      skuIds,
    },
  });
}

// 商品操作日志
async function queryLog(params) {
  return request('/mj/ht-mj-goods-server/goods/queryLogByPage', {
    method: 'POST',
    body: {
      readParamLogPageVo: {
        ...params,
      },
    },
    pagination: true,
  });
}

// 计算导出数据总数
async function queryCount(params) {
  return request('/mj/ht-mj-goods-server/exportTemplate/goods/queryCount', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/* 批量回收/还原-后台(批量) */
async function recovery(params) {
  return request('/mj/ht-mj-goods-server/goods/recoveryBatch', {
    method: 'POST',
    body: {
      GoodsRecoveryVo: {
        ...params,
      },
    },
  });
}
/* 删除商品-后台(批量) */
async function removeBatch(params) {
  return request('/mj/ht-mj-goods-server/goods/deleteBatch', {
    method: 'POST',
    body: {
      goodsIds: params,
    },
  });
}

export default {
  list,
  detail,
  add,
  edit,
  remove,
  audit,
  online,
  copy,
  auditStatusList,
  orderGoodsList,
  queryLog,
  queryCount,
  recovery,
  removeBatch,
  recoveryList,
};
