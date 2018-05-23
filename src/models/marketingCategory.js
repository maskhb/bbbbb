import marketingCategory from '../services/marketingCategory';

export default {
  namespace: 'marketingCategory',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(marketingCategory.list, payload);
      // console.log('category', response);
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
