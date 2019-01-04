import baseSetting from '../services/baseSetting';

export default {
  namespace: 'baseSetting',

  state: {},

  effects: {
    * searchOrgList({ payload }, { call, put }) {
      const response = yield call(baseSetting.searchOrgList, payload);
      yield put({
        type: 'save',
        payload: {
          searchOrgList: response,
        },
      });
      return response;
    },
    * searchDepList({ payload }, { call, put }) {
      const response = yield call(baseSetting.searchDepList, payload);
      yield put({
        type: 'save',
        payload: {
          searchDepList: response,
        },
      });
      return response;
    },
    * searchRoleGroupList({ payload }, { call, put }) {
      const response = yield call(baseSetting.searchRoleGroupList, payload);
      yield put({
        type: 'save',
        payload: {
          searchRoleGroupList: response,
        },
      });
      return response;
    },
    * searchRoleList({ payload }, { call, put }) {
      const response = yield call(baseSetting.searchRoleList, payload);
      yield put({
        type: 'save',
        payload: {
          searchRoleList: response,
        },
      });
      return response;
    },
    * orgSave({ payload }, { call, put }) {
      const response = yield call(baseSetting.orgSave, payload);
      yield put({
        type: 'save',
        payload: {
          orgSave: response,
        },
      });
      return response;
    },
    * orgDel({ payload }, { call, put }) {
      const response = yield call(baseSetting.orgDel, payload);
      yield put({
        type: 'save',
        payload: {
          orgDel: response,
        },
      });
      return response;
    },
    * orgGetOrgByRegion({ payload }, { call, put }) {
      const response = yield call(baseSetting.orgGetOrgByRegion, payload);
      yield put({
        type: 'save',
        payload: {
          orgGetOrgByRegion: response,
        },
      });
      return response;
    },
    * depSave({ payload }, { call, put }) {
      const response = yield call(baseSetting.depSave, payload);
      yield put({
        type: 'save',
        payload: {
          depSave: response,
        },
      });
      return response;
    },
    * depListAdd({ payload }, { call, put }) {
      const response = yield call(baseSetting.depListAdd, payload);
      yield put({
        type: 'save',
        payload: {
          depListAdd: response,
        },
      });
      return response;
    },
    * depDel({ payload }, { call, put }) {
      const response = yield call(baseSetting.depDel, payload);
      yield put({
        type: 'save',
        payload: {
          depDel: response,
        },
      });
      return response;
    },
    * roleGroupSave({ payload }, { call, put }) {
      const response = yield call(baseSetting.roleGroupSave, payload);
      yield put({
        type: 'save',
        payload: {
          roleGroupSave: response,
        },
      });
      return response;
    },
    * roleGroupDel({ payload }, { call, put }) {
      const response = yield call(baseSetting.roleGroupDel, payload);
      yield put({
        type: 'save',
        payload: {
          roleGroupDel: response,
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
