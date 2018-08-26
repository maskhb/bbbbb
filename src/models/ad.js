import serviceAd from '../services/ad';

export default {
  namespace: 'ad',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(serviceAd.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(serviceAd.detail, payload);
      yield put({
        type: 'save',
        payload: {
          [`detail${payload.adItemId}`]: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(serviceAd.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(serviceAd.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(serviceAd.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *status({ payload }, { call, put }) {
      const response = yield call(serviceAd.status, payload);
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
