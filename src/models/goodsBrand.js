import { validateSync } from 'class-validator';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import service from 'services/goodsBrand';
import GoodsBrand, { GoodsBrandPaginationList } from 'viewmodels/GoodsBrand';

export default {
  namespace: 'goodsBrand',

  state: {

  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(service.list, payload);

      const vm = plainToClassFromExist(GoodsBrandPaginationList(), response);
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

      const vm = plainToClass(GoodsBrand, response);
      const errors = validateSync(vm);
      if (errors.length > 0) {
        console.log('validation failed. errors: ', errors); /* eslint no-console: 0 */
        return;
      }

      yield put({
        type: 'save',
        payload: {
          [`detail${payload.brandId}`]: response,
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
    *remove({ payload }, { call, put }) {
      const response = yield call(service.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
    },
    *status({ payload }, { call, put }) {
      const response = yield call(service.status, payload);
      yield put({
        type: 'save',
        payload: {
          status: response,
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
