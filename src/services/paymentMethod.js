/*
 * @Author: wuhao
 * @Date: 2018-09-25 09:30:59
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-25 14:45:52
 *
 * 收款方式设置 接口
 */
import requestBase from '../utils/request';


function request(url, params) {
  const baseUrl = '/fc/ht-fc-pms-server/paymentMethod/';
  return requestBase(baseUrl + url, params);
}

/**
 * 根据收款方式组织关联id查询收款方式详情
 * @param {Number} paymentMethodOrgId
 */
async function detailsByPaymentMethodOrgId({ paymentMethodOrgId }) {
  return request('detailsByPaymentMethodOrgId', {
    body: {
      paymentMethodOrgId,
    },
  });
}

/**
 * 分页查询收款方式列表
 * @param {*} paymentMethodQueryVO
 */
async function page(paymentMethodQueryVO) {
  return request('page', {
    body: {
      paymentMethodQueryVO,
    },
    pagination: true,
  });
}

/**
 * 根据条件更新收款方式
 * @param {*} paymentMethodUpdateVO
 */
async function update(paymentMethodUpdateVO) {
  return request('update', {
    body: {
      paymentMethodUpdateVO,
    },
  });
}

export default {
  detailsByPaymentMethodOrgId,
  page,
  update,
};
