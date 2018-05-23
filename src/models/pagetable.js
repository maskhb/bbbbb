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
          tablist: response,
        },
      });
    },
    *tabsave({ payload }, { call, put }) {
      const response = yield call(pagetable.tabsave, payload);
      yield put({
        type: 'save',
        payload: {
          tabsave: response,
        },
      });
    },
    *tabdefault({ payload }, { call, put }) {
      const response = yield call(pagetable.tabdefault, payload);
      yield put({
        type: 'save',
        payload: {
          tabdefault: response,
        },
      });
    },
    *tabupdate({ payload }, { call, put }) {
      const response = yield call(pagetable.tabupdate, payload);
      yield put({
        type: 'save',
        payload: {
          tabupdate: response,
        },
      });
    },
    *tabdelete({ payload }, { call, put }) {
      const response = yield call(pagetable.tabdelete, payload);
      yield put({
        type: 'save',
        payload: {
          tabdelete: response,
        },
      });
    },
    *commonlist({ payload }, { call, put }) {
      const response = yield call(pagetable.commonlist, payload);
      yield put({
        type: 'save',
        payload: {
          commonlist: response,
        },
      });
    },
    *commonsave({ payload }, { call, put }) {
      const response = yield call(pagetable.commonsave, payload);
      yield put({
        type: 'save',
        payload: {
          commonsave: response,
        },
      });
    },
    *commonupdate({ payload }, { call, put }) {
      const response = yield call(pagetable.commonupdate, payload);
      yield put({
        type: 'save',
        payload: {
          commonupdate: response,
        },
      });
    },
    *commondelete({ payload }, { call, put }) {
      const response = yield call(pagetable.commondelete, payload);
      yield put({
        type: 'save',
        payload: {
          commondelete: response,
        },
      });
    },
    *homegettitle({ payload }, { call, put }) {
      const response = yield call(pagetable.homegettitle, payload);
      yield put({
        type: 'save',
        payload: {
          homegettitle: response,
        },
      });
    },
    *homeupdatetitle({ payload }, { call, put }) {
      const response = yield call(pagetable.homeupdatetitle, payload);
      yield put({
        type: 'save',
        payload: {
          homeupdatetitle: response,
        },
      });
    },
    *mallpagetitle({ payload }, { call, put }) {
      const response = yield call(pagetable.mallpagetitle, payload);
      yield put({
        type: 'save',
        payload: {
          mallpagetitle: response,
        },
      });
    },
    *mallupdatetitle({ payload }, { call, put }) {
      const response = yield call(pagetable.mallupdatetitle, payload);
      yield put({
        type: 'save',
        payload: {
          mallupdatetitle: response,
        },
      });
    },
    *mallNavList({ payload }, { call, put }) {
      const response = yield call(pagetable.mallNavList, payload);
      yield put({
        type: 'save',
        payload: {
          mallNavList: response,
        },
      });
    },
    *mallsaveNav({ payload }, { call, put }) {
      const response = yield call(pagetable.mallsaveNav, payload);
      yield put({
        type: 'save',
        payload: {
          mallsaveNav: response,
        },
      });
    },
    *mallupdateNav({ payload }, { call, put }) {
      const response = yield call(pagetable.mallupdateNav, payload);
      yield put({
        type: 'save',
        payload: {
          mallupdateNav: response,
        },
      });
    },
    *malldeleteNav({ payload }, { call, put }) {
      const response = yield call(pagetable.malldeleteNav, payload);
      yield put({
        type: 'save',
        payload: {
          malldeleteNav: response,
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
