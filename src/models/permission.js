import permission from '../services/permission';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'permission',

  state: {
    currentAuthority: [],
  },

  effects: {
    *current({ payload }, { call, put }) {
      const response = yield call(permission.current, payload);
      setAuthority(response?.currentAuthority);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        currentAuthority: action.payload?.currentAuthority,
      };
    },
  },
};
