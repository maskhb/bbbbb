import batchImport from '../services/batchImport';

export default {
  namespace: 'batchImport',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(batchImport.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *exportList({ payload }, { call, put }) {
      const response = yield call(batchImport.list, payload);
      yield put({
        type: 'save',
        payload: {
          exportList: response,
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
