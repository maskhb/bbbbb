import channelRequest from '../services/channelRequest';
// import { transformObjectToTSModal } from '../utils/transform/aftersale';
// import * as OrderViewModels from '../viewmodels/Orders';
// import Service from '../services/aftersale';

export default {
  namespace: 'channel',

  state: [],

  reducers: {
    add(state, { payload: todo }) {
      // 保存数据到 state
      // 用 key/value 格式定义 reducer。用于处理同步操作，唯一可以修改 state 的地方。由 action 触发
      // 格式为 (state, action) => newState 或 [(state, action) => newState, enhancer]。
      return [...state, todo];
    },
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
  },

  effects: {
    // key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。
    // 由 action 触发，可以触发 action，可以和服务器交互，可以获取全局 state 的数据等等。
    // 格式为 *(action, effects) => void 或 [*(action, effects) => void, { type }]。
    /* DEMO 查询商家分类列表接口 */

    /* /aftersale/query/refundOrderList 查询渠道列表 */
    * queryListByPage({ payload }, { call, put }) {
      const response = yield call(channelRequest.queryListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          ListData: response,
        },
      });
      return response;
    },
    * updateData({ payload }, { call }) {
      return yield call(channelRequest.updateData, payload);
    },
    * updateSourceStatus({ payload }, { call }) {
      return yield call(channelRequest.updateSourceStatus, payload);
    },

    * querySourceList({ payload }, { call, put }) {
      const response = yield call(channelRequest.querySourceList, payload);
      yield put({
        type: 'save',
        payload: {
          sourceData: response,
        },
      });
      return response;
    },

    * querySourceListByPage({ payload }, { call, put }) {
      const response = yield call(channelRequest.querySourceListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          SourceListData: response,
        },
      });
      return response;
    },

    * addSource({ payload }, { call }) {
      const response = yield call(channelRequest.addSource, payload);
      return response;
    },

    * updateSource({ payload }, { call }) {
      const response = yield call(channelRequest.updateSource, payload);
      return response;
    },

    * deleteSource({ payload }, { call }) {
      return yield call(channelRequest.deleteSource, payload);
    },
    * deleteChannel({ payload }, { call }) {
      return yield call(channelRequest.deleteChannel, payload);
    },
    * addChannel({ payload }, { call }) {
      return yield call(channelRequest.addChannel, payload);
    },
    * updateChannel({ payload }, { call }) {
      return yield call(channelRequest.updateChannel, payload);
    },
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

