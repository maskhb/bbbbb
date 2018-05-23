import AUDITSTATUS from 'components/AuditStatus';
import common from '../services/common';
import global from '../services/global';
import goods from '../services/goods';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    communities: [],
  },

  effects: {
    *globalSettingDetail({ payload }, { call, put }) {
      const response = yield call(global.globalSettingDetail, payload);
      yield put({
        type: 'save',
        payload: {
          globalSettingDetail: response,
        },
      });
    },
    *globalSettingAdd({ payload }, { call, put }) {
      const response = yield call(global.globalSettingAdd, payload);
      yield put({
        type: 'save',
        payload: {
          globalSettingAdd: response,
        },
      });
    },
    *fetchNotices(_, { call, put }) {
      const pageInfo = {
        pageSize: 1,
        currPage: 1,
      };

      const response0 = yield call(goods.list, {
        auditStatus: [AUDITSTATUS.WAIT.value],
        pageInfo,
      });

      const response1 = yield call(goods.list, {
        auditStatus: [AUDITSTATUS.FAIL.value],
        pageInfo,
      });

      const goodsListAuditWaitTotal = response0?.pagination?.total || 0;
      const goodsListAuditFailTotal = response1?.pagination?.total || 0;

      yield put({
        type: 'saveNotices',
        payload: [
          goodsListAuditWaitTotal,
          goodsListAuditFailTotal,
        ],
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: goodsListAuditWaitTotal + goodsListAuditFailTotal,
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *communities({ payload }, { call, put }) {
      const response = yield call(common.getProvincesWithCommunities, payload);
      yield put({
        type: 'saveCommunities',
        payload: {
          communities: response,
        },
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveCommunities(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
