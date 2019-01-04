import R from '../services/accountInfo';

export default {
  namespace: 'accountInfo',

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

    *changeStatus({ payload }, { call, put }) {
      const response = yield call(R.changeStatus, payload);
      yield put({
        type: 'save',
        payload: {
          status: response,
        },
      });
      return response;
    },

    *setRole({ payload }, { call, put }) {
      const response = yield call(R.setRoles, payload);
      yield put({
        type: 'save',
        payload: {
          setRole: response,
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

    *roleGroupsByAccount({ payload }, { call, put }) {
      const response = yield call(R.roleGroupsByAccount, payload);
      yield put({
        type: 'save',
        payload: {
          roleGroups: {
            [payload.accountId]: response,
          },
        },
      });
      return response;
    },

    *updatePassword({ payload }, { call, put }) {
      const response = yield call(R.updatePassword, payload);
      yield put({
        type: 'save',
        payload: {
          updatePassword: response,
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
