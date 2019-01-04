import exportFile from '../services/exportFile';

export default {
  namespace: 'exportFile',

  state: {},

  effects: {
    * queryList({ payload }, { call, put }) {
      const response = yield call(exportFile.queryList, payload);
      yield put({
        type: 'save',
        payload: {
          queryList: response,
        },
      });
    },
    * startExportFile({ payload }, { call, put }) {
      const response = yield call(exportFile.startExportFile, payload);
      yield put({
        type: 'save',
        payload: {
          startExportFile: response,
        },
      });
      return response;
    },

    * startExportFileByToken({ payload }, { call, put }) {
      const response = yield call(exportFile.startExportFileByToken, payload);
      yield put({
        type: 'save',
        payload: {
          startExportFileByToken: response,
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
