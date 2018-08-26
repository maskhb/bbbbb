import businessClass from '../services/businessClass';

export default {
  namespace: 'businessClass',

  state: {
  },

  effects: {

    /* 分页获取商家帐号信息接口 */
    *queryList({ payload }, { call, put }) {
      const response = yield call(businessClass.queryList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
      return response;
    },
    /* 新增一级二级分类 */
    *addClassification({ payload }, { call, put }) {
      const response = yield call(businessClass.addClassification, payload);
      yield put({
        type: 'save',
        payload: {
          addClassificationRes: response,
        },
      });
    },
    /* 编辑一级二级分类  */
    *editClassification({ payload }, { call, put }) {
      const response = yield call(businessClass.editClassification, payload);
      yield put({
        type: 'save',
        payload: {
          editClassification: response,
        },
      });
      return response;
    },
    /* 删除商家分类 */
    *deleteCategory({ payload }, { call, put }) {
      const response = yield call(businessClass.deleteCategory, payload);
      yield put({
        type: 'save',
        payload: {
          deleteRes: response,
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
