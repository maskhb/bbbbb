import groups from '../services/propertyGroup';

export default {
  namespace: 'propertyGroup',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(groups.list, payload);
      yield put({
        type: 'save',
        payload: {
          ...response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(groups.detail, payload);
      yield put({
        type: 'save',
        payload: {
          [`detail${payload.id}`]: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(groups.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(groups.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(groups.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
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
