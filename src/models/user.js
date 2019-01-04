import user from '../services/user';

export default {
  namespace: 'user',

  state: {
    current: JSON.parse(localStorage.getItem('user') || '{}'),
  },

  effects: {
    *current(_, { call, put }) {
      const response = yield call(user.current);
      yield put({
        type: 'save',
        payload: {
          current: {
            ...response,
            name: response?.loginName || '账号信息',
          },
        },
      });
    },
    // ////////////////////////////////
    *editUserPassword({ payload }, { call, put }) {
      const response = yield call(user.editUserPassword, payload);
      yield put({
        type: 'save',
        payload: {
          editUserPassword: response,
        },
      });
    },
    // ////////////////////////////////

    // /accountInfo/getAccountAuthsByOrgId 获取账户在某组织下的权限列表
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
    // /accountInfo/getAccountLoginSelectedOrg 获取账户登陆后所选的组织
    *getAccountLoginSelectedOrg({ payload }, { call, put }) {
      const response = yield call(user.getAccountLoginSelectedOrg, payload);
      yield put({
        type: 'save',
        payload: {

          AccountLoginSelected: response,
        },
      });
      return response;
    },
    // / accountInfo / queryAccountsByOrg 查询绑定于某组织下的账号列表
    *queryAccountsByOrg({ payload }, { call, put }) {
      const response = yield call(user.queryAccountsByOrg, payload);
      yield put({
        type: 'save',
        payload: {
          Accounts: response,
        },
      });
      return response;
    },
    // /accountInfo/updateAccountLoginOrgId 登陆账号切换自己的组织ID
    *updateAccountLoginOrgId({ payload }, { call }) {
      return yield call(user.updateAccountLoginOrgId, payload);
    },


    //  以树的形式展示当前账号的关联组织列表 /accountInfo/getAccountOrgsInTree
    *getAccountOrgsInTree({ payload }, { call, put }) {
      const response = yield call(user.getAccountOrgsInTree, payload);
      yield put({
        type: 'save',
        payload: {
          AccountOrgsInTree: response,
        },
      });
      return response;
    },
    // 获取账户在某组织下的角色列表
    *getAccountRolesByOrgId({ payload }, { call, put }) {
      const response = yield call(user.getAccountRolesByOrgId, payload);
      yield put({
        type: 'save',
        payload: {
          AccountRoles: response,
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
    changeNotifyCount(state, action) {
      return {
        ...state,
        notifyCount: action.payload,
      };
    },
  },
};
