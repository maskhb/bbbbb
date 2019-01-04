import common from '../services/common';

export default {
  namespace: 'common',

  state: {
    setModalWithForm: {},
  },

  effects: {
    * queryCommunityList({ payload }, { call, put }) {
      const response = yield call(common.queryCommunityList, payload);
      yield put({
        type: 'save',
        payload: {
          queryCommunityList: response,
        },
      });
    },

    * startExportFile({ payload }, { call, put }) {
      const response = yield call(common.startExportFile, payload);
      yield put({
        type: 'save',
        payload: {
          startExportFile: response,
        },
      });
    },

    *queryRegionInfo({ payload }, { call, put }) {
      const response = yield call(common.queryRegionInfo, payload);
      yield put({
        type: 'save',
        payload: {
          [`queryRegionInfo-${payload.regionId}`]: response,
        },
      });
    },

    *setModalWithForm({ payload }, { call, put }) {
      yield put({
        type: 'modalForm',
        payload: {
          [payload.id]: payload.data,
        },
      });
    },

    *getGoodSubjects({ payload }, { call, put }) {
      const response = yield call(common.getGoodSubjects, payload);
      yield put({
        type: 'save',
        payload: {
          getGoodSubjects: response,
        },
      });
    },

    * canWake({ payload }, { call, put }) {
      const response = yield call(common.canWake, payload);
      yield put({
        type: 'save',
        payload: {
          canWake: response,
        },
      });
      return response;
    },

    * wakeFinish({ payload }, { call, put }) {
      const response = yield call(common.wakeFinish, payload);
      yield put({
        type: 'save',
        payload: {
          wakeFinish: response,
        },
      });
      return response;
    },
    
    * regionGetOrgRegion({ payload }, { call, put }) {
      const response = yield call(common.regionGetOrgRegion, payload);
      yield put({
        type: 'save',
        payload: {
          regionGetOrgRegion: response,
        },
      });
      return response;
    },

    //
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    modalForm(state, action) {
      return {
        ...state,
        setModalWithForm: {
          ...state.setModalWithForm,
          ...action.payload,
        },
      };
    },
  },
};
