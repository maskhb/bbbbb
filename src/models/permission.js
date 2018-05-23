import permission from '../services/permission';
import { setAuthority, getAuthority } from '../utils/authority';

export default {
  namespace: 'permission',

  state: {
    currentAuthority: getAuthority(),
  },

  effects: {
    *current({ payload }, { call, put }) {
      const response = yield call(permission.current, payload);
      if (response && typeof response.map === 'function') {
        const authories = response.map(s => s.authorityId);
        setAuthority(authories);
        yield put({
          type: 'save',
          payload: {
            currentAuthority: authories,
          },
        });
      }
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
