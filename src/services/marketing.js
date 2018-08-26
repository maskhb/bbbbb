/*
 * @Author: nic
 * @Date: 2018-06-21 14:37:16
 * @Last Modified by: nic
 * @Last Modified time: 2018-07-21 17:48:27
 *
 * 促销工具接口
 */
import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/mj/ht-mj-promotion-server';
  return requestBase(baseUrl + url, params);
}

/**
 * 查询优惠券列表
 * @param {*} promotionCouponVoPage 查询条件
 */
async function couponList(promotionCouponVoPage) {
  return request('/promotionCoupon/queryListByPage', {
    method: 'POST',
    body: {
      promotionCouponVoPage,
    },
    pagination: true,
  });
}

/**
 * 查询优惠券基本信息
 * @param {*} couponId
 */
async function couponDetail({ couponId }) {
  return request('/promotionCoupon/queryDetail', {
    method: 'POST',
    query: {
      couponId,
    },
  });
}

/**
 * 新增优惠券
 * @param {*} promotionCouponVoS
 */
async function couponSave(promotionCouponVoS) {
  return request('/promotionCoupon/save', {
    method: 'POST',
    body: {
      promotionCouponVoS,
    },
    pagination: true,
  });
}

/**
 * 编辑优惠券
 * @param {String} promotionCouponVoU 换货单编号
 */
async function couponUpdate(promotionCouponVoU) {
  return request('/promotionCoupon/update', {
    method: 'POST',
    body: {
      promotionCouponVoU,
    },
  });
}

/**
 * 更新优惠券状态
 * @param {String} couponId,status,isDelete 状态参数
 */
async function couponStatus({ couponId, status, isDelete }) {
  return request('/promotionCoupon/updateStatus', {
    method: 'POST',
    body: {
      couponId,
      status,
      isDelete,
    },
  });
}


/**
 * 更新优惠券状态
 * @param {String} couponId,status,isDelete 状态参数
 */
async function couponCodeStatus({ codeId, status }) {
  return request('/promotionCouponCode/updateStatus', {
    method: 'POST',
    body: {
      codeId,
      status,
    },
  });
}

/**
 * 查询我的优惠券总数
 * @param {String} promotionCouponCodeVoQ 退款单编号
 */
async function countMyCoupon(promotionCouponCodeVoQ) {
  return request('/promotionCouponCode/queryCountMyCoupon', {
    method: 'POST',
    body: {
      promotionCouponCodeVoQ,
    },
    pagination: true,
  });
}


/**
 * 查询优惠券码 线上和人工派发不预先生成、线下的预先生成详情接口
 * @param {String} codeId 售后申请单编号
 */
async function queryDetailFeign({ codeId }) {
  return request('/promotionCouponCode/queryDetailFeign', {
    method: 'POST',
    body: {
      codeId,
    },
  });
}

/**
 * 分页获取优惠券码 线上和人工派发不预先生成、线下的预先生成接口
 * @param {Number} promotionCouponCodeVoQPage
 */
async function couponCodeList(promotionCouponCodeVoQPage) {
  return request('/promotionCouponCode/queryListByPage', {
    method: 'POST',
    body: {
      promotionCouponCodeVoQPage,
    },
    pagination: true,
  });
}


/**
 * 批量新增优惠券码
 */
async function couponSaveList({ phones, couponId }) {
  return request('/promotionCouponCode/saveList', {
    method: 'POST',
    body: {
      phones,
      couponId,
    },
  });
}

/**
 * 操作日志列表
 */
async function couponLogList(readParamLogPageVo) {
  return requestBase('/mj/ht-mj-log-server/readoperationlogpage', {
    method: 'POST',
    body: {
      readParamLogPageVo,
    },
    pagination: true,
  });
}

/**
 * 分页查批量导入日志列表
 */
async function couponBatchLogList(importLogPageVo) {
  return requestBase('/mj/ht-mj-log-server/readImportLogPage', {
    method: 'POST',
    body: {
      importLogPageVo,
    },
    pagination: true,
  });
}

/**
 * 根据ID或商家名称查商家
 */
async function queryMerchant(params) {
  return requestBase('/mj/ht-mj-merchant-server/merchantBase/queryList', {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

/**
 * 查询优惠券数量状态
 */
async function couponCount({ couponId }) {
  return request('/promotionCouponCode/queryCodeCount', {
    method: 'POST',
    body: {
      couponId,
    },
  });
}


export default {
  couponList,
  couponDetail,
  couponSave,
  couponUpdate,
  couponStatus,
  countMyCoupon,
  queryDetailFeign,
  couponCodeList,
  couponSaveList,
  couponCodeStatus,
  couponLogList,
  queryMerchant,
  couponBatchLogList,
  couponCount,
};
