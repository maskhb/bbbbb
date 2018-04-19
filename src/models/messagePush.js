import messagePush from '../services/messagePush';

export default {
  namespace: 'messagePush',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(messagePush.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(messagePush.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(messagePush.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(messagePush.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(messagePush.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *audit({ payload }, { call, put }) {
      const response = yield call(messagePush.audit, payload);
      yield put({
        type: 'save',
        payload: {
          audit: response,
        },
      });
    },
    *unit({ payload }, { call, put }) {
      const response = yield call(messagePush.unit, payload);
      yield put({
        type: 'save',
        payload: {
          unit: response,
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
