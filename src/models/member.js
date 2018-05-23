import member from '../services/member';

export default {
  namespace: 'member',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const list = yield call(member.list, payload);
      yield put({
        type: 'save',
        payload: {
          list,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(member.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response,
        },
      });
    },
    *log({ payload }, { call, put }) {
      const log = yield call(member.log, payload);
      yield put({
        type: 'save',
        payload: {
          log,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(member.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(member.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *state({ payload }, { call, put }) {
      const response = yield call(member.state, payload);
      yield put({
        type: 'save',
        payload: {
          state: response,
        },
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(member.update, payload);
      yield put({
        type: 'save',
        payload: {
          update: response,
        },
      });
    },
    *downloadTem({ payload }, { call, put }) {
      const response = yield call(member.downloadTem, payload);
      yield put({
        type: 'save',
        payload: {
          downloadTem: response,
        },
      });
    },
    *exportTem({ payload }, { call, put }) {
      const response = yield call(member.exportTem, payload);
      yield put({
        type: 'save',
        payload: {
          exportTem: response,
        },
      });
    },
    *importTem({ payload }, { call, put }) {
      const response = yield call(member.importTem, payload);
      yield put({
        type: 'save',
        payload: {
          importTem: response,
        },
      });
    },
    *cart({ payload }, { call, put }) {
      const response = yield call(member.cart, payload);
      yield put({
        type: 'save',
        payload: {
          cart: response,
        },
      });
    },
    *address({ payload }, { call, put }) {
      const response = yield call(member.address, payload);
      yield put({
        type: 'save',
        payload: {
          address: response,
        },
      });
    },
    *password({ payload }, { call, put }) {
      const response = yield call(member.password, payload);
      yield put({
        type: 'save',
        payload: {
          password: response,
        },
      });
    },
    *accountDetail({ payload }, { call, put }) {
      const response = yield call(member.accountDetail, payload);
      yield put({
        type: 'save',
        payload: {
          accountDetail: response,
        },
      });
    },
    *latestAddress({ payload }, { call, put }) {
      const response = yield call(member.latestAddress, payload);
      yield put({
        type: 'save',
        payload: {
          latestAddress: response,
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
