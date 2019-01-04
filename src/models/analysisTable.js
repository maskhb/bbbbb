import analysisTable from '../services/analysisTable';
import { transformObjectToTSModal } from '../utils/transform';
import PaginationList from '../viewmodels/interfaces/PaginationList';
import StatisticsInfoPageVO from '../viewmodels/StatisticsInfoPageVO';
import StatisticsInfoVO from '../viewmodels/StatisticsInfoVO';


export default {
  namespace: 'analysisTable',

  state: {},

  effects: {
    * queryList({ payload }, { call, put }) {
      const params = transformObjectToTSModal(payload, new StatisticsInfoPageVO());
      const response = yield call(analysisTable.queryList, params);
      const res = transformObjectToTSModal(
        response,
        new PaginationList(StatisticsInfoVO),
      );

      yield put({
        type: 'save',
        payload: {
          queryList: res,
        },
      });
    },
    * statsDownload({ payload }, { call, put }) {
      const response = yield call(analysisTable.statsDownload, payload);
      yield put({
        type: 'save',
        payload: {
          statsDownload: response,
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
