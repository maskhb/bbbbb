import serviceGoodsCategory from '../services/goodsCategory';

export default {
  namespace: 'goodsCategory',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.list, payload);

      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
      return response;
    },
    *listByMerchantId({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.listByMerchantId, payload);

      yield put({
        type: 'save',
        payload: {
          [`list${payload.merchantId}`]: response,
        },
      });
      return response;
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.detail, payload);
      yield put({
        type: 'save',
        payload: {
          [`detail${payload.categoryId}`]: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *exsit({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.exsit, payload);
      yield put({
        type: 'save',
        payload: {
          exsit: response,
        },
      });
    },
    *status({ payload }, { call, put }) {
      const response = yield call(serviceGoodsCategory.status, payload);
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
