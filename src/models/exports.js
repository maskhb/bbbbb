/*
 * @Author: wuhao
 * @Date: 2018-04-18 10:04:31
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-18 10:07:12
 *
 * 导出服务相关 modal
 */

import exports from 'services/exports';

export default {
  namespace: 'exports',
  state: {},
  effects: {
    *startExportFile({ payload }, { call, put }) {
      const response = yield call(exports.startExportFile, payload);
      yield put({
        type: 'save',
        payload: {
          startExportFile: response,
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
