import { plainToClassFromExist, classToPlain } from 'class-transformer';
import { validateSync } from 'class-validator/index';
import * as viewModels from 'viewmodels/GoodsPackage';
import _ from 'lodash';
import { TAG_TYPES } from '../views/Goods/Package/List/status';
import * as model from '../services/goodsPackage';

const { TagListQuery, DetailQuery, PackageGoodsQuery } = viewModels;

export default {
  namespace: 'goodsPackage',

  state: {
    list: {
      pagination: {
        current: 1,
        pageSize: 10,
      },
    },
    spaceList: [],
    detail: {},
    detailDefault: {},
  },

  effects: {
    * list({ payload }, { call, put }) {
      const vm = plainToClassFromExist(new viewModels.GoodsListQuery(), payload);
      const errors = validateSync(vm);
      if (errors.length) {
        /* eslint no-console:0 */
        return console.warn(errors);
      }

      const response = yield call(model.list, vm);

      const data = {
        list: (response?.dataList || []).map((item) => {
          return {
            ...item,
            disabled: item.auditStatus === 2,
          };
        }),
        pagination: {
          total: response?.totalCount,
          totalPage: response?.totalPage,
          pageSize: payload?.pageInfo?.pageSize,
        },
      };

      yield put({
        type: 'save',
        payload: {
          list: data,
        },
      });
    },
    * listByAuditStatus({ payload }, { call, put }) {
      // const vm = plainToClassFromExist(new viewModels.GoodsListQuery(), payload);
      // const errors = validateSync(vm);
      // if (errors.length) {
      //   /* eslint no-console:0 */
      //   return console.warn(errors);
      // }

      const response = yield call(model.list, payload);

      const data = {
        list: (response?.dataList || []).map((item) => {
          return {
            ...item,
            disabled: item.auditStatus === 2,
          };
        }),
        pagination: {
          total: response?.totalCount,
          totalPage: response?.totalPage,
          pageSize: payload.pageSize,
        },
      };

      yield put({
        type: 'save',
        payload: {
          [`listAudit${payload.auditStatus}`]: data,
        },
      });
    },
    * queryTagList({ payload }, { call, put }) {
      const vm = plainToClassFromExist(new TagListQuery(), payload);

      const errors = validateSync(vm);
      if (errors.length) {
        /* eslint no-console:0 */
        return console.warn(errors);
      }
      const response = yield call(model.queryTagList, payload);

      if (response?.msgCode && response?.msgCode !== 200) {
        return yield put({
          type: 'save',
          payload: {
            [`${TAG_TYPES[payload.tagType]}`]: [],
          },
        });
      }

      const data = plainToClassFromExist(new viewModels.TagCollection(), { result: response });

      yield put({
        type: 'save',
        payload: {
          [`${TAG_TYPES[payload.tagType]}`]: classToPlain(data?.result || []),
        },
      });
    },
    * detail({ payload }, { call, put }) {
      const vm = plainToClassFromExist(new DetailQuery(), payload);
      const errors = validateSync(vm);

      if (errors.length) {
        /* eslint no-console:0 */
        return console.warn(errors);
      }
      const response = yield call(model.detail, payload);
      const detail = plainToClassFromExist(new viewModels.PackageDetail(), response);

      if (detail?.msgCode && detail?.msgCode !== 200) {
        return yield put({
          type: 'save',
          payload: {
            detail: {},
            detailDefault: {},
          },
        });
      }

      yield put({
        type: 'save',
        payload: {
          detail,
          detailDefault: _.cloneDeep(detail),
        },
      });
    },
    * add({ payload }, { call, put }) {
      const packageVoS = plainToClassFromExist(new viewModels.SaveQuery(), payload);
      const response = yield call(model.save, { packageVoS });
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    * remove({ payload }, { call, put }) {
      const response = yield call(model.remove, { packageId: payload[0] });
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    * top({ payload }, { call, put }) {
      const response = yield call(model.top, payload);
      yield put({
        type: 'save',
        payload: {
          top: response,
        },
      });
    },
    * cancelTop({ payload }, { call, put }) {
      const response = yield call(model.cancelTop, payload);
      yield put({
        type: 'save',
        payload: {
          cancelTop: response,
        },
      });
    },
    * update({ payload }, { call, put }) {
      const packageVoU = plainToClassFromExist(new viewModels.SaveQuery(), payload);
      const response = yield call(model.update, { packageVoU });

      if (response?.msgCode && response?.msgCode !== 200) {
        return yield put({
          type: 'save',
          payload: {
            update: '',
          },
        });
      }

      yield put({
        type: 'save',
        payload: {
          update: response,
        },
      });
    },
    * shelf({ payload }, { call, put }) {
      const response = yield call(model.shelf, payload);
      yield put({
        type: 'save',
        payload: {
          shelf: response,
        },
      });
    },
    * audit({ payload }, { call, put }) {
      const response = yield call(model.audit, payload);

      if (response?.msgCode && response?.msgCode !== 200) {
        return yield put({
          type: 'save',
          payload: {
            audit: {},
          },
        });
      }

      yield put({
        type: 'save',
        payload: {
          audit: response,
        },
      });
    },
    * spaceList({ payload }, { call, put }) {
      let list = yield call(model.spaceList, payload) || {};
      if (list?.msgCode && list?.msgCode !== 200) {
        return yield put({
          type: 'save',
          payload: {
            spaceList: [],
          },
        });
      }
      list = _.unionBy(list, 'spaceId');

      const data = plainToClassFromExist(new viewModels.SpaceCollection(), { result: list });
      yield put({
        type: 'save',
        payload: {
          spaceList: classToPlain(data?.result || []),
        },
      });
    },
    * queryPackageGoods({ payload, list = [] }, { call, put }) {
      const vm = plainToClassFromExist(new PackageGoodsQuery(), payload);
      const errors = validateSync(vm);
      if (errors.length) {
        /* eslint no-console:0 */
        return console.warn(errors);
      }
      yield put({
        type: 'save',
        payload: {
          packageGoodsLoading: true,
        },
      });
      const response = yield call(model.queryPackageGoods, vm) || {};

      if (response?.msgCode && response?.msgCode !== 200) {
        return yield put({
          type: 'save',
          payload: {
            packageGoodsList: {
              allList: _.uniqBy(list, 'skuId'),
              dataList: [],
              pagination: {
                pageSize: payload.pageInfo.pageSize,
                totalPage: response?.totalPage,
                total: response.totalCount,
              },
            },
            packageGoodsLoading: false,
          },
        });
      }
      const packageGoodsList = {
        allList: _.uniqBy([...list, ...(response?.dataList || [])], 'skuId'),
        dataList: response?.dataList || [],
        pagination: {
          pageSize: payload.pageInfo.pageSize,
          totalPage: response?.totalPage,
          total: response?.totalCount,
        },
      };

      yield put({
        type: 'save',
        payload: {
          packageGoodsList,
          packageGoodsLoading: false,
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
    saveDetail(state, action) {
      return {
        ...state,
        detail: {
          ...state.detail,
          ...action.payload,
        },
      };
    },
    resetDetail(state) {
      return {
        ...state,
        detailDefault: {},
        detail: {},
      };
    },
    addLinkAuditStatus(state, action) {
      return {
        ...state,
        linkState: action.payload.auditStatus,
      };
    },
    deleteLinkAuditStatus(state) {
      return {
        ...state,
        linkState: null,
      };
    },
  },
};
