import { login } from '../services/login';
import { setAuthority } from '../utils/authority';
import cookie from '../utils/cookie';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response && response.msgCode === 200) {
        cookie.set('x-manager-token', response.data.result);

        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            currentAuthority: 'user',
          },
        });

        window.location.reload();
      }
    },
    *logout(_, { put, select }) {
      try {
        // 记录当前页面，再次登录后跳转回
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        // 设置权限为空，刷新页面会经过鉴权操作，跳转到登录页面
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
          },
        });
        window.location.reload();
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload?.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
