/**
 * Created by rebecca on 2018/4/3.
 */
import wallet from '../services/wallet';

export default {
  namespace: 'wallet',

  state: {
  },

  effects: {
    *wallet({ payload }, { call, put }) {
      const response = yield call(wallet.wallet, payload);
      yield put({
        type: 'save',
        payload: {
          wallet: response,
        },
      });
    },
    *rechargewallet({ payload }, { call, put }) {
      const response = yield call(wallet.rechargewallet, payload);
      yield put({
        type: 'save',
        payload: {
          rechargewallet: response,
        },
      });
    },
    *dealwallet({ payload }, { call, put }) {
      const response = yield call(wallet.dealwallet, payload);
      yield put({
        type: 'save',
        payload: {
          dealwallet: response,
        },
      });
    },
    *exportwallet({ payload }, { call, put }) {
      const response = yield call(wallet.exportwallet, payload);
      yield put({
        type: 'save',
        payload: {
          exportwallet: response,
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
