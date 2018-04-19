/**
 * Created by rebecca on 2018/4/3.
 */
import pagetable from '../services/pagetable';

export default {
  namespace: 'pagetable',

  state: {
  },

  effects: {
    *tablist({ payload }, { call, put }) {
      const response = yield call(pagetable.tablist, payload);
      yield put({
        type: 'save',
        payload: {
          list: response.data.result,
        },
      });
    },
    *tabsave({ payload }, { call, put }) {
      const response = yield call(pagetable.tabsave, payload);
      yield put({
        type: 'save',
        payload: {
          save: response,
        },
      });
    },
    *tabdefault({ payload }, { call, put }) {
      const response = yield call(pagetable.tabdefault, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *tabupdate({ payload }, { call, put }) {
      const response = yield call(pagetable.tabupdate, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *tabdelete({ payload }, { call, put }) {
      const response = yield call(pagetable.tabdelete, payload);
      yield put({
        type: 'save',
        payload: {
          deleteStatus: response,
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
