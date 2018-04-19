import { validateSync } from 'class-validator';
import { plainToClassFromExist } from 'class-transformer';
import service from 'services/goods';
import { GoodsPaginationList } from 'viewmodels/Goods';

export default {
  namespace: 'goods',

  state: {
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(service.list, payload);

      const vm = plainToClassFromExist(GoodsPaginationList(), response);
      const errors = validateSync(vm);
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors); /* eslint no-console: 0 */
        return;
      }

      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(service.detail, payload);
      yield put({
        type: 'save',
        payload: {
          detail: response,
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
    },
    *edit({ payload }, { call, put }) {
      const response = yield call(service.edit, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
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
    *audit({ payload }, { call, put }) {
      const response = yield call(service.audit, payload);
      yield put({
        type: 'save',
        payload: {
          audit: response,
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
