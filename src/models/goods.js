import { validateSync } from 'class-validator';
import { plainToClassFromExist, classToPlain } from 'class-transformer';
import { message } from 'antd';
import service from 'services/goods';
import { GoodsPaginationList } from 'viewmodels/Goods';

export default {
  namespace: 'goods',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(service.list, payload);

      const vm = plainToClassFromExist(GoodsPaginationList(), response || {});
      const errors = validateSync(vm);
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors); /* eslint no-console: 0 */
        message.error('数据异常，请稍后再试!');
        return;
      }

      yield put({
        type: 'save',
        payload: {
          // list: response,
          list: classToPlain(vm),
        },
      });
    },
    *recoveryList({ payload }, { call, put }) {
      const response = yield call(service.recoveryList, payload);

      const vm = plainToClassFromExist(GoodsPaginationList(), response || {});
      const errors = validateSync(vm);
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors); /* eslint no-console: 0 */
        message.error('数据异常，请稍后再试!');
        return;
      }

      yield put({
        type: 'save',
        payload: {
          // list: response,
          list: classToPlain(vm),
        },
      });
    },
    *listByAuditStatus({ payload }, { call, put }) {
      const response = yield call(service.list, payload);

      const vm = plainToClassFromExist(GoodsPaginationList(), response || {});
      const errors = validateSync(vm);
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors); /* eslint no-console: 0 */
        message.error('数据异常，请稍后再试!');
        return;
      }

      yield put({
        type: 'save',
        payload: {
          [`listAudit${payload.auditStatus?.join()}`]: classToPlain(vm), // response,
        },
      });
    },
    *pending({ payload }, { call, put }) {
      const response = yield call(service.auditStatusList, payload);

      const vm = plainToClassFromExist(GoodsPaginationList(), response || {});
      const errors = validateSync(vm);
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors); /* eslint no-console: 0 */
        return;
      }

      yield put({
        type: 'save',
        payload: {
          pending: classToPlain(vm), // response,
        },
      });
    },
    *rejected({ payload }, { call, put }) {
      const response = yield call(service.auditStatusList, { ...payload, auditStatus: 3 });

      const vm = plainToClassFromExist(GoodsPaginationList(), response);
      const errors = validateSync(vm);
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors); /* eslint no-console: 0 */
        return;
      }

      yield put({
        type: 'save',
        payload: {
          rejected: classToPlain(vm), // response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(service.detail, payload);
      yield put({
        type: 'save',
        payload: {
          [`detail${payload.goodsId}`]: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(service.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
      return response;
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(service.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
      return response;
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(service.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *removeBatch({ payload }, { call, put }) {
      const response = yield call(service.removeBatch, payload);
      yield put({
        type: 'save',
        payload: {
          removeBatch: response,
        },
      });
    },
    *audit({ payload }, { call, put }) {
      const response = yield call(service.audit, payload);
      yield put({
        type: 'save',
        payload: {
          audit: response,
        },
      });
    },
    *batchAudit({ payload }, { call, put }) {
      const response = yield call(service.audit, payload);
      yield put({
        type: 'save',
        payload: {
          batchAudit: response,
        },
      });
    },
    *online({ payload }, { call, put }) {
      const response = yield call(service.online, payload);
      yield put({
        type: 'save',
        payload: {
          online: response,
        },
      });
    },
    *batchOnline({ payload }, { call, put }) {
      const response = yield call(service.online, payload);
      yield put({
        type: 'save',
        payload: {
          batchOnline: response,
        },
      });
    },
    *propsByCategory({ payload }, { call, put }) {
      const response = yield call(service.propsByCategory, payload);
      yield put({
        type: 'save',
        payload: {
          [`propsByCategory${payload.goodsCategoryId}`]: response,
        },
      });
    },
    *orderGoodsList({ payload }, { call, put }) {
      const response = yield call(service.orderGoodsList, payload);
      yield put({
        type: 'save',
        payload: {
          orderGoodsList: response,
        },
      });
    },
    *copy({ payload }, { call, put }) {
      const response = yield call(service.copy, payload);
      yield put({
        type: 'save',
        payload: {
          copy: response,
        },
      });
    },
    *queryLog({ payload }, { call, put }) {
      const response = yield call(service.queryLog, payload);
      yield put({
        type: 'save',
        payload: {
          queryLog: response,
        },
      });
    },
    *addLinkAuditStatus({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          linkState: payload.auditStatus,
        },
      });
    },
    *deleteLinkAuditStatus(a, { put }) {
      yield put({
        type: 'save',
        payload: {
          linkState: null,
        },
      });
    },
    *queryCount({ payload }, { call, put }) {
      const response = yield call(service.queryCount, payload);
      yield put({
        type: 'save',
        payload: {
          queryCount: response,
        },
      });
    },
    *recovery({ payload }, { call, put }) {
      const response = yield call(service.recovery, payload);
      yield put({
        type: 'save',
        payload: {
          recovery: response,
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
