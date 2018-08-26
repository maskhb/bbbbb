import service from 'services/goodsCategoryBrand';

export default {
  namespace: 'goodsCategoryBrand',
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
    *listOnlyBond({ payload }, { call, put }) {
      const response = yield call(service.listOnlyBond, payload);

      yield put({
        type: 'save',
        payload: {
          listOnlyBond: response,
        },
      });
      return response;
    },
    *listAndBond({ payload }, { call, put }) {
      const response = yield call(service.listAndBond, payload);

      yield put({
        type: 'save',
        payload: {
          listAndBond: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(service.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(service.remove, payload);
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
