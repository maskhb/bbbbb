import { login, logout } from '../services/login';
import user from '../services/user';
import { setAuthority } from '../utils/authority';
import cookie from '../utils/cookie';

export default {
  namespace: 'login',

  state: {
    status: [1],
    userInfo: JSON.parse(localStorage.getItem('user')),
  },

  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      if (response && response.msgCode === 200) {
        cookie.set('x-manager-token', response.data.result.token);
        window.localStorage.user = JSON.stringify(response.data?.result);
        // console.log(JSON.stringify(responslogoute));
        yield put({
          type: 'changeLoginStatus',
          payload: {
            ...response,
            userInfo: response.data?.result,
            currentAuthority: 'user',
          },
        });
        return response;
        // message.success('登录成功!');
        // window.location.reload();
      }
    },
    *logout({ payload }, { call, put, select }) {
      const { account } = localStorage;
      try {
        // 记录当前页面，再次登录后跳转回
        yield call(logout);
        // eslint-disable-next-line
        const urlParams = new URL(window.location.href);
        // const pathname = yield select(state => payload?.path || state.routing.location.pathname);
        // cookie.clear();
        // urlParams.searchParams.set('redirect', payload?.path || pathname);
        // window.history.replaceState(null, 'login', payload?.path || urlParams.href);

        cookie.clear();
        window.history.replaceState(null, 'login', payload?.path || urlParams.href);
      } finally {
        // 设置权限为空，刷新页面会经过鉴权操作，跳转到登录页面
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
          },
        });
        if (account) {
          localStorage.account = account;
        }
        window.location.reload();
      }
    },
    *getAccountAuthsByOrgId({ payload }, { call, put }) {
      const response = yield call(user.getAccountAuthsByOrgId, payload);
      yield put({
        type: 'save',
        payload: {
          AccountAuths: response,
        },
      });
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload?.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        userInfo: payload.userInfo,
      };
    },
  },
};
