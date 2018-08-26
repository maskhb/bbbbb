import space from '../services/space';
import goodsCategory from '../services/goodsCategory';

export default {
  namespace: 'space',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(space.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *listByCategoryId({ payload }, { call, put }) {
      const response = yield call(space.listByCategoryId, payload);
      yield put({
        type: 'save',
        payload: {
          listByCategoryId: response,
        },
      });
    },
    *enable({ payload }, { call, put }) {
      const response = yield call(space.enable, payload);
      yield put({
        type: 'save',
        payload: {
          enable: response,
        },
      });
    },
    *disable({ payload }, { call, put }) {
      const response = yield call(space.disable, payload);
      yield put({
        type: 'save',
        payload: {
          disable: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(space.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *queryFirstCategory({ payload }, { call, put }) {
      const response = yield call(goodsCategory.listHasChild, payload);
      yield put({
        type: 'save',
        payload: {
          categoryList: response,
        },
      });
    },
    *link({ payload }, { call, put }) {
      const response = yield call(space.link, payload);
      yield put({
        type: 'save',
        payload: {
          link: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(space.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(space.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(space.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
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
