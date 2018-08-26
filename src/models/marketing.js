/*
 * @Author: nic
 * @Date: 2018-07-04 14:48:35
 * @Last Modified by: nic
 * @Last Modified time: 2018-07-21 17:48:24
 *
 * 促销规则类接口
 */
import Service from '../services/marketing';

export default {
  namespace: 'marketing',
  state: {
    // 优惠券列表
    couponList: {},
    // 优惠券详情
    couponDetail: {},
    // 新增优惠券对象
    couponSave: {},
    // 编辑优惠券
    couponUpdate: {},
    // 更改优惠券状态
    couponStatus: {},
    // 更改券码状态
    couponCodeStatus: {},
    // 优惠券总数
    countMyCoupon: {},
    // 查询优惠券码
    queryDetailFeign: {},
    // 分页获取优惠券码
    couponSaveList: {},
    // 优惠券码列表
    couponCodeList: {},
    // 日志列表
    couponLogList: {},
    // 商家列表
    queryMerchant: [],
    // 批量操作日志
    couponBatchLogList: {},
    // 查询优惠券数量情况
    couponCount: {},
  },
  effects: {
    *couponList({ payload }, { call, put }) {
      const response = yield call(Service.couponList, payload);
      yield put({
        type: 'save',
        payload: {
          couponList: response,
        },
      });
    },
    *couponDetail({ payload }, { call, put }) {
      const response = yield call(Service.couponDetail, payload);

      response.scopeType = {
        type: response.scopeType,
        listPromotionRuleCouponScopeVoS: response.listPromotionRuleCouponScopeVoResp.map((_v) => {
          const v = _v;
          v.value = v.refId;
          v.label = v.refName;
          return v;
        }),
      };

      yield put({
        type: 'save',
        payload: {
          couponDetail: response,
        },
      });
    },
    *couponSave({ payload }, { call, put }) {
      const response = yield call(Service.couponSave, payload);
      yield put({
        type: 'save',
        payload: {
          couponSave: response,
        },
      });
    },
    *couponUpdate({ payload }, { call, put }) {
      const response = yield call(Service.couponUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          couponUpdate: response,
        },
      });
    },
    *couponStatus({ payload }, { call, put }) {
      const response = yield call(Service.couponStatus, payload);
      yield put({
        type: 'save',
        payload: {
          couponStatus: response,
        },
      });
    },
    *couponCodeStatus({ payload }, { call, put }) {
      const response = yield call(Service.couponCodeStatus, payload);
      yield put({
        type: 'save',
        payload: {
          couponCodeStatus: response,
        },
      });
    },
    *countMyCoupon({ payload }, { call, put }) {
      const response = yield call(Service.countMyCoupon, payload);
      yield put({
        type: 'save',
        payload: {
          countMyCoupon: response,
        },
      });
    },
    *queryDetailFeign({ payload }, { call, put }) {
      const response = yield call(Service.queryDetailFeign, payload);
      yield put({
        type: 'save',
        payload: {
          queryDetailFeign: response,
        },
      });
    },
    *couponCodeList({ payload }, { call, put }) {
      const response = yield call(Service.couponCodeList, payload);
      yield put({
        type: 'save',
        payload: {
          couponCodeList: response,
        },
      });
    },
    *couponSaveList({ payload }, { call, put }) {
      const response = yield call(Service.couponSaveList, payload);
      yield put({
        type: 'save',
        payload: {
          couponSaveList: response,
        },
      });
    },
    *couponLogList({ payload }, { call, put }) {
      const response = yield call(Service.couponLogList, payload);
      yield put({
        type: 'save',
        payload: {
          couponLogList: response,
        },
      });
    },
    *couponBatchLogList({ payload }, { call, put }) {
      const response = yield call(Service.couponBatchLogList, payload);
      yield put({
        type: 'save',
        payload: {
          couponBatchLogList: response,
        },
      });
    },
    *queryMerchant({ payload }, { call, put }) {
      const response = yield call(Service.queryMerchant, payload);
      yield put({
        type: 'save',
        payload: {
          queryMerchant: response,
        },
      });
    },
    *couponCount({ payload }, { call, put }) {
      const response = yield call(Service.couponCount, payload);
      yield put({
        type: 'save',
        payload: {
          couponCount: response,
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
