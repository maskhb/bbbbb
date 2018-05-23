import garden from '../services/garden';
import commonService from '../services/common';

export default {
  namespace: 'garden',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(commonService.queryCommunityList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *merchantCategoryList({ payload }, { call, put }) {
      const response = yield call(garden.merchantCategoryList, payload);
      yield put({
        type: 'save',
        payload: {
          merchantCategoryList: response,
        },
      });
    },
    *merchantList({ payload }, { call, put }) {
      const response = yield call(garden.merchantList, payload);
      yield put({
        type: 'save',
        payload: {
          merchantList: response,
        },
      });
    },
    *merchantCategoryOrder({ payload }, { call, put }) {
      const response = yield call(garden.merchantCategoryOrder, payload);
      yield put({
        type: 'save',
        payload: {
          merchantCategoryOrder: response,
        },
      });
    },
    *merchantOrder({ payload }, { call, put }) {
      const response = yield call(garden.merchantOrder, payload);
      yield put({
        type: 'save',
        payload: {
          merchantOrder: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(garden.add, payload);
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
