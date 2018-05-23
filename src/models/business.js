import business from '../services/business';

export default {
  namespace: 'business',

  state: {
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const response = yield call(business.queryList, payload);
      yield put({
        type: 'save',
        payload: {
          queryList: response,
        },
      });
      return response;
    },
    /* 商家列表页 */

    /* 分页获取商家信息接口 */
    *queryListByPage({ payload }, { call, put }) {
      const response = yield call(business.queryListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          queryListByPageRes: response,
        },
      });
    },


    /* 根据商家id查询商家基本信息详情接口 */
    *queryDetail({ payload }, { call, put }) {
      const response = yield call(business.queryDetail, payload);
      yield put({
        type: 'save',
        payload: {
          currentDetailRes: response,
        },
      });
    },
    /* 根据商家id查询商家完整信息详情接口 */
    *queryDetailAll({ payload }, { call, put }) {
      const response = yield call(business.queryDetailAll, payload);
      yield put({
        type: 'save',
        payload: {
          details: response,
        },
      });
      return response;
    },
    /* 校验厂家 */
    *validateUnion({ payload }, { call, put }) {
      const response = yield call(business.validateUnion, payload);
      yield put({
        type: 'save',
        payload: {
          validateUnionRes: response,
        },
      });
    },

    /* 更新商家状态接口 */
    *updateStatus({ payload }, { call, put }) {
      const response = yield call(business.updateStatus, payload);
      yield put({
        type: 'save',
        payload: {
          updateStatusRes: response,
        },
      });
    },

    /* 下载批量导入模板 */
    // 下载帐号模板批量
    *downloadMerchantAccountTemplate({ payload }, { call, put }) {
      const response = yield call(business.downloadMerchantAccountTemplate, payload);
      yield put({
        type: 'save',
        payload: {
          urlRes: response,
        },
      });
    },
    // 下载商家模板批量
    *downloadMerchantTemplate({ payload }, { call, put }) {
      const response = yield call(business.downloadMerchantTemplate, payload);
      yield put({
        type: 'save',
        payload: {
          urlRes: response,
        },
      });
    },
    // 新增商家信息接口
    *saveNewMerchant({ payload }, { call, put }) {
      const response = yield call(business.saveNewMerchant, payload);
      yield put({
        type: 'save',
        payload: {
          saveRes: response,
        },
      });
    },
    // 更新商家信息
    *updateMerchant({ payload }, { call, put }) {
      const response = yield call(business.updateMerchant, payload);
      yield put({
        type: 'save',
        payload: {
          saveRes: response,
        },
      });
    },
    // 导入帐号
    *importAccount({ payload }, { call, put }) {
      const response = yield call(business.importAccount, payload);
      yield put({
        type: 'save',
        payload: {
          saveRes: response,
        },
      });
      return response;
    },
    // 导入商家
    *importMerchant({ payload }, { call, put }) {
      const response = yield call(business.importMerchant, payload);
      yield put({
        type: 'save',
        payload: {
          saveRes: response,
        },
      });
      return response;
    },
    // 关联商家
    *unionMerchant({ payload }, { call, put }) {
      const response = yield call(business.unionMerchant, payload);
      yield put({
        type: 'save',
        payload: {
          unionMerchantRes: response,
        },
      });
      return response;
    },
    // 解除关联

    *disunionMerchant({ payload }, { call, put }) {
      const response = yield call(business.disunionMerchant, payload);
      yield put({
        type: 'save',
        payload: {
          disunionMerchantRes: response,
        },
      });
      return response;
    },
    *list({ payload }, { call, put }) {
      const response = yield call(business.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
      return response;
    },
    *add({ payload }, { call, put }) {
      const response = yield call(business.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(business.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(business.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *exsit({ payload }, { call, put }) {
      const response = yield call(business.exsit, payload);
      yield put({
        type: 'save',
        payload: {
          exsit: response,
        },
      });
    },
    // 查询厂家
    *queryUnionMerchantList({ payload }, { call, put }) {
      const response = yield call(business.queryListByMutilCondition, payload);
      yield put({
        type: 'save',
        payload: {
          queryUnionMerchantList: response,
        },
      });
      return response;
    },
    // 查询指定厂家下的经销商
    *queryMerchantOfUnionList({ payload }, { call, put }) {
      const response = yield call(business.queryListByMutilCondition, payload);
      yield put({
        type: 'save',
        payload: {
          [`queryMerchantOfUnionList${payload.unionMerchantId}`]: response,
        },
      });
      return response;
    },
    // 查询地址节点路径
    *getRegionPath({ payload }, { call, put }) {
      const response = yield call(business.getRegionPath, payload);
      yield put({
        type: 'save',
        payload: { regionIdList: response },
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
    savePageInfo(state, action) {
      return {
        ...state,
        detail: {
          ...state.detail,
          ...action.payload,
        },
      };
    },

  },
};
