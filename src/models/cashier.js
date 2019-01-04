import cashierRequest from '../services/cashierRequest';
// import { transformObjectToTSModal } from '../utils/transform/aftersale';

export default {
  namespace: 'cashier',

  state: [],

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    savePageInfo(state, action) {
      return {
        ...state,
        detail: {
          ...state.detail,
          ...action.payload,
        },
      };
    },
    saveSelectedInfo(state, action) {
      return {
        ...state,
        Selected: {
          ...state.detail,
          ...action.payload,
        },
      };
    },
    clearAccountDetails(state) {
      return {
        ...state,
        currentDetail: {},
      };
    },
  },

  effects: {
    // key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。
    // 由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
    // 格式为 *(action, effects) => void 或 [*(action, effects) => void, { type }]。
    /* 价格代码管理 */
    // 分页获取列表
    * queryListByPage({ payload }, { call, put }) {
      const response = yield call(cashierRequest.queryListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          ListData: response,
        },
      });
      return response;
    },
    * accountReceivableDelete({ payload }, { call }) {
      return yield call(cashierRequest.accountReceivableDelete, payload);
    },
    // 新增和编辑
    * saveOrUpdate({ payload }, { call }) {
      return yield call(cashierRequest.saveOrUpdate, payload);
    },
    // 启用or禁用
    * updateStatus({ payload }, { call }) {
      return yield call(cashierRequest.updateStatus, payload);
    },
    // 删除
    * rateCodeDelete({ payload }, { call }) {
      return yield call(cashierRequest.rateCodeDelete, payload);
    },
    * queryTempAccountReg({ payload }, { call, put }) {
      const response = yield call(cashierRequest.queryTempAccountReg, payload);
      yield put({
        type: 'save',
        payload: {
          TempAccountListData: response,
        },
      });
      return response;
    },
    * queryAccountReceivable({ payload }, { call, put }) {
      const response = yield call(cashierRequest.queryAccountReceivable, payload);
      yield put({
        type: 'save',
        payload: {
          AccountReceivableListData: response,
        },
      });
      return response;
    },
    * updateAccountReceivable({ payload }, { call }) {
      return yield call(cashierRequest.updateAccountReceivable, payload);
    },
    /* 应收账号-账务详情 */
    * queryCreditAccountDetails({ payload }, { call, put }) {
      const response = yield call(cashierRequest.queryCreditAccountDetails, payload);
      yield put({
        type: 'save',
        payload: {
          currentDetail: response,
        },
      });
      return response;
    },
    /* 应收账号-账务详情 分页 */
    * queryCreditAccountDetailsByPage({ payload }, { call, put }) {
      const response = yield call(cashierRequest.queryCreditAccountDetailsByPage, payload);
      yield put({
        type: 'save',
        payload: {
          CreditAccountDetails: response,
        },
      });
      return response;
    },
    /* 查询所有时段订单账目 */
    // 导出 /gres/account/export
    // /gres/account/listHisAccount 分页获取历史账务查询
    * queryHisAccount({ payload }, { call, put }) {
      const response = yield call(cashierRequest.queryHisAccount, payload);
      yield put({
        type: 'save',
        payload: {
          HisAccountListData: response,
        },
      });
      return response;
    },
    // 结算
    * addSettlement({ payload }, { call }) {
      return yield call(cashierRequest.addSettlement, payload);
    },
    // 调账
    * addReconciliation({ payload }, { call }) {
      return yield call(cashierRequest.addReconciliation, payload);
    },
    // 新增帐号
    *addAccountReceivable({ payload }, { call }) {
      return yield call(cashierRequest.addAccountReceivable, payload);
    },
    //

  },

  subscriptions: {
    /*
    setup({ history, dispatch }) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      // 以 key/value 格式定义 subscription。
      // subscription 是订阅，用于订阅一个数据源，然后根据需要 dispatch 相应的 action。
      // 在 app.start() 时被执行，数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。
      // 格式 ({ dispatch, history }, done) => unlistenFunction
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({ type: 'load' });
        }
      });
    },
    */
  },

};

