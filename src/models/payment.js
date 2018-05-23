/**
 * Created by rebecca on 2018/4/3.
 */
import payment from '../services/payment';

export default {
  namespace: 'payment',

  state: {
  },

  effects: {
    *hislist({ payload }, { call, put }) {
      const response = yield call(payment.searchPayOrderHis, payload);
      yield put({
        type: 'save',
        payload: {
          hislist: response,
        },
      });
    },
    *exportPayOrderHis({ payload }, { call, put }) {
      const response = yield call(payment.exportPayOrderHis, payload);
      yield put({
        type: 'save',
        payload: {
          exportPayOrderHis: response,
        },
      });
    },
    *saveManualTransaction({ payload }, { call, put }) {
      const response = yield call(payment.saveManualTransaction, payload);
      yield put({
        type: 'save',
        payload: {
          saveManualTransaction: response,
        },
      });
    },
    *searchTransactionManualLogList({ payload }, { call, put }) {
      const response = yield call(payment.searchTransactionManualLogList, payload);
      yield put({
        type: 'save',
        payload: {
          searchTransactionManualLogList: response,
        },
      });
    },
    *infolist({ payload }, { call, put }) {
      const response = yield call(payment.searchPayTypeAndInfoList, payload);
      yield put({
        type: 'save',
        payload: {
          searchPayTypeAndInfoList: response,
        },
      });
    },
    *modifyPayTypeAndInfo({ payload }, { call, put }) {
      const response = yield call(payment.modifyPayTypeAndInfo, payload);
      yield put({
        type: 'save',
        payload: {
          modifyPayTypeAndInfo: response,
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
