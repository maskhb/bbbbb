import businessAccount from '../services/businessAccount';

export default {
  namespace: 'businessAccount',

  state: {
  },

  effects: {

    /* 分页获取商家帐号信息接口 */
    *queryListByPage({ payload }, { call, put }) {
      const response = yield call(businessAccount.queryListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },

    /*  新增商家账号信息接口 */
    *saveAccount({ payload }, { call, put }) {
      const response = yield call(businessAccount.saveAccount, payload);
      yield put({
        type: 'save',
        payload: {
          saveRes: response,
        },
      });
    },
    /* 更新商家账号信息接口 */
    *updateAccount({ payload }, { call, put }) {
      const response = yield call(businessAccount.updateAccount, payload);
      yield put({
        type: 'save',
        payload: {
          updateRes: response,
        },
      });
    },
    /* 查询商家账号详情 */
    *queryDetail({ payload }, { call, put }) {
      const response = yield call(businessAccount.queryDetail, payload);
      yield put({
        type: 'save',
        payload: {
          queryDetailRes: response,
        },
      });
    },
    /* 查询商家账号角色列表接口 */
    *queryList({ payload }, { call, put }) {
      const response = yield call(businessAccount.queryList, payload);
      yield put({
        type: 'save',
        payload: {
          queryListRes: response,
        },
      });
      return response;
    },
    /* 保存商家账号角色接口 */
    *saveAccountpermissions({ payload }, { call, put }) {
      const response = yield call(businessAccount.saveAccountpermissions, payload);
      yield put({
        type: 'save',
        payload: {
          saveRes: response,
        },
      });
    },
    /* 更新商家账号状态接口 */
    *updateStatus({ payload }, { call, put }) {
      const response = yield call(businessAccount.updateStatus, payload);
      yield put({
        type: 'save',
        payload: {
          updateRes: response,
        },
      });
    },
    /* 查询系统内所有角色 */
    *queryRoleListWeb({ payload }, { call, put }) {
      const response = yield call(businessAccount.queryRoleListWeb, payload);
      yield put({
        type: 'save',
        payload: {
          AllRole: response,
        },
      });
      return response;
    },
    // 根据角色Id获取角色的权限列表（权限超级管理员专用）
    *getAuthoritySettersByRoleId({ payload }, { call, put }) {
      const response = yield call(businessAccount.getAuthoritySettersByRoleId, payload);
      yield put({
        type: 'save',
        payload: {
          AuthoritySettersRes: response,
        },
      });
      return response;
    },
    // 树
    *queryAuthorityList({ payload }, { call, put }) {
      const response = yield call(businessAccount.queryAuthorityList, payload);
      yield put({
        type: 'save',
        payload: {
          AuthoritySettersRes: response,
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
  },
};
