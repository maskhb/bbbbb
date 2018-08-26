/*
 * @Author: wuhao
 * @Date: 2018-06-21 14:48:35
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-27 18:36:54
 *
 * 收货单接口类
 */
import Service from '../services/aftersale';

import * as viewModels from '../viewmodels/AfterSale';
import * as OrderViewModels from '../viewmodels/Orders';

import { transformObjectToTSModal } from '../utils/transform/aftersale';

export default {
  namespace: 'aftersale',
  state: {
    // 申请列表
    applyList: {},
    // 退货列表
    returnList: {},
    // 换货列表
    exchangeList: {},
    // 退款列表
    refundList: {},
    afterSaleReasons: {},
  },
  effects: {
    *queryApplyList({ payload }, { call, put }) {
      const response = yield call(Service.queryApplyOrderList, payload);
      yield put({
        type: 'save',
        payload: {
          applyList: transformObjectToTSModal(
            response,
            new viewModels.ApplyAfterOrderList()
          ),
        },
      });
    },
    *queryReturnExchangeList({ payload }, { call, put }) {
      const params = transformObjectToTSModal(payload, new viewModels.ReturnExchangeQueryVO());

      const response = yield call(Service.queryReturnExchangeList, params);
      yield put({
        type: 'save',
        payload: {
          queryReturnExchangeList: transformObjectToTSModal(
            response,
            new viewModels.ReturnExchangeList()
          ),
        },
      });
    },
    *queryExchangeOrderDetail({ payload }, { call, put }) {
      const response = yield call(Service.queryExchangeOrderDetail, payload);
      yield put({
        type: 'save',
        payload: {
          queryExchangeOrderDetail: transformObjectToTSModal(
            response,
            new viewModels.ApplyOrderDetailVO()
          ),
        },
      });
    },
    *queryRefundOrderDetail({ payload }, { call, put }) {
      const response = yield call(Service.queryRefundOrderDetail, payload);
      yield put({
        type: 'save',
        payload: {
          queryRefundOrderDetail: transformObjectToTSModal(
            response,
            new viewModels.ApplyOrderDetailVO()
          ),
        },
      });
    },
    *queryReturnOrderDetail({ payload }, { call, put }) {
      const response = yield call(Service.queryReturnOrderDetail, payload);
      yield put({
        type: 'save',
        payload: {
          queryReturnOrderDetail: transformObjectToTSModal(
            response,
            new viewModels.ApplyOrderDetailVO()
          ),
        },
      });
    },
    *queryApplyOrderDetail({ payload }, { call, put }) {
      const response = yield call(Service.queryApplyOrderDetail, payload);
      yield put({
        type: 'save',
        payload: {
          queryApplyOrderDetail: transformObjectToTSModal(
            response,
            new viewModels.ApplyOrderDetailVO()
          ),
        },
      });
    },
    *confirmReceiptForReturnOrder({ payload }, { call, put }) {
      const response = yield call(Service.confirmReceiptForReturnOrder, payload);
      yield put({
        type: 'save',
        payload: {
          confirmReceiptForReturnOrder: response,
        },
      });
    },
    *applyClosed({ payload }, { call }) {
      return yield call(Service.applyOrderShutdownApplyOrder, payload);
    },
    *queryOrderDetails({ payload }, { call, put }) {
      const response = yield call(Service.queryOrderDetails, payload);
      yield put({
        type: 'save',
        payload: {
          queryOrderDetails: transformObjectToTSModal(
            response,
            new OrderViewModels.Detail()
          ),
        },
      });
    },
    *applyOrderCheckSettlementStatus({ payload }, { call }) {
      return yield call(Service.applyOrderCheckSettlementStatus, payload);
    },
    *applyOrderCheckAuditStatus({ payload }, { call }) {
      return yield call(Service.applyOrderCheckAuditStatus, payload);
    },
    *applyOrderAuditApplyOrder({ payload }, { call }) {
      return yield call(Service.applyOrderAuditApplyOrder, payload);
    },
    *applyOrderSaveApplyDetailInfo({ payload }, { call }) {
      return yield call(Service.applyOrderSaveApplyDetailInfo, payload);
    },
    *applyOrderUpdateApplyDetailInfo({ payload }, { call }) {
      return yield call(Service.applyOrderUpdateApplyDetailInfo, payload);
    },
    *applyOrderShutdownApplyOrder({ payload }, { call }) {
      return yield call(Service.applyOrderShutdownApplyOrder, payload);
    },
    *applyOrderCancelApplyOrder({ payload }, { call }) {
      return yield call(Service.applyOrderCancelApplyOrder, payload);
    },
    *getAfterSaleReasons({ payload: { afterSaleType } }, { call, put, select }) {
      const respond = yield call(Service.getAfterSaleReasons, { afterSaleType });
      if (respond) {
        const afterSaleReasons = select(state => state.afterSaleReasons);
        afterSaleReasons[afterSaleType] = Object.keys(respond).map(((r) => {
          return {
            value: Number(r),
            label: respond[r],
          };
        }));
        yield put({
          type: 'save',
          payload: {
            afterSaleReasons,
          },
        });
      }
      return respond;
    },
    *goOpenExchangeOrder({ payload }, { call, put }) {
      const response = yield call(Service.goOpenExchangeOrder, payload);
      yield put({
        type: 'save',
        payload: {
          goOpenExchangeOrder: response,
        },
      });
    },
    *accountDetail({ payload }, { call, put }) {
      const response = yield call(Service.accountDetail, payload);
      yield put({
        type: 'save',
        payload: {
          accountDetail: response,
        },
      });
    },
    *updateAddress({ payload }, { call, put }) {
      const response = yield call(Service.updateAddress, payload);
      yield put({
        type: 'save',
        payload: {
          updateAddress: response,
        },
      });
    },
    *addExchangeOrder({ payload }, { call, put }) {
      const response = yield call(Service.addExchangeOrder, payload);
      yield put({
        type: 'save',
        payload: {
          addExchangeOrder: response,
        },
      });
    },
    *checkExchangeGoods({ payload }, { call }) {
      return yield call(Service.checkExchangeGoods, payload);
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
