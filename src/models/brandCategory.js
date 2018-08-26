import serviceBrandCategory from '../services/brandCategory';

export default {
  namespace: 'brandCategory',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(serviceBrandCategory.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(serviceBrandCategory.detail, payload);
      yield put({
        type: 'save',
        payload: {
          [`detail${payload.id}`]: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(serviceBrandCategory.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(serviceBrandCategory.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(serviceBrandCategory.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *exsit({ payload }, { call, put }) {
      const response = yield call(serviceBrandCategory.exsit, payload);
      yield put({
        type: 'save',
        payload: {
          exsit: response,
        },
      });
    },
    *status({ payload }, { call, put }) {
      const response = yield call(serviceBrandCategory.status, payload);
      yield put({
        type: 'save',
        payload: {
          status: response,
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
