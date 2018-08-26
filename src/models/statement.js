import statement from '../services/statement';

export default {
  namespace: 'statement',

  state: {
  },

  effects: {

    *importInfo({ payload }, { call, put }) {
      const response = yield call(statement.importInfo, payload);
      yield put({
        type: 'save',
        payload: {
          importRes: response,
        },
      });
      return response;
    },

    *queryLogList({ payload }, { call, put }) {
      const response = yield call(statement.queryLogList, payload);
      yield put({
        type: 'save',
        payload: {
          queryLogListRes: response,
        },
      });
      return response;
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
