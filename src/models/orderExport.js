import model from '../services/orderExport';

export default {
  namespace: 'orderExport',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(model.list, payload);
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
