import service from '../services/jiajuCoupon';

export default {
  namespace: 'jiajuCoupon',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(service.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *logList({ payload }, { call, put }) {
      const response = yield call(service.log, payload);
      yield put({
        type: 'save',
        payload: {
          logList: response,
        },
      });
    },
    *sync({ payload }, { call, put }) {
      const response = yield call(service.sync, payload);
      yield put({
        type: 'save',
        payload: {
          sync: response,
        },
      });
      return response;
    },
    *approve({ payload }, { call, put }) {
      const response = yield call(service.approve, payload);
      yield put({
        type: 'save',
        payload: {
          approve: response,
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
