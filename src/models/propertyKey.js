import keys from '../services/propertyKey';

export default {
  namespace: 'propertyKey',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(keys.list, payload);
      yield put({
        type: 'save',
        payload: {
          [payload.propertyGroupId]: { ...response },
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(keys.detail, payload);
      yield put({
        type: 'save',
        payload: {
          [`detail${payload.id}`]: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(keys.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
      return response;
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(keys.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
      return response;
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(keys.remove, payload);
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
