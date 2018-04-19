import model from '../services/model';

export default {
  namespace: 'model',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(model.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(model.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(model.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(model.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(model.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(model.update, payload);
      yield put({
        type: 'save',
        payload: {
          update: response,
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
