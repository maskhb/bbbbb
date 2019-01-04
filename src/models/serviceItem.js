import { page, updateStatus, deleteItem, saveItem, update, updateStock, stockLogPage } from 'services/serviceItem';

export default {
  namespace: 'serviceItem',

  state: {},

  effects: {
    *page({ payload }, { call, put }) {
      const response = yield call(page, payload);

      yield put({
        type: 'save',
        payload: {
          serviceItemPage: response,
        },
      });
    },

    *stockLogPage({ payload }, { call, put }) {
      const response = yield call(stockLogPage, payload);

      yield put({
        type: 'save',
        payload: {
          stockLogPage: response,
        },
      });
    },

    *deleteItem({ payload }, { call }) {
      return yield call(deleteItem, payload);
    },

    *saveItem({ payload }, { call }) {
      return yield call(saveItem, payload);
    },

    *update({ payload }, { call }) {
      return yield call(update, payload);
    },

    *updateStatus({ payload }, { call }) {
      return yield call(updateStatus, payload);
    },

    *updateStock({ payload }, { call }) {
      return yield call(updateStock, payload);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

