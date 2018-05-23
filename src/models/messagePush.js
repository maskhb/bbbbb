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
    *rePush({ payload }, { call, put }) {
      const response = yield call(messagePush.rePush, payload);
      yield put({
        type: 'save',
        payload: {
          rePush: response,
        },
      });
    },
    *recordList({ payload }, { call, put }) {
      const response = yield call(messagePush.recordList, payload);
      yield put({
        type: 'save',
        payload: {
          recordList: response,
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
