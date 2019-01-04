/*
 * @Author: wuhao
 * @Date: 2018-09-25 09:30:46
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-25 16:31:45
 *
 * 收费类目设置 接口
 */
import requestBase from '../utils/request';

function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server/paymentItem/';
  return requestBase(baseUrl + url, params);
}

/**
 * 根据收费类目项目关联ID查询详情
 * @param {Number} paymentItemOrgId
 */
async function detailsByPaymentItemOrgId({ paymentItemOrgId }) {
  return request('detailsByPaymentItemOrgId', {
    body: {
      paymentItemOrgId,
    },
  });
}

/**
 * 分页查询收费类目列表
 * @param {*} paymentItemQueryVO
 */
async function page(paymentItemQueryVO) {
  return request('page', {
    body: {
      paymentItemQueryVO,
    },
    pagination: true,
  });
}

/**
 * 根据条件更新收费类目
 * @param {*} paymentItemUpdateVO
 */
async function update(paymentItemUpdateVO) {
  return request('update', {
    body: {
      paymentItemUpdateVO,
    },
  });
}

export default {
  detailsByPaymentItemOrgId,
  page,
  update,
};
