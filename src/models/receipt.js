/*
 * @Author: jone
 * @Date: 2018-7-8
 *
 * 收据接口类
 */
import Service from '../services/receipt';

export default {
  namespace: 'receipt',

  state: {
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const response = yield call(Service.queryList, payload);
      yield put({
        type: 'save',
        payload: {
          queryList: response,
        },
      });
    },
    *queryPrintList({ payload }, { call, put }) {
      const response = yield call(Service.queryPrintList, payload);
      yield put({
        type: 'save',
        payload: {
          queryPrintList: response,
        },
      });
    },
    *queryDetail({ payload }, { call, put }) {
      const response = yield call(Service.queryDetail, payload);
      yield put({
        type: 'save',
        payload: {
          queryDetail: response,
        },
      });
    },
    *saveReceipt({ payload }, { call, put }) {
      const response = yield call(Service.saveReceipt, payload);
      yield put({
        type: 'save',
        payload: {
          saveReceipt: response,
        },
      });
    },
    *updateStatus({ payload }, { call, put }) {
      const response = yield call(Service.updateStatus, payload);
      yield put({
        type: 'save',
        payload: {
          updateStatus: response,
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
