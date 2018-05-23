// 公用 api 请求
import request from '../utils/request';

async function getProvincesWithCommunities() {
  return request('/mj/ht-mj-cms-server/community/getAllComCommunity', { mock: false });
}
async function queryCommunityList(params) {
  return request('/json/community-api/community/base/listPage', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
async function queryRegionInfo(params) {
  return request('/json/region-api/region/getChildRegions', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 公共异步导出接口
 * @param {prefix:Number,dataUrl:String,param:String,page:Object} params
 *
 * prefix 业务码
 * dataUrl 业务方提供的Http Controller API接口
 * param 查询参数
 * page 分页参数
 *    {pageSize:Number,totalCount:Number}
 *    pageSize 每页记录数 一般每页不超过500条
 *    totalCount 估计总记录数
 */
async function startExportFile(params) {
  return request('/json/pub-export-api/export/startExportFile', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 查询所有商家列表
 * @param params
 * @returns {*}
 */
const queryMerchantList = (params) => {
  return request('/mj/ht-mj-merchant-server/merchantBase/queryListByMutilCondition', {
    method: 'POST',
    body: params,
  });
};

/**
 * 查询商品信息--订单
 * @param {*} param0
 */
async function orderGoodsListByPage({ goodsBaseVoList }) {
  return request('/mj/ht-mj-goods-server/goods/orderGoodsListByPage', {
    method: 'POST',
    body: {
      goodsBaseVoList,
    },
    pagination: true,
  });
}

/**
 * 查询支付方式--订单
 * @param {*} param0
 */
async function getPaymentMethodList({ type }) {
  return request('/mj/ht-mj-order-server/order/admin/getPaymentMethodList', {
    method: 'POST',
    body: {
      type,
    },
  });
}

export default {
  getProvincesWithCommunities,
  queryCommunityList,
  queryRegionInfo,

  startExportFile,
  queryMerchantList,
  orderGoodsListByPage,

  getPaymentMethodList,
};
