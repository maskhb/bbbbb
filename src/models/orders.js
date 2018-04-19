/*
 * @Author: wuhao
 * @Date: 2018-04-04 14:32:37
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-04 14:33:08
 *
 * 订单Modle
 */

import orders from '../services/orders';

export default {
  namespace: 'orders',
  state: {},
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(orders.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
