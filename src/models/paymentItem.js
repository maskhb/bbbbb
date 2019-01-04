/*
 * @Author: wuhao
 * @Date: 2018-09-25 09:47:34
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-25 14:45:05
 *
 * 收费类目设置 model
 */
import services from '../services/paymentItem';
import { transformObjectToTSModal } from '../utils/transform';
import PaginationList from '../viewmodels/interfaces/PaginationList';
import PaymentItemExtendVO from '../viewmodels/implements/PaymentItemExtendVO';
import PaymentItemQueryVO from '../viewmodels/implements/PaymentItemQueryVO';
import PaymentItemUpdateVO from '../viewmodels/implements/PaymentItemUpdateVO';

export default {
  namespace: 'paymentItem',

  state: {},

  effects: {
    *page({ payload }, { call, put }) {
      const params = transformObjectToTSModal(payload, new PaymentItemQueryVO());
      const response = yield call(services.page, params);

      const res = transformObjectToTSModal(
        response,
        new PaginationList(PaymentItemExtendVO),
      );

      yield put({
        type: 'save',
        payload: {
          page: res,
        },
      });

      return res;
    },

    *detailsByPaymentItemOrgId({ payload }, { call, put }) {
      const response = yield call(services.detailsByPaymentItemOrgId, payload);

      const res = transformObjectToTSModal(
        response,
        new PaginationList(PaymentItemExtendVO),
      );

      yield put({
        type: 'save',
        payload: {
          detailsByPaymentItemOrgId: res,
        },
      });

      return res;
    },

    *update({ payload }, { call }) {
      const params = transformObjectToTSModal(payload, new PaymentItemUpdateVO());
      const response = yield call(services.update, params);

      return response;
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
