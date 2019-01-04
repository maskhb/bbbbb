// import common from '../services/common';
// import global from '../services/global';

import global from '../services/global';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    communities: [],
  },

  effects: {
    * homeInfo({ payload }, { call, put }) {
      const response = yield call(global.homeInfo, payload);
      yield put({
        type: 'save',
        payload: {
          homeInfo: response,
        },
      });
    },
    *businessTime({ payload }, { call, put }) {
      const response = yield call(global.getBusinessTime, payload);
      yield put({
        type: 'save',
        payload: {
          businessTime: response,
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
