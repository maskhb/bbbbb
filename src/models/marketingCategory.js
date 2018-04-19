import marketingCategory from '../services/marketingCategory';

export default {
  namespace: 'marketingCategory',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(marketingCategory.list, payload);
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
