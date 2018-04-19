/**
 * Created by rebecca on 2018/4/3.
 */
import payment from '../services/predeposit';

export default {
  namespace: 'predeposit',

  state: {
  },

  effects: {
    *getlist({ payload }, { call, put }) {
      const response = yield call(payment.predepositList, payload);
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
