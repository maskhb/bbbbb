import user from '../services/user';

export default {
  namespace: 'user',

  state: {
    current: {},
  },

  effects: {
    *current(_, { call, put }) {
      const response = yield call(user.current);
      yield put({
        type: 'save',
        payload: {
          current: response,
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
