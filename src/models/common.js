import { plainToClassFromExist } from 'class-transformer/index';
import { validateSync } from 'class-validator/index';
import * as viewModels from 'viewmodels/GoodsPackage';

import common from '../services/common';

const { MerchantQuery } = viewModels;

export default {
  namespace: 'common',

  state: {},

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
    * queryMerchantList({ payload: { keyName, parentItem = [], ...others } }, { call, put }) {
      const vm = plainToClassFromExist(new MerchantQuery(), others);
      const errors = validateSync(vm);


      if (errors.length) {
        /* eslint no-console:0 */
        return console.warn(errors);
      }
      const response = yield call(common.queryMerchantList, {
        MerchantBaseVoMultiCondition: {
          ...others,
        },
      });

      if (response?.msgCode && response?.msgCode !== 200) {
        return yield put({
          type: 'save',
          payload: {
            [keyName]: [],
          },
        });
      }

      const data = plainToClassFromExist(new viewModels.MerchantList(), response);
      data.dataList = [...parentItem, ...data.dataList].map(item =>
        plainToClassFromExist(new viewModels.Merchant(), item)
      );

      yield put({
        type: 'save',
        payload: {
          [keyName]: data,
        },
      });
    },

    *orderGoodsListByPage({ payload }, { call, put }) {
      const response = yield call(common.orderGoodsListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          orderGoodsListByPage: response,
        },
      });
    },

    *getPaymentMethodList({ payload }, { call, put }) {
      const response = yield call(common.getPaymentMethodList, payload);
      yield put({
        type: 'save',
        payload: {
          [`getPaymentMethodList-${payload.type}`]: response,
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

    *queryPromotionGoodsByPage({ payload }, { call, put }) {
      const response = yield call(common.queryPromotionGoodsByPage, payload);
      yield put({
        type: 'save',
        payload: {
          queryPromotionGoodsByPage: response,
        },
      });
    },

    *goodsSaleCategoryList({ payload }, { call, put }) {
      const response = yield call(common.goodsSaleCategoryList, payload);
      yield put({
        type: 'save',
        payload: {
          goodsSaleCategoryList: response,
        },
      });
    },


    *goodsCategoryListByMerchantId({ payload }, { call, put }) {
      const response = yield call(common.goodsCategoryListByMerchantId, payload);
      yield put({
        type: 'save',
        payload: {
          goodsCategoryListByMerchantId: response,
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
