import tagRequest from '../services/tagRequest';

export default {
  namespace: 'tag',
  state: [],

  effects: {
    // 分页获取列表
    * queryListByPage({ payload }, { call, put }) {
      const response = yield call(tagRequest.queryListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          ListData: response,
        },
      });
      return response;
    },
    // 新增
    * add({ payload }, { call, put }) {
      const response = yield call(tagRequest.add, payload);
      yield put({
        type: 'save',
        payload: {
          add: response,
        },
      });
      return response;
    },
    // 编辑
    * edit({ payload }, { call, put }) {
      const response = yield call(tagRequest.update, payload);
      yield put({
        type: 'save',
        payload: {
          edit: response,
        },
      });
      return response;
    },
    // 启用or禁用
    * status({ payload }, { call, put }) {
      const response = yield call(tagRequest.updateStatus, payload);
      yield put({
        type: 'save',
        payload: {
          status: response,
        },
      });
      return response;
    },
    // 删除
    * remove({ payload }, { call, put }) {
      const response = yield call(tagRequest.remove, payload);
      yield put({
        type: 'save',
        payload: {
          remove: response,
        },
      });
      return response;
    },
    
    // 获取证件类型
    * tagDocType({ payload }, { call, put }) {
      const response = yield call(tagRequest.tagDocType, payload);
      yield put({
        type: 'save',
        payload: {
          tagDocType: response,
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

