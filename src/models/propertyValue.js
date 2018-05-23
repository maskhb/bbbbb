import values from '../services/propertyValue';

export default {
  namespace: 'propertyValue',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(values.list, payload);
      yield put({
        type: 'save',
        payload: {
          ...response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(values.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(values.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
      return response;
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(values.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
      return response;
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(values.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
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
