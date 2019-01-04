// import { plainToClassFromExist, classToPlain } from 'class-transformer';
// import { validateSync } from 'class-validator/index';
import _ from "lodash";
// import moment from 'moment';
// import RoomResp from 'viewmodels/RoomResp';
// import Res from '../views/checkIn/common/status';
// import { validateSync } from 'class-validator/index';
// import { GresPageVO } from 'viewmodels/CheckInVO';
// import _ from 'lodash';
import * as proprietor from "../services/proprietor";

// let key = 0;
// const defaultRoomItem = () => ({
//   key: key++,
//   regionNamePath: "",
//   orgId: 0,
//   buildingId: 0,
//   floorId: 0,
//   roomId: 0
// });

const roomOwnerDetail = {
  birthday: "1990-1-1",
  docNo: "",
  docType: 1,
  gender: undefined,
  name: "",
  phone: "",
  roomId: 0,
  roomOwnerId: 0,
  roomVO: []
};

export default {
  namespace: "proprietor",

  state: {
    roomOwnerDetail,
    proprietorList: {
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10
      }
    }
  },

  effects: {
    // 业主列表
    *roomOwnerList({ payload }, { call, put, select }) {
      yield put({
        type: "saveList",
        payload: { dataList: [] }
      });

      let response = yield call(proprietor.roomOwnerList, payload);

      const savePayload = {
        dataList: response?.dataList,
        pagination: {
          current: response?.currPage,
          pageSize: response?.pageSize,
          totalPage: response?.totalPage,
          total: response?.totalCount
        }
      };

      yield put({
        type: "saveList",
        payload: savePayload
      });

      return response;
    },

    *roomOwnerSave({ payload }, { call, put, select }) {
      const response = yield call(proprietor.roomOwnerSave, payload);

      yield put({
        type: "save",
        payload: {
          roomOwnerSave: response
        }
      });

      return response;
    },

    *roomOwnerDetail({ payload }, { call, put, select }) {
      const response = yield call(proprietor.roomOwnerDetail, payload);
      yield put({
        type: "save",
        payload: {
          roomOwnerDetail: response
        }
      });
      return response;
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload
      };
    },

    saveList(state, action) {
      return {
        ...state,
        proprietorList: {
          ...state.proprietorList,
          ...action.payload
        }
      };
    },

    saveRow(state, action) {
      const { payload } = action;
      const { rowIndex, ...row } = payload;
      const {
        roomOwnerDetail: { roomVO }
      } = state;
      const newData = [...roomVO];

      const index = rowIndex; //newData.findIndex(item => rowIndex === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        return {
          roomOwnerDetail: {
            ...state.roomOwnerDetail,
            roomVO: newData
          }
        };
      } else {
        newData.push(row);
        // this.setState({ roomVO: newData, editingKey: "" });
      }
    },

    addRow(state, action) {
      return {
        ...state,
        roomOwnerDetail: {
          ...state.roomOwnerDetail,
          roomVO: [...state.roomOwnerDetail.roomVO, action.payload.newItem]
        }
      };
    },

    clearEmptyRoomData(state, action) {
      const { roomOwnerDetail } = state;
      const { roomVO } = roomOwnerDetail;
      const newRoomVO =
        roomVO.length > 1 ? _.filter(roomVO, item => !!item.roomId) : roomVO;
      return {
        ...state,
        roomOwnerDetail: {
          ...roomOwnerDetail,
          roomVO: newRoomVO
        }
      };
    },

    // TODO
    deleteRow(state, action) {
      const {
        payload: { index }
      } = action;
      const newRoomVO = state.roomOwnerDetail?.roomVO?.slice();
      newRoomVO.splice(index, 1);
      return {
        ...state,
        roomOwnerDetail: {
          ...state.roomOwnerDetail,
          roomVO: newRoomVO
        }
      };
    },

    resetDetail(state, action) {
      const initDetail = Object.assign({}, roomOwnerDetail, action.payload);
      return { ...state, roomOwnerDetail: initDetail };
    }
  }
};
