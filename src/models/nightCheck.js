import nightCheck from '../services/nightCheck';

export default {
  namespace: 'nightCheck',
  state: {
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(nightCheck.nightCheckList, payload);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *wrongList({ payload }, { call, put }) {
      const response = yield call(nightCheck.nightCheckWrongList, payload);
      yield put({
        type: 'save',
        payload: {
          wrongList: response,
        },
      });
    },
    *checkList({ payload }, { call, put }) {
      const response = yield call(nightCheck.priceCheckList, payload);
      yield put({
        type: 'save',
        payload: {
          checkList: response,
        },
      });
    },
    *businessTime({ payload }, { call, put }) {
      const response = yield call(nightCheck.getBusinessTime, payload);
      yield put({
        type: 'save',
        payload: {
          businessTime: response,
        },
      });
    },
    *getDepositInfo({ payload }, { call, put }) {
      const response = yield call(nightCheck.getDepositInfo, payload);
      yield put({
        type: 'save',
        payload: {
          priceInfo: response,
        },
      });
    },
    *cancel({ payload }, { call, put }) {
      const response = yield call(nightCheck.houseCancel, payload);
      yield put({
        type: 'save',
        payload: {
          cancel: response,
        },
      });
    },
    *noShow({ payload }, { call, put }) {
      const response = yield call(nightCheck.houseNoShow, payload);
      yield put({
        type: 'save',
        payload: {
          noShow: response,
        },
      });
    },
    *getCompany({ payload }, { call, put }) {
      const response = yield call(nightCheck.getCompany, payload);
      yield put({
        type: 'save',
        payload: {
          companyList: response,
        },
      });
    },
    *delay({ payload }, { call, put }) { // 延到
      const response = yield call(nightCheck.delay, payload);
      yield put({
        type: 'save',
        payload: {
          delay: response,
        },
      });
    },
    *stayLong({ payload }, { call, put }) { // 延住
      const response = yield call(nightCheck.stayLong, payload);
      yield put({
        type: 'save',
        payload: {
          stayLong: response,
        },
      });
    },
    *doCheck({ payload }, { call, put }) { // 执行夜审
      const response = yield call(nightCheck.doCheck, payload);
      yield put({
        type: 'save',
        payload: {
          doCheck: response,
        },
      });
    },
    *linkHouse({ payload }, { call, put }) { // 联房
      const response = yield call(nightCheck.linkHouse, payload);
      yield put({
        type: 'save',
        payload: {
          linkHouse: response,
        },
      });
    },
    *linkHouseDetail({ payload }, { call, put }) { // 联房详情
      const response = yield call(nightCheck.linkHouseDetail, payload);
      yield put({
        type: 'save',
        payload: {
          linkHouseDetail: response,
        },
      });
    },
    *cancelLinkHouse({ payload }, { call, put }) { // 取消联房
      const response = yield call(nightCheck.cancelLinkHouse, payload);
      yield put({
        type: 'save',
        payload: {
          cancelLinkHouse: response,
        },
      });
    },
    *preCheckOut({ payload }, { call, put }) { // 检查房间费用信息
      const response = yield call(nightCheck.preCheckOut, payload);
      yield put({
        type: 'save',
        payload: {
          preCheckOut: response,
        },
      });
    },
    *returnHouse({ payload }, { call, put }) { // 退房-现结
      const response = yield call(nightCheck.returnHouse, payload);
      yield put({
        type: 'save',
        payload: {
          returnHouse: response,
        },
      });
    },
    *returnHouseCredit({ payload }, { call, put }) { // 退房-临时挂账
      const response = yield call(nightCheck.returnHouseCredit, payload);
      yield put({
        type: 'save',
        payload: {
          returnHouseCredit: response,
        },
      });
      return response;
    },
    *returnHouseProtocol({ payload }, { call, put }) { // 退房-协议单位挂账
      const response = yield call(nightCheck.returnHouseProtocol, payload);
      yield put({
        type: 'save',
        payload: {
          returnHouseProtocol: response,
        },
      });
      return response;
    },
    *appendCheckOut({ payload }, { call, put }) { // 补结账
      const response = yield call(nightCheck.appendCheckOut, payload);
      yield put({
        type: 'save',
        payload: {
          appendCheckOut: response,
        },
      });
    },
    *searchRoom({ payload }, { call, put }) { // 联房房间列表
      const response = yield call(nightCheck.searchRoom, payload);
      yield put({
        type: 'save',
        payload: {
          searchRoom: response,
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
