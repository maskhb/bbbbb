/*
 * @Author: wuhao
 * @Date: 2018-04-18 10:04:31
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-24 18:07:26
 *
 * 导出服务相关 modal
 */

// import exports from 'services/exports';

export default {
  namespace: 'exports',
  state: {},
  effects: {

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
