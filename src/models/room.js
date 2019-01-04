/*
 * 房间管理 model
 */
import services from '../services/room';
import building from '../services/buildingRequest';
import tag from '../services/tagRequest';
import floor from '../services/floorRequest';
import roomType from '../services/roomType';
import { findRoom } from '../services/proprietor';
import {
  transformObjectToTSModal,
} from '../utils/transform';
import PaginationList from '../viewmodels/interfaces/PaginationList';

import RoomQueryVO from '../viewmodels/RoomQueryVO';
import RoomOwnerQuery from '../viewmodels/RoomOwnerQuery';
import RoomPageVO from '../viewmodels/RoomPageVO';
import RoomVO from '../viewmodels/RoomVO';

export default {
  namespace: 'room',

  state: {},

  effects: {
    * page({
      payload,
    }, {
      call,
      put,
    }) {
      const params = transformObjectToTSModal(payload, new RoomPageVO());
      const response = yield call(services.page, params);
      const res = transformObjectToTSModal(
        response,
        new PaginationList(RoomQueryVO),
      );

      yield put({
        type: 'save',
        payload: {
          page: res,
        },
      });

      return res;
    },

    * details({
      payload,
    }, {
      call,
      put,
    }) {
      const response = yield call(services.details, payload);

      // const params = {
      //   ...payload,
      // };

      yield put({
        type: 'save',
        payload: {
          details: response,
        },
      });

      return response;
    },


    * addRoom({
      payload,
    }, {
      call,
    }) {
      const params = transformObjectToTSModal(payload, new RoomVO());
      const response = yield call(services.addRoom, params);

      return response;
    },

    * update({
      payload,
    }, {
      call,
    }) {
      const params = transformObjectToTSModal(payload, new RoomVO());
      const response = yield call(services.update, params);

      return response;
    },

    * saveOwner({
      payload,
    }, {
      call,
      put,
    }) {
      const params = transformObjectToTSModal(payload, new RoomOwnerQuery());
      const response = yield call(findRoom, params);

      yield put({
        type: 'save',
        payload: {
          saveOwner: response,
        },
      });

      return response;
    },

    * updateStatusForDisable({
      payload,
    }, {
      call,
    }) {
      const params = {
        ...payload,
        status: 2,
      };
      const response = yield call(services.updateStatus, params);

      return response;
    },

    * updateStatusForEnable({
      payload,
    }, {
      call,
    }) {
      const params = {
        ...payload,
        status: 1,
      };
      const response = yield call(services.updateStatus, params);

      return response;
    },

    * buildingData({
      payload,
    }, {
      call,
      put,
    }) {
      const params = {
        ...payload,
      };
      const response = yield call(building.queryListByPage, params);

      yield put({
        type: 'save',
        payload: {
          buildingData: response,
        },
      });

      return response;
    },

    * floorData({
      payload,
    }, {
      call,
      put,
    }) {
      const params = {
        ...payload,
      };
      const response = yield call(floor.queryListByPage, params);

      yield put({
        type: 'save',
        payload: {
          floorData: response,
        },
      });

      return response;
    },

    * tagData({
      payload,
    }, {
      call,
      put,
    }) {
      const params = {
        ...payload,
      };
      const response = yield call(tag.queryListByPage, params);

      yield put({
        type: 'save',
        payload: {
          tagData: response,
        },
      });

      return response;
    },

    * roomTypeData({
      payload,
    }, {
      call,
      put,
    }) {
      const params = {
        ...payload,
      };
      const response = yield call(roomType.page, params);

      yield put({
        type: 'save',
        payload: {
          roomTypeData: response,
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
