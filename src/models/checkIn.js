import { plainToClassFromExist } from 'class-transformer';
import _ from 'lodash';
import moment from 'moment';
import RoomResp from 'viewmodels/RoomResp';
import {
  transformArrivalDate,
  transformDepartureDate,
  restGresSelectRoomType,
} from 'viewmodels/GresDetailResp';
import * as checkIn from '../services/checkIn';
import servicesCashierRequest from '../services/cashierRequest';
import servicesChannelRequest from '../services/channelRequest';
import * as GresDetailVO from '../viewmodels/GresDetailVO';
import { GresDetailResp } from '../viewmodels/GresDetailResp';

const gresDetails = {
  arrivalDate: moment('14:00', 'HH:mm').valueOf(),
  departureDate: moment('12:00', 'HH:mm').add(1, 'days').valueOf(),
};

/**
 *
 * 更新datalist节点内容的辅助函数
 * eg: updateDataList(state, action)(item=>item.gresId==action.payload.gresId)(item=>item.status=action.payload.status)
 *
 * */
const updateDataList = (state, action) => finderFn => (updateFn) => {
  const dl = [...state.checkInList.dataList];
  const { checkInList } = state;
  const targetObj = _.find(dl, finderFn || (item => item.gresId == action.payload.gresId));
  updateFn(targetObj);
  return {
    ...state,
    checkInList: {
      ...checkInList,
      dataList: dl,
    },
  };
};

export default {
  namespace: 'checkIn',

  state: {
    sourceList: [],
    gresDetails: plainToClassFromExist(new GresDetailResp(), gresDetails),
    checkInList: {
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
    },
    gresSelectRoom: {},
  },

  effects: {
    * gresAdd({ payload: { isEdit, ...others } }, { call, put, select }) {
      const state = yield select(state => state.checkIn);
      const vm = plainToClassFromExist(new GresDetailVO.GresDetailReq(), { ...others, sourceList: state.sourceList });
      const response = yield call(isEdit ? checkIn.gresUpdate : checkIn.gresAdd, { gresDetailVO: vm });
      if (response) {
        yield put({
          type: 'save',
          payload: {
            gresAdd: response,
          },
        });
      }
      return response;
    },
    * gresAppendCheckOut({ payload }, { call, put }) {
      return yield call(checkIn.gresAppendCheckOut, payload);
    },
    * gresCancel({ payload }, { call, put }) {
      return yield call(checkIn.gresCancel, payload);
    },
    * gresCheckOut({ payload }, { call, put }) {
      return yield call(checkIn.gresCheckOut, payload);
    },
    * gresDelay({ payload }, { call, put }) {
      const response = yield call(checkIn.gresDelay, payload);
      if (response) {
        yield put({
          type: 'updateGresDelay',
          payload,
        });
      }
      return response;
    },
    * gresDelayArrivals({ payload }, { call, put }) {
      const response = yield call(checkIn.gresDelayArrivals, payload);
      if (response) {
        yield put({
          type: 'updateDelayArrivals',
          payload,
        });
      }
      return response;
    },
    * gresDetails({
      payload: {
        isPreCheckIn, isCheckIn, arrivalDate, departureDate, ...others
      },
    }, { call, put, select }) {
      const methods = isPreCheckIn ? checkIn.gresPreCheckIn : checkIn.gresDetails;
      const response = yield call(methods, isPreCheckIn ? {
        ...others, arrivalDate, departureDate,
      } : others);

      let gresSelectRoomType = [];
      let p;
      const { rateCodeId, sourceId } = response || {};
      p = yield put({
        type: 'gresSelectRoomType',
        payload: {
          rateCodeId,
          isCheckIn,
          arrivalDate: response.arrivalDate,
          departureDate: response.departureDate,
          roomId: (isCheckIn || isPreCheckIn) ? response?.roomId : '',
          gresRoomTypeVOs: response?.gresRoomTypeVOs || [],
          status: response?.status,
          hasChangeRateType: false,
          gresId: response?.gresId,
        },
      });

      gresSelectRoomType = yield p;

      // 禁用业务来源或者价格代码时，会出现界面没有展示的情况，所以，这样查一下
      if (sourceId) {
        const sourcePage = yield call(checkIn.sourcePage, {
          sourcePageVO: {
            currPage: 1,
            pageSize: 9999,
            isBase: 1,
          },
        });

        const curSource = _.find(sourcePage?.dataList, item => item.sourceId === sourceId);
        if (curSource) {
          yield put({
            type: 'save',
            payload: {
              [`sourceId_${sourceId}`]: curSource.sourceName,
            },
          });
        }
      }

      if (rateCodeId) {
        const rateCodePage = yield call(checkIn.rateCodePage, {
          rateCodePageQueryVO: {
            currPage: 1,
            pageSize: 9999,
            sourceId: response?.sourceId,
          },
        });

        const curItem = _.find(rateCodePage?.dataList, item =>
          item.rateCodeId === rateCodeId);

        if (curItem) {
          yield put({
            type: 'save',
            payload: {
              [`rateCodeId_${rateCodeId}`]: curItem.rateCodeName,
            },
          });
        }
      }

      if (isPreCheckIn && response?.roomTypeId) {
        yield put({
          type: 'gresSelectRoom',
          payload: {
            roomTypeId: response?.roomTypeId,
            arrivalDate: transformArrivalDate(response?.arrivalDate).valueOf(),
            departureDate: transformDepartureDate(response?.departureDate).valueOf(),
          },
        });
      }

      const obj = yield select(() => {
        return { ...response, gresSelectRoomType };
      });

      const data = plainToClassFromExist(new GresDetailResp(), { ...obj, isCheckIn, isPreCheckIn });

      if (data.linkRoomIds) {
        const arrLinkRoomsIds = data.linkRoomIds ? String(data.linkRoomIds).split(',') : [];
        const arrLinkRooms = data.linkRooms ? data.linkRooms.split(',') : [];
        data.setLinkRoomOptions(_.map(arrLinkRoomsIds, (value, index) => {
          return {
            value,
            label: arrLinkRooms[index],
          };
        }));
      }

      if (response) {
        yield put({
          type: 'save',
          payload: {
            gresDetails: data,
            roomBookingTotalVOs: _.cloneDeep(data.roomBookingTotalVOs),
            gresSelectRoomType,
          },
        });
      }

      return response;
    },
    * gresDisableInvoice({ payload }, { call, put }) {
      return yield call(checkIn.gresDisableInvoice, payload);
    },
    * gresEditInvoice({ payload }, { call, put }) {
      return yield call(checkIn.gresEditInvoice, payload);
    },
    * gresInvoice({ payload }, { call, put }) {
      return yield call(checkIn.gresInvoice, payload);
    },
    // 获取投票列表
    * gresInvoiceList({ payload }, { call, put }) {
      return yield call(checkIn.gresInvoiceList, payload);
    },
    * gresLinkRoom({ payload }, { call, put }) {
      const response = yield call(checkIn.gresLinkRoom, payload);
      yield put({
        type: 'save',
        payload: {
          gresLinkRoom: response,
        },
      });
      return response;
    },
    // 获取联房
    * gresGetLinkRooms({ payload }, { call, put, select }) {
      return yield call(checkIn.gresGetLinkRooms, payload);
    },
    // 直接联房
    * gresDirectLinkRoom({ payload }, { call, put }) {
      return yield call(checkIn.gresDirectLinkRoom, payload);
    },
    // 直接取消联房
    * gresCancelLinkRoom({ payload }, { call, put }) {
      return yield call(checkIn.gresCancelLinkRoom, payload);
    },
    * gresGetDepositInfo({ payload }, { call, put }) {
      const response = yield call(checkIn.gresGetDepositInfo, payload);
      yield put({
        type: 'save',
        payload: {
          gresGetDepositInfo: response,
        },
      });
      return response;
    },
    * queryAccountReceivable({ payload }, { call, put }) {
      const response = yield call(servicesCashierRequest.queryAccountReceivable, payload);
      yield put({
        type: 'save',
        payload: {
          queryAccountReceivable: response,
        },
      });
      return response;
    },
    // gresListByPage
    * gresListByPage({ payload }, { call, put }) {
      yield put({
        type: 'saveCheckInList',
        payload: { dataList: [] },
      });
      const response = yield call(checkIn.gresListByPage, payload);
      const savePayload = {
        dataList: response?.dataList,
        pagination: {
          current: response?.currPage,
          pageSize: response?.pageSize,
          totalPage: response?.totalPage,
          total: response?.totalCount,
        },
      };
      yield put({
        type: 'saveCheckInList',
        payload: savePayload,
      });
      return response;
    },
    * gresNoshow({ payload }, { call, put }) {
      return yield call(checkIn.gresNoshow, payload);
    },
    * sourceList({ payload }, { call, put }) {
      const response = yield call(checkIn.sourceList, payload);
      yield put({
        type: 'save',
        payload: {
          sourceList: response,
        },
      });
      return response;
    },
    * gresPreCheckOut({ payload }, { call, put }) {
      const response = yield call(checkIn.gresPreCheckOut, payload);
      yield put({
        type: 'savePreCheckOut',
        payload: {
          ...payload,
          gresPreCheckOut: response,
        },
      });
      return response;
    },
    * gresRemainRoom({ payload }, { call, put }) {
      const response = yield call(checkIn.gresRemainRoom, payload);
      yield put({
        type: 'save',
        payload: {
          gresRemainRoom: response,
        },
      });
    },
    * gresSave({ payload }, { call, put }) {
      const response = yield call(checkIn.gresSave, payload);
      yield put({
        type: 'save',
        payload: {
          gresSave: response,
        },
      });
    },
    * rateCodePage({ payload }, { call, put }) {
      const response = yield call(checkIn.rateCodePage, { rateCodePageQueryVO: payload });
      yield put({
        type: 'save',
        payload: {
          rateCodePage: response,
        },
      });
      return response;
    },
    * roomPage({ payload }, { call, put }) {
      const response = yield call(checkIn.roomPage, { roomQueryVO: payload });
      yield put({
        type: 'save',
        payload: {
          roomPage: response,
        },
      });

      return response;
    },
    // 房型及房价列表
    * getRoomList({ payload }, { call, put }) {
      const response = yield call(checkIn.roomPage, payload);
      yield put({
        type: 'save',
        payload: {
          roomPage: response,
        },
      });
    },
    * querySourceListByPage({ payload }, { call, put }) {
      const response = yield call(servicesChannelRequest.querySourceListByPage, payload);
      yield put({
        type: 'save',
        payload: {
          sourceList: response,
        },
      });
    },
    * gresSelectRoomType({
      payload: {
        isCheckIn, roomId, hasChangeRateType, hasChangeDate,
        gresRoomTypeVOs, status, ...others
      },
    }, { call }
    ) {
      let response;
      if (isCheckIn) {
        response = yield call(checkIn.gresGetRoomRate, { ..._.omit(others, 'gresId'), roomId });
      } else {
        response = yield call(checkIn.selectDateRoomType, { selectRoomTypeVO: others });
        let arr = [];
        _.forEach(response, (item) => {
          arr = arr.concat(_.map(item.gresRoomTypeVOs, child => ({ ...child, ..._.omit(item, 'gresRoomTypeVOs') })));
        });
        response = arr;

        // 由后端处理
        // if (!hasChangeDate && [1, 2, 6].indexOf(status) !== -1) {
        //   resetRoomTypeStock(response, gresRoomTypeVOs);
        // }
      }

      response = !hasChangeRateType ?
        restGresSelectRoomType(response, gresRoomTypeVOs, isCheckIn)
        : response;

      const data = plainToClassFromExist(new GresDetailVO.RoomTypeBookingResp(), {
        result: response,
      });

      return data.result;
    },
    * gresSelectRoom({ payload }, { call, put }) {
      const { recordList, ...params } = payload;
      const response = yield call(checkIn.gresSelectRoom, params);

      const data = plainToClassFromExist(new RoomResp(), {
        result: (_.filter(recordList, item =>
          !_.find(response, room =>
            room.roomId === item.roomId)) || []
        ).concat(response || []),
      });

      const { arrivalDate, departureDate } = payload;

      yield put({
        type: 'saveGresSelectRoom',
        payload: {
          [`s_${payload.roomTypeId}_${moment(arrivalDate).format('YYYYMMDD')}_${moment(departureDate).format('YYYYMMDD')}`]: data.result,
        },
      });

      return data.result;
    },
    * roomTypePage({ payload }, { call, put }) {
      const response = yield call(checkIn.roomTypePage, payload);

      yield put({
        type: 'save',
        payload: {
          roomTypePage: response,
        },
      });
    },
    * gresPreCheckOutDetail({ payload }, { call, put }) {
      const response = yield call(checkIn.gresPreCheckOut, payload);
      yield put({
        type: 'save',
        payload: {
          gresPreCheckOutDetail: response,
        },
      });
    },
    * paymentItemPage({ payload }, { call, put }) {
      const response = yield call(checkIn.paymentItemPage, payload);
      yield put({
        type: 'save',
        payload: {
          paymentItemPage: response,
        },
      });
    },
    * gresSearchRoom({ payload }, { call, put }) {
      const response = yield call(checkIn.gresSearchRoom, payload);
      yield put({
        type: 'save',
        payload: {
          gresSearchRoom: response,
        },
      });
      return response;
    },
    * paymentMethodPage({ payload }, { call, put }) {
      const response = yield call(checkIn.paymentMethodPage, payload);
      const paymentMethodPage = { dataList: _.filter(response?.dataList, item =>
        item.status === 1) };
      yield put({
        type: 'save',
        payload: {
          paymentMethodPage,
          paymentMethodAll: response,
        },
      });
      return paymentMethodPage;
    },
    * businessTime({ payload }, { call, put }) {
      const response = yield call(checkIn.businessTime, payload);
      yield put({
        type: 'save',
        payload: {
          businessTime: response,
        },
      });
    },
    * transferAccount({ payload }, { call, put }) {
      const response = yield call(checkIn.transferAccount, payload);
      yield put({
        type: 'save',
        payload: {
          transferAccount: response,
        },
      });
      return response;
    },
    * preTransfer({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          preTransfer: null,
        },
      });
      const response = yield call(checkIn.preTransfer, payload);
      yield put({
        type: 'save',
        payload: {
          preTransfer: response || [],
        },
      });
    },
    * sourcePage({ payload }, { call, put }) {
      const response = yield call(checkIn.sourcePage, payload);
      yield put({
        type: 'save',
        payload: {
          sourcePage: response || [],
        },
      });

      return response;
    },
    * serviceItemList({ payload }, { call, put }) {
      const response = yield call(checkIn.serviceItemList, payload);
      yield put({
        type: 'save',
        payload: {
          serviceItemList: response || [],
        },
      });
      return response;
    },

    //  服务单

    // /serviceOrder/delete 根据条件删除数据(参数传serviceOrderId即可) 1
    * deleteServiceOrder({ payload }, { call }) {
      return yield call(checkIn.deleteServiceOrder, payload);
    },
    // /serviceOrder/details 查询详情 2
    * queryServiceOrderDetail({ payload }, { call, put }) {
      const response = yield call(checkIn.queryServiceOrder, payload);
      yield put({
        type: 'save',
        payload: {
          ServiceOrderDetail: response,
        },
      });
      return response;
    },
    // /serviceOrder/export 服务单导出 3

    // 列表查询 4

    * queryServiceOrder({ payload }, { call, put }) {
      const response = yield call(checkIn.queryServiceOrder, payload);
      yield put({
        type: 'save',
        payload: {
          serviceOrder: response,
        },
      });
      return response;
    },
    // 分页获取在住/预留房间 5
    * queryRoomStayInAndReservePage({ payload }, { call, put }) {
      const response = yield call(checkIn.queryRoomStayInAndReservePage, payload);
      yield put({
        type: 'save',
        payload: {
          RoomStayInAndReservePage: response,
        },
      });
      return response;
    },
    // 新增 6
    * addServiceOrder({ payload }, { call }) {
      return yield call(checkIn.addServiceOrder, payload);
    },

    // /serviceOrder/updateCompleted 更新完成状态(参数传serviceOrderId和isCompleted即可) 7
    * updateCompleted({ payload }, { call }) {
      return yield call(checkIn.updateCompleted, payload);
    },
    // /serviceOrder/updateRemark 更新备注(参数传serviceOrderId和remark即可) 8
    * updateRemark({ payload }, { call }) {
      return yield call(checkIn.updateRemark, payload);
    },
    // /serviceItem/list 查询服务项列表
    * queryServiceItemList({ payload }, { call, put }) {
      const response = yield call(checkIn.queryServiceItemList, payload);
      yield put({
        type: 'save',
        payload: {
          ServiceItemList: response,
        },
      });
      return response;
    },

    * batchDelete({ payload }, { call }) {
      return yield call(checkIn.batchDelete, payload);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    // 更新延住状态
    updateGresDelay(state, action) {
      return updateDataList(state, action)()(item =>
        item.departureDate = action.payload.departureDate);
    },

    // 更新房间状态
    updateRoomState(state, action) {
      return updateDataList(state, action)()(item => item.status = action.payload.status);
    },

    // 保存退房信息
    savePreCheckOut(state, action) {
      return updateDataList(state, action)()(item => item.gresPreCheckOut = action.payload.gresPreCheckOut);
    },

    // 更新延到信息
    updateDelayArrivals(state, action) {
      return updateDataList(state, action)()((item) => {
        item.arrivalDate = action.payload.arrivalDate;
        item.departureDate = action.payload.departureDate;
      });
    },

    saveCheckInList(state, action) {
      return {
        ...state,
        checkInList: {
          ...state.checkInList,
          ...action.payload,
        },
      };
    },
    resetDetails(state, action) {
      return {
        ...state,
        gresDetails: plainToClassFromExist(new GresDetailResp(),
          { ...gresDetails, ...action.payload }),
        gresSelectRoomType: [],
      };
    },
    updateLinkRooms(state, action) {
      return updateDataList(state, action)()((item) => {
        item.linkRooms = action.payload.gresGetLinkRooms;
      });
    },
    saveGresSelectRoom(state, action) {
      return {
        ...state,
        gresSelectRoom: {
          ...state.gresSelectRoom,
          ...action.payload,
        },
      };
    },
  },
};
