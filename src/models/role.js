import R from '../services/role';

export default {
  namespace: 'role',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(R.list, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(R.save, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
      return response;
    },
    *update({ payload }, { call, put }) {
      const response = yield call(R.update, payload);
      yield put({
        type: 'save',
        payload: {
          update: response,
        },
      });
      return response;
    },

    *remove({ payload }, { call, put }) {
      const response = yield call(R.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
      return response;
    },

    *roleGroupList({ _ }, { call, put }) {
      const response = yield call(R.roleGroupList, _);
      yield put({
        type: 'save',
        payload: {
          roleGroupList: response,
        },
      });
      return response;
    },

    *setRoleAuths({ payload }, { call, put }) {
      const response = yield call(R.setRoleAuths, payload);
      yield put({
        type: 'save',
        payload: {
          update: response,
        },
      });
      return response;
    },

    *getAuthsOfRole({ payload }, { call, put }) {
      const response = yield call(R.getRoleAuths, payload);
      const res = {};
      res[payload.roleId] = response;
      yield put({
        type: 'save',
        payload: {
          auths: res,
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
