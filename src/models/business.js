import business from '../services/business';

export default {
  namespace: 'business',

  state: {
  },

  effects: {
    *querylist({ payload }, { call, put }) {
      const response = yield call(business.querylist, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *list({ payload }, { call, put }) {
      const response = yield call(business.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(business.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(business.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(business.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *exsit({ payload }, { call, put }) {
      const response = yield call(business.exsit, payload);
      yield put({
        type: 'save',
        payload: {
          exsit: response,
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
