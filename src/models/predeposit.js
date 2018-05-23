/**
 * Created by rebecca on 2018/4/3.
 */
import predeposit from '../services/predeposit';

export default {
  namespace: 'predeposit',

  state: {
  },

  effects: {
    *predepositList({ payload }, { call, put }) {
      const response = yield call(predeposit.predepositList, payload);
      yield put({
        type: 'save',
        payload: {
          predepositList: response,
        },
      });
    },
    *rechargepredeposit({ payload }, { call, put }) {
      const response = yield call(predeposit.rechargepredeposit, payload);
      yield put({
        type: 'save',
        payload: {
          rechargepredeposit: response,
        },
      });
    },
    *validpredeposit({ payload }, { call, put }) {
      const response = yield call(predeposit.validpredeposit, payload);
      yield put({
        type: 'save',
        payload: {
          validpredeposit: response,
        },
      });
    },
    *dealpredeposit({ payload }, { call, put }) {
      const response = yield call(predeposit.dealpredeposit, payload);
      yield put({
        type: 'save',
        payload: {
          dealpredeposit: response,
        },
      });
    },
    *exportpredeposit({ payload }, { call, put }) {
      const response = yield call(predeposit.exportpredeposit, payload);
      yield put({
        type: 'save',
        payload: {
          exportpredeposit: response,
        },
      });
    },
    *predepositlogsbypage({ payload }, { call, put }) {
      const response = yield call(predeposit.predepositlogsbypage, payload);
      yield put({
        type: 'save',
        payload: {
          predepositlogsbypage: response,
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
