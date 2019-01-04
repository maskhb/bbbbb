/*
 * @Author: wuhao
 * @Date: 2018-09-25 09:46:56
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-25 14:44:50
 *
 * 收款方式设置 model
 */
import services from '../services/paymentMethod';
import { transformObjectToTSModal } from '../utils/transform';
import PaginationList from '../viewmodels/interfaces/PaginationList';
import PaymentMethodQueryVO from '../viewmodels/implements/PaymentMethodQueryVO';
import PaymentMethodExtendVO from '../viewmodels/implements/PaymentMethodExtendVO';
import PaymentMethodUpdateVO from '../viewmodels/implements/PaymentMethodUpdateVO';


export default {
  namespace: 'paymentMethod',

  state: {},

  effects: {
    *page({ payload }, { call, put }) {
      const params = transformObjectToTSModal(payload, new PaymentMethodQueryVO());
      const response = yield call(services.page, params);

      const res = transformObjectToTSModal(
        response,
        new PaginationList(PaymentMethodExtendVO),
      );

      yield put({
        type: 'save',
        payload: {
          page: res,
        },
      });

      return res;
    },

    *detailsByPaymentMethodOrgId({ payload }, { call, put }) {
      const response = yield call(services.detailsByPaymentMethodOrgId, payload);

      const res = transformObjectToTSModal(
        response,
        new PaginationList(PaymentMethodExtendVO),
      );

      yield put({
        type: 'save',
        payload: {
          detailsByPaymentMethodOrgId: res,
        },
      });

      return res;
    },

    *update({ payload }, { call }) {
      const params = transformObjectToTSModal(payload, new PaymentMethodUpdateVO());
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
