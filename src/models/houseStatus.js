import houseStatus from '../services/houseStatus';

export default {
  namespace: 'houseStatus',

  state: {},

  effects: {
    * queryRepairList({ payload }, { call, put }) {
      const response = yield call(houseStatus.queryRepairList, payload);
      yield put({
        type: 'save',
        payload: {
          queryRepairList: response,
        },
      });
    },
    * repairCancel({ payload }, { call, put }) {
      const response = yield call(houseStatus.repairCancel, payload);
      yield put({
        type: 'save',
        payload: {
          repairCancel: response,
        },
      });
      return response;
    },
    * repairFinish({ payload }, { call, put }) {
      const response = yield call(houseStatus.repairFinish, payload);
      yield put({
        type: 'save',
        payload: {
          repairFinish: response,
        },
      });
      return response;
    },
    * repairSave({ payload }, { call, put }) {
      const response = yield call(houseStatus.repairSave, payload);
      yield put({
        type: 'save',
        payload: {
          repairSave: response,
        },
      });
      return response;
    },
    * repairUpdate({ payload }, { call, put }) {
      const response = yield call(houseStatus.repairUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          repairUpdate: response,
        },
      });
      return response;
    },
    * repairDetail({ payload }, { call, put }) {
      const response = yield call(houseStatus.repairDetail, payload);
      yield put({
        type: 'save',
        payload: {
          repairDetail: response,
        },
      });
      return response;
    },
    * retentionDetail({ payload }, { call, put }) {
      const response = yield call(houseStatus.retentionDetail, payload);
      yield put({
        type: 'save',
        payload: {
          retentionDetail: response,
        },
      });
      return response;
    },
    * getBuildingList({ payload }, { call, put }) {
      const response = yield call(houseStatus.getBuildingList, payload);
      yield put({
        type: 'save',
        payload: {
          getBuildingList: response,
        },
      });
    },
    * getRoomList({ payload }, { call, put }) {
      const response = yield call(houseStatus.getRoomList, payload);
      yield put({
        type: 'save',
        payload: {
          getRoomList: response,
        },
      });
      return response;
    },
    * getWakeDetail({ payload }, { call, put }) {
      const response = yield call(houseStatus.getWakeDetail, payload);
      yield put({
        type: 'save',
        payload: {
          getWakeDetail: response,
        },
      });
      return response;
    },
    * wakeAdd({ payload }, { call, put }) {
      const response = yield call(houseStatus.wakeAdd, payload);
      yield put({
        type: 'save',
        payload: {
          wakeAdd: response,
        },
      });
      return response;
    },
    * wakeCancel({ payload }, { call, put }) {
      const response = yield call(houseStatus.wakeCancel, payload);
      yield put({
        type: 'save',
        payload: {
          wakeCancel: response,
        },
      });
      return response;
    },
    * getTagList({ payload }, { call, put }) {
      const response = yield call(houseStatus.getTagList, payload);
      yield put({
        type: 'save',
        payload: {
          getTagList: response,
        },
      });
      return response;
    },
    * clean({ payload }, { call, put }) {
      const response = yield call(houseStatus.clean, payload);
      yield put({
        type: 'save',
        payload: {
          clean: response,
        },
      });
      return response;
    },
    * dirty({ payload }, { call, put }) {
      const response = yield call(houseStatus.dirty, payload);
      yield put({
        type: 'save',
        payload: {
          dirty: response,
        },
      });
      return response;
    },
    * lock({ payload }, { call, put }) {
      const response = yield call(houseStatus.lock, payload);
      yield put({
        type: 'save',
        payload: {
          lock: response,
        },
      });
      return response;
    },
    * unlock({ payload }, { call, put }) {
      const response = yield call(houseStatus.unlock, payload);
      yield put({
        type: 'save',
        payload: {
          unlock: response,
        },
      });
      return response;
    },
    * retentionAdd({ payload }, { call, put }) {
      const response = yield call(houseStatus.retentionAdd, payload);
      yield put({
        type: 'save',
        payload: {
          retentionAdd: response,
        },
      });
      return response;
    },
    * retentionClose({ payload }, { call, put }) {
      const response = yield call(houseStatus.retentionClose, payload);
      yield put({
        type: 'save',
        payload: {
          retentionClose: response,
        },
      });
      return response;
    },
    * retentionUpdate({ payload }, { call, put }) {
      const response = yield call(houseStatus.retentionUpdate, payload);
      yield put({
        type: 'save',
        payload: {
          retentionUpdate: response,
        },
      });
      return response;
    },
    * getTag({ payload }, { call, put }) {
      const response = yield call(houseStatus.getTag, payload);
      yield put({
        type: 'save',
        payload: {
          getTag: response,
        },
      });
      return response;
    },
    * queryToday({ payload }, { call, put }) {
      const response = yield call(houseStatus.queryToday, payload);
      yield put({
        type: 'save',
        payload: {
          queryToday: response,
        },
      });
    },
    * futureGres({ payload }, { call, put }) {
      const response = yield call(houseStatus.futureGres, payload);
      yield put({
        type: 'save',
        payload: {
          futureGres: response,
        },
      });
      return response;
    },

    /* 远期房态 */
    * queryBuild({ payload }, { call, put }) {
      const response = yield call(houseStatus.queryBuild, payload);
      yield put({
        type: 'save',
        payload: {
          queryBuild: response,
        },
      });
      return response;
    },
    * queryRoomType({ payload }, { call, put }) {
      const response = yield call(houseStatus.queryRoomType, payload);
      yield put({
        type: 'save',
        payload: {
          queryRoomType: response,
        },
      });
      return response;
    },
    * queryForward({ payload }, { call, put }) {
      const response = yield call(houseStatus.queryForward, payload);
      yield put({
        type: 'save',
        payload: {
          queryForward: response,
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
