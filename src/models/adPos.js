import serviceAdPos from '../services/adPos';

export default {
  namespace: 'adPos',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(serviceAdPos.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(serviceAdPos.detail, payload);
      yield put({
        type: 'save',
        payload: {
          [`detail${payload.posId}`]: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(serviceAdPos.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(serviceAdPos.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(serviceAdPos.remove, payload);
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
