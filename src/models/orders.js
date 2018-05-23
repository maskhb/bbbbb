/*
 * @Author: wuhao
 * @Date: 2018-04-04 14:32:37
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-15 16:24:48
 *
 * 订单Modle
 */
import moment from 'moment';
import { fenToYuan } from 'utils/money';
import { plainToClassFromExist, classToPlain } from 'class-transformer';
import orders from '../services/orders';
import * as viewModels from '../viewmodels/Orders';

export default {
  namespace: 'orders',
  state: {},
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(orders.list, payload);
      yield put({
        type: 'save',
        payload: {
          list: classToPlain(plainToClassFromExist(new viewModels.List(), response)),
        },
      });
    },
    *audit({ payload }, { call, put }) {
      const response = yield call(orders.audit, payload);
      yield put({
        type: 'save',
        payload: {
          audit: response,
        },
      });
    },
    *cancel({ payload }, { call, put }) {
      const response = yield call(orders.cancel, payload);
      yield put({
        type: 'save',
        payload: {
          cancel: response,
        },
      });
    },
    *invoiceModify({ payload }, { call, put }) {
      const response = yield call(orders.invoiceModify, payload);
      yield put({
        type: 'save',
        payload: {
          invoiceModify: response,
        },
      });
    },
    *goodsRemark({ payload }, { call, put }) {
      const response = yield call(orders.goodsRemark, payload);
      yield put({
        type: 'save',
        payload: {
          goodsRemark: response,
        },
      });
    },
    *logisticsModify({ payload }, { call, put }) {
      const response = yield call(orders.logisticsModify, payload);
      yield put({
        type: 'save',
        payload: {
          logisticsModify: response,
        },
      });
    },
    *modifyMoney({ payload }, { call, put }) {
      const response = yield call(orders.modifyMoney, payload);
      yield put({
        type: 'save',
        payload: {
          modifyMoney: response,
        },
      });
    },
    *receipt({ payload }, { call, put }) {
      const response = yield call(orders.receipt, payload);
      yield put({
        type: 'save',
        payload: {
          receipt: response,
        },
      });
    },
    *remarkAdd({ payload }, { call, put }) {
      const response = yield call(orders.remarkAdd, payload);
      yield put({
        type: 'save',
        payload: {
          remarkAdd: response,
        },
      });
    },
    *ship({ payload }, { call, put }) {
      const response = yield call(orders.ship, payload);
      yield put({
        type: 'save',
        payload: {
          ship: response,
        },
      });
    },
    *payRecordAdd({ payload }, { call, put }) {
      const response = yield call(orders.payRecordAdd, payload);
      yield put({
        type: 'save',
        payload: {
          payRecordAdd: response,
        },
      });
    },
    *payRecordUpdate({ payload }, { call, put }) {
      const response = yield call(orders.payRecordUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          payRecordUpdate: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(orders.detail, payload);

      response?.orderActionVOList?.forEach((item) => {
        /* eslint no-param-reassign:0 */
        item.formatTime = item.time ? moment(item.time).format('YYYY-MM-DD HH:mm') : '';
      });

      response?.orderGoodsVOList?.forEach((item) => {
        /* eslint no-param-reassign:0 */
        item.salePriceFormat = fenToYuan(item.salePrice);
        item.goodsAmountFormat = fenToYuan(item.goodsAmount);
        item.shouldPayAmountFormat = fenToYuan(item.shouldPayAmount);
      });

      const vm = plainToClassFromExist(new viewModels.Detail(), response);
      yield put({
        type: 'save',
        payload: {
          detail: classToPlain(vm),
        },
      });
    },
    *addressModify({ payload }, { call, put }) {
      const response = yield call(orders.addressModify, payload);
      yield put({
        type: 'save',
        payload: {
          addressModify: response,
        },
      });
    },
    *getPaymentMethodList({ payload }, { call, put }) {
      const response = yield call(orders.getPaymentMethodList, payload);
      yield put({
        type: 'save',
        payload: {
          getPaymentMethodList: response,
        },
      });
    },
    *queryOrderGoods({ payload }, { call, put }) {
      const response = yield call(orders.queryOrderGoods, payload);
      yield put({
        type: 'save',
        payload: {
          queryOrderGoods: response,
        },
      });
    },
    *queryExportTotalCount({ payload }, { call, put }) {
      const response = yield call(orders.queryExportTotalCount, payload);
      yield put({
        type: 'save',
        payload: {
          queryExportTotalCount: response,
        },
      });
    },
    *logisticsDetail({ payload }, { call, put }) {
      const response = yield call(orders.logisticsDetail, payload);
      yield put({
        type: 'save',
        payload: {
          logisticsDetail: response,
        },
      });
    },
    *queryOrdeListTotalCount({ payload }, { call, put }) {
      const response = yield call(orders.queryOrdeListTotalCount, payload);
      yield put({
        type: 'save',
        payload: {
          queryOrdeListTotalCount: response,
        },
      });
    },


    // ///////////
    *addOrderPayListForLocal({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          addOrderPayListForLocal: payload,
        },
      });
    },
    *editOrderPayStatusListForLocal({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          editOrderPayStatusListForLocal: payload,
        },
      });
    },
    // ///////////
    *queryOrderRelatedLogs({ payload }, { call, put }) {
      const response = yield call(orders.queryOrderRelatedLogs, { orderLogQueryVO: payload });
      // const vm = plainToClassFromExist(new viewModels.OrderRelatedLogs(), response);
      yield put({
        type: 'save',
        payload: {
          [`orderRelatedLogs-${payload.type}`]: response,
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
