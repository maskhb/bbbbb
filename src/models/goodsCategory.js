import goodsCategory from '../services/goodsCategory';

export default {
  namespace: 'goodsCategory',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(goodsCategory.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.dataList,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(goodsCategory.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(goodsCategory.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(goodsCategory.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *exsit({ payload }, { call, put }) {
      const response = yield call(goodsCategory.exsit, payload);
      yield put({
        type: 'save',
        payload: {
          exsit: response,
        },
      });
    },
    *status({ payload }, { call, put }) {
      const response = yield call(goodsCategory.status, payload);
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
