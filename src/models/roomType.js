/*
 * @Author: wuhao
 * @Date: 2018-09-25 17:02:39
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-26 15:29:16
 *
 * 房型管理 model
 */
import services from '../services/roomType';
import { transformObjectToTSModal } from '../utils/transform';
import PaginationList from '../viewmodels/interfaces/PaginationList';

import RoomTypeQueryVO from '../viewmodels/implements/RoomTypeQueryVO';
import RoomTypeVO from '../viewmodels/implements/RoomTypeVO';
import RoomTypeAddVO from '../viewmodels/implements/RoomTypeAddVO';
import RoomTypeUpdateVO from '../viewmodels/implements/RoomTypeUpdateVO';
import RoomTypeImageUpdateVO from '../viewmodels/implements/RoomTypeImageUpdateVO';

export default {
  namespace: 'roomType',

  state: {},

  effects: {
    *page({ payload }, { call, put }) {
      const params = transformObjectToTSModal(payload, new RoomTypeQueryVO());
      const response = yield call(services.page, params);
      const res = transformObjectToTSModal(
        response,
        new PaginationList(RoomTypeVO),
      );

      yield put({
        type: 'save',
        payload: {
          page: res,
        },
      });

      return res;
    },

    *details({ payload }, { call, put }) {
      const response = yield call(services.details, payload);

      const res = transformObjectToTSModal(
        response,
        new PaginationList(RoomTypeVO),
      );

      yield put({
        type: 'save',
        payload: {
          details: res,
        },
      });

      return res;
    },

    *getRoomTypeImages({ payload }, { call, put }) {
      const response = yield call(services.getRoomTypeImages, payload);

      yield put({
        type: 'save',
        payload: {
          getRoomTypeImages: response,
        },
      });

      return response;
    },

    *saveRoomType({ payload }, { call }) {
      const params = transformObjectToTSModal(payload, new RoomTypeAddVO());
      const response = yield call(services.saveRoomType, params);

      return response;
    },

    *update({ payload }, { call }) {
      const params = transformObjectToTSModal(payload, new RoomTypeUpdateVO());
      const response = yield call(services.update, params);

      return response;
    },

    *deleteRoomType({ payload }, { call }) {
      const response = yield call(services.deleteRoomType, payload);

      return response;
    },

    *updateStatusForDisable({ payload }, { call }) {
      const params = {
        ...payload,
        status: 2,
      };
      const response = yield call(services.updateStatus, params);

      return response;
    },

    *updateStatusForEnable({ payload }, { call }) {
      const params = {
        ...payload,
        status: 1,
      };
      const response = yield call(services.updateStatus, params);

      return response;
    },

    *upDateRoomTypeImage({ payload }, { call }) {
      const params = transformObjectToTSModal(payload, new RoomTypeImageUpdateVO());
      const response = yield call(services.upDateRoomTypeImage, params);

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
