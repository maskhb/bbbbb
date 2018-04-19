import garden from '../services/garden';

export default {
  namespace: 'garden',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(garden.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(garden.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(garden.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(garden.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(garden.update, payload);
      yield put({
        type: 'save',
        payload: {
          update: response,
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
