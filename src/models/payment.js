/**
 * Created by rebecca on 2018/4/3.
 */
import payment from '../services/payment';

export default {
  namespace: 'payment',

  state: {
  },

  effects: {
    *gethislist({ payload }, { call, put }) {
      const response = yield call(payment.searchPayOrderHis, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *getlist({ payload }, { call, put }) {
      const response = yield call(payment.searchPayTypeAndInfoList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *modifyInfo({ payload }, { call, put }) {
      const response = yield call(payment.modifyPayTypeAndInfo, payload);
      yield put({
        type: 'save',
        payload: {
          save: response,
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
