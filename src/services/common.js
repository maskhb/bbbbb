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

const caches = {};
async function queryRegionInfo(params) {
  const { regionId } = params;
  if (caches[regionId]) {
    return new Promise(((resolve) => {
      resolve(caches[regionId]);
    }));
  }
  return request('/json/region-api/region/getChildRegions', {
    method: 'POST',
    body: {
      ...params,
    },
  }).then((data) => {
    caches[regionId] = data;
    return data;
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

/**
 * 查询促销商品信息(分页)
 * @param {*} param0
 */
async function queryPromotionGoodsByPage(GoodsPromotionVo) {
  return request('/mj/ht-mj-goods-server/goods/queryPromotionGoodsByPage', {
    method: 'POST',
    body: {
      GoodsPromotionVo,
    },
  });
}

/**
 * 商品分类列表
 * @param {*} param0
 */
async function goodsSaleCategoryList({ parentId }) {
  return request('/mj/ht-mj-goods-server/goodsCategory/queryList', {
    method: 'POST',
    body: {
      goodsCategoryVoQ: {
        parentId,
      },
    },
  });
}

/**
 * 根据merchantId查商品分类列表
 * @param {*} param0
 */
async function goodsCategoryListByMerchantId({ merchantId }) {
  return request('/mj/ht-mj-goods-server/goodsCategory/queryListAndHasChildByMerchantId', {
    method: 'POST',
    body: {
      merchantId,
    },
  });
}

export default {
  getProvincesWithCommunities,
  queryCommunityList,
  queryRegionInfo,
  goodsSaleCategoryList,
  startExportFile,
  queryMerchantList,
  orderGoodsListByPage,
  queryPromotionGoodsByPage,
  getPaymentMethodList,
  goodsCategoryListByMerchantId,
};
