import housing from '../services/housing';

export default {
  namespace: 'housing',
  state: {
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(housing.housePriceList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *rateCodeList({ payload }, { call, put }) {
      const response = yield call(housing.rateCodeList, payload);
      yield put({
        type: 'save',
        payload: {
          rateCodeList: response,
        },
      });
    },
    *roomTypeList({ payload }, { call, put }) {
      const response = yield call(housing.roomTypeList, payload);
      yield put({
        type: 'save',
        payload: {
          roomTypeList: response,
        },
      });
    },
    *add({ payload }, { call, put }) {
      const response = yield call(housing.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
    },
    *sourceList({ payload }, { call, put }) {
      const response = yield call(housing.sourceList, payload);
      yield put({
        type: 'save',
        payload: {
          sourceList: response,
        },
      });
    },
    *calendarPrice({ payload }, { call, put }) {
      const response = yield call(housing.calendarPrice, payload);
      yield put({
        type: 'save',
        payload: {
          calendarPrice: response,
        },
      });
      return response;
    },
    *clearHousePrice({ payload }, { call, put }) { // 清除房价
      const response = yield call(housing.clearHousePrice, payload);
      yield put({
        type: 'save',
        payload: {
          clearHousePrice: response,
        },
      });
      return response;
    },
    *businessTime({ payload }, { call, put }) { // 获取当前营业日期
      const response = yield call(housing.getBusinessTime, payload);
      yield put({
        type: 'save',
        payload: {
          businessTime: response,
        },
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
  },
};
