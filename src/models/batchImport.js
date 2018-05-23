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
    *exportFile({ payload }, { call, put }) {
      const response = yield call(batchImport.exportFile, payload);
      yield put({
        type: 'save',
        payload: {
          exportFile: response,
        },
      });
    },
    *exportList({ payload }, { call, put }) {
      const response = yield call(batchImport.exportList, payload);
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
