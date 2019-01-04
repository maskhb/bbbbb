import _ from 'lodash';
import moment, {Moment} from 'moment';
import {
  GresAccountTotalVO,
  GresAccountVO,
  GresDetailVO,
  GresLogVO,
  RoomBookingTotalVO,
  RoomBookingVO,
  GresGuestVO,
  GresRoomTypeVO
} from "./st";
import {classToClassFromExist, Exclude, Expose, plainToClassFromExist, Transform, Type} from "class-transformer";
import {
  typeMap,
  accTypeMap,
  roomGresStatusMap,
  receiptTypeMap,
  RoomTypeBooking,
  RoomTypeBookingResp
} from './GresDetailVO'
import {fenToYuan} from "../utils/money";
import {add, mul, sub} from "../utils/number";

class GresLogResp extends GresLogVO {
  @Expose()
  get timeFormat(): string {
    return this.time ? moment(this.time).format('YYYY-MM-DD HH:mm:ss') : ''
  }

  @Expose()
  get typeFormat(): string {
    return typeMap.get(Number(this.type)) || '';
  }
}

export class RoomBookingResp extends RoomBookingVO {
  @Expose()
  get arrivalDateFormat(): string {
    return this.arrivalDate ? moment(this.arrivalDate).format('YYYY-MM-DD') : ''
  }

  @Expose()
  get departureDateFormat(): string {
    return this.departureDate ? moment(this.departureDate).format('YYYY-MM-DD') : ''
  }

  @Expose()
  get roomRateFormat(): string {
    return this.roomRate ? fenToYuan(this.roomRate, false) : '0'
  }

  gresStatus?: string;
  buildingRoomNo?: string;

  @Expose()
  get gresStatusFormat(): string {
    return roomGresStatusMap.get(this.gresStatus || '') || '';
  }
}

class GresAccountResp extends GresAccountVO {
  roomNo?: string;
  itemName?: string;
  itemId: number = 0;
  buildingRoomNo?: string;

  @Expose()
  get accTypeFormat(): any {
    switch (Number(this.accType)) {
      case 1:
        return (this.buildingRoomNo || this.roomNo) + '-' + this.itemName;
      case 2:
        return this.itemId ? receiptTypeMap.get(this.itemId) : '';
      case 3:
        return accTypeMap.get(Number(this.accType)) || '';
      default:
        return '';
    }
  }

  @Expose()
  get rateFormat(): string {
    return this.rate ? '¥ ' + fenToYuan(this.rate, false) : '¥ 0'
  }

  @Expose()
  get createdTimeFormat(): string {
    return this.createdTime ? moment(this.createdTime).format('YYYY-MM-DD HH:mm:ss') : ''
  }

  @Expose()
  get businessDayFormat(): string {
    return this.businessDay ? moment(this.businessDay).format('YYYY-MM-DD') : ''
  }

  @Expose()
  get accountDateFormat(): string {
    return this.accountDate ? moment(this.accountDate).format('YYYY-MM-DD HH:mm:ss') : ''
  }
}

export class RoomBookingTotalResp extends RoomBookingTotalVO {
  // 具体预留房间
  @Type(() => RoomBookingResp)
  list: RoomBookingResp[] = [];

  @Expose()
  get remainQtyFormat(): number {
    return this.list.length;
  }

  @Expose()
  get roomsFormat(): string {
    return _.map(this.list, (item) => {
      return item.roomNo;
    }).join(',');
  }
}

export class GresAccountTotalResp extends GresAccountTotalVO {
  @Expose()
  get accTypeFormat(): string {
    return accTypeMap.get(Number(this.accType)) || ''
  }

  @Expose()
  get rateFormat(): string {
    return this.rate ? '¥ ' + fenToYuan(this.rate, false) : '¥ 0'
  }

  @Type(() => GresAccountResp)
  @Transform(value => _.map(value, (item, index) => {
    if (!item.accId) item.accId = `${item.accType}${index}`;
    return item
  }))
  accountDetails: GresAccountResp[] = [];

  @Expose()
  get children(): GresAccountResp[] {
    return this.accountDetails || [];
  }

  @Expose()
  get accId(): any {
    return `111${this.accType}`;
  }
}

class GresGuestRespVO {
  value: GresGuestVO = {};
}

export class GresRoomTypeRespVO {
  value: GresRoomTypeVO = {};
}

class GresServiceOrderVO {
  businessDay: number = 0;
  gresId: number = 0;
  unitQty: number = 0;
  roomId: number = 0;
  roomTypeId: number = 0;

  salePrice: number = 0;

  @Expose()
  get salePriceFormat(): number {
    return this.salePrice ? fenToYuan(this.salePrice, true) : this.salePrice;
  }

  serviceItemId: number = 0;
  serviceOrderId: number = 0;
}

class GresRoomTypeResp extends GresRoomTypeVO {
  @Expose()
  get realPriceFormat(): number | string {
    return this.realPrice ? fenToYuan(this.realPrice, true) : this.realPrice;
  }

  @Expose()
  get rateFormat(): number | string {
    return this.stdPrice ? fenToYuan(this.stdPrice, true) : this.stdPrice;
  }

  @Expose()
  get mealPriceFormat(): number | string {
    return this.mealPrice ? fenToYuan(this.mealPrice, true) : this.mealPrice;
  }

  @Expose()
  get bedPriceFormat(): number | string {
    return this.bedPrice ? fenToYuan(this.bedPrice, true) : this.bedPrice;
  }

  @Type(() => GresServiceOrderVO)
  packageServiceOrders: Array<GresServiceOrderVO> = [];

  @Type(() => GresServiceOrderVO)
  addServiceOrders: Array<GresServiceOrderVO> = [];
}

export class GresDetailResp extends GresDetailVO {
  isCheckIn: Boolean = false;
  isPreCheckIn: Boolean = false;

  @Expose()
  get arrivalDepartureDate(): Array<number> {
    return [
      (this.arrivalDate ? this.arrivalDate : 0),
      (this.departureDate ? this.departureDate : 0)
    ]
  }

  setArrivalDate(value: number) {
    this.arrivalDate = value;
  }

  setDepartureDate(value: number) {
    this.departureDate = value;
  }

  @Expose()
  get arrMember(): Array<number | undefined> {
    return [this.man, this.woman, this.children]
  }

  // 房客信息
  @Expose()
  get tanantInfo(): Array<GresGuestRespVO> {
    return _.map(this.gresGuestVOs, (item: any, index) => {
      return {value: {...item, id: item.id || index}, id: item.id || index}
    }) || []
  }

  setGresGuestVOs(values) {
    this.gresGuestVOs = values;
  }

  // 预订房型及房价
  @Expose()
  get roomTypeAndRate(): any {
    if (this.isPreCheckIn) {
      return _.map(this.gresRoomTypeVOs, (item) => ({value: item}))
    } else if (this.isCheckIn) {
      return resetRoomTypeAndRateByDate(this.gresRoomTypeVOs)
    }
    return resetRoomTypeAndRate(this.gresSelectRoomType, this.gresRoomTypeVOs)
  }

  @Expose()
  get arrLinkRooms(): Array<string | number> {
    return this.linkRooms ? this.linkRooms.split(',') : [];
  }

  @Expose()
  get arrLinkRoomIds(): Array<string | number> {
    return this.linkRoomIds ? String(this.linkRoomIds).split(',') : [];
  }

  linkRoomIds?: number;

  @Exclude()
  linkRoomOptions?: Array<any>;

  setLinkRoomOptions(values) {
    this.linkRoomOptions = values;
  }

  // 操作日志
  @Type(() => GresLogResp)
  gresLogVOs: GresLogResp[] = [];

  // 预留房间(显示用)
  @Type(() => RoomBookingTotalResp)
  roomBookingTotalVOs: RoomBookingTotalResp[] = [];

  //账务信息 树形接口
  @Transform(value => _.map(value, (item) => {
      _.forEach(item.accountDetails, accountItem => {
        accountItem.isDone = 'detail';
        return accountItem;
      });
      return item
    }
  ))
  @Type(() => GresAccountTotalResp)
  gresAccountTotalVOs: GresAccountTotalResp[] = [];
  // 预付总额
  // 退款总额

  gresSelectRoomType: Array<any> = [];

  @Type(() => GresRoomTypeResp)
  gresRoomTypeVOs: GresRoomTypeResp[] = [];

  setGresRoomTypeVOs(values) {
    this.gresRoomTypeVOs = values;
  }

  @Expose()
  get accountInfo(): GresAccountTotalResp[] {
    return this.gresAccountTotalVOs || [];
  }

  setAccountInfo(value) {
    this.gresAccountTotalVOs = value
  }

  roomId?: number;

  roomNo?: string;

  @Type(() => GresServiceOrderVO)
  addServiceOrders: Array<GresServiceOrderVO> = [];

  @Expose()
  get addServiceOrdersByDate(): any {
    return transformAddServiceOrdersByDate(this.gresRoomTypeVOs)
  }

  @Type(() => GresServiceOrderVO)
  assginServiceOrders: Array<GresServiceOrderVO> = [];

  setAssignServiceOrders(value) {
    this.assginServiceOrders = value;
  }
}

export const resetRoomTypeAndRate = (gresSelectRoomType, gresRoomTypeVOs) => {
  const obj: any = {};

  _.map(gresSelectRoomType, (item) => {
    const curItem = _.find(gresRoomTypeVOs, (room) => item.roomTypeId === room.roomTypeId && item.businessDay === room.businessDay);
    if (curItem) {
      if (!obj[`_${curItem.businessDay}`]) {
        obj[`_${curItem.businessDay}`] = {}
      }
      obj[`_${curItem.businessDay}`][`@${curItem.roomTypeId}`] = {
        value: curItem
      };
      obj[`roomQty${item.roomTypeId}`] = curItem.roomQty;
      obj[`packageServiceOrders${item.roomTypeId}`] = curItem.packageServiceOrders;
    }
  });
  return obj;
};

// 入住单
export const resetRoomTypeAndRateByDate = (gresRoomTypeVOs) => {
  return _.map(_.orderBy(gresRoomTypeVOs, 'businessDay'), (item) => ({value: item}));
};

export const mergeRoomTypeAndRate = (formValues, gresDetailsValues, gresSelectRoomType = []) => {
  if (!formValues) return gresDetailsValues;

  const arr: any[] = [];
  _.map(formValues, item => {
    item = initRoomTypeAndRate(item, _.find(gresSelectRoomType, (roomType: any) => {
      return roomType.roomTypeId === item.value.roomTypeId && roomType.businessDay === item.value.businessDay
    }) || {});
    const roomItem = _.find(gresDetailsValues, (room) => {
      let {roomTypeId, businessDay}: any = (room || {}).value || {};
      return roomTypeId && roomTypeId === item.value.roomTypeId && businessDay === item.value.businessDay;
    });

    if (roomItem) {
      arr.push({value: {...roomItem.value, ...item.value}})
    } else if (item.value.roomQty) {
      arr.push(item);
    }
  });

  return arr;
};

export const mergeRoomTypeAndRateByDate = (formValues, gresDetailsValues, gresSelectRoomType = []) => {
  if (!formValues) return gresDetailsValues;

  const arr: any[] = [];
  _.map(formValues, (item, index) => {
    item = initRoomTypeAndRateByDate(item, (gresDetailsValues[index] ? gresDetailsValues[index].value : gresSelectRoomType[index]));

    // 这一步正常是多此一举的，不过留着也没有问题
    const roomItem = _.find(gresDetailsValues, (room = {}) => {
      let businessDay = room.value && room.value.businessDay;
      return businessDay && businessDay === item.value.businessDay;
    });

    if (roomItem) {
      arr.push({value: {...roomItem.value, ...item.value}})
    } else {
      arr.push(item)
    }
  });

  return arr;
};

export const initRoomTypeAndRate = (roomItem, gresSelectRoomTypeItem = {}) => {
  return {
    value: {...gresSelectRoomTypeItem, ..._.omit(roomItem.value, ['roomTypeName'])}
  };
};

export const initRoomTypeAndRateByDate = (roomItem, gresSelectRoomTypeItem = {}) => {
  return {
    value: {...gresSelectRoomTypeItem, ..._.omit(roomItem.value, ['roomTypeName']), packageServiceOrders:roomItem.value.packageServiceOrders || []}
  };
};


export const prePayAccount = (accountInfo) => {
  return _.reduce(_.filter(accountInfo, (item) => {
    return item.accType === 2
  }), (sum, item) => add(sum, item.rate || 0), 0);
};

export const prePayAccountFormat = (accountInfo) => {
  return `￥ ${fenToYuan(prePayAccount(accountInfo), false)}`;
};

export const returnAccount = (accountInfo) => {
  return _.reduce(_.filter(accountInfo, (item) => {
    return item.accType === 3
  }), (sum, item) => add(sum, item.rate || 0), 0);
};

export const returnAccountFormat = (accountInfo) => {
  return `￥ ${fenToYuan(returnAccount(accountInfo), false)}`;
};

// 总消费
export const preConsum = (accountInfo) => {
  return _.reduce(_.filter(accountInfo, (item) => {
    return item.accType === 1
  }), (sum, item) => add(sum, item.rate || 0), 0)
};

export const preConsumFormat = (accountInfo) => {
  return `￥ ${fenToYuan(preConsum(accountInfo), false)}`;
};

export const shouldReceiptFormat = (accountInfo) => {
  return `￥ ${fenToYuan(add(sub(preConsum(accountInfo), prePayAccount(accountInfo)), returnAccount(accountInfo)), false)}`;
};

export const checkCurPreRoomQty = (roomTypeAndRate, curRoomType) => {
  const record = curRoomType || {};
  const curItem: any = _.find(roomTypeAndRate, (roomItem: any) => {
    const {value = {}} = roomItem || {};

    return record.roomTypeId === value.roomTypeId;
  });

  return curItem ? curItem.value.roomQty : 0
};

export const getCurRemainQty = (curRoomType) => {
  if (curRoomType.list) {
    const obj = {};
    _.forEach(curRoomType.list, (item) => {
      const dayDiff = moment(item.departureDateFormat).diff(moment(item.arrivalDateFormat), 'days');
      for (let i = 0; i < dayDiff; i++) {
        const keyName = moment(item.arrivalDate).add(i, 'days').valueOf();
        if (obj[keyName]) {
          obj[keyName] = obj[keyName] + 1;
        } else {
          obj[keyName] = 1;
        }
      }
    });
    return obj;
  } else {
    return {};
  }
};

export const getRemainQty = (roomTypeAndRate, curRoomType, arrivalDepartureDate) => {
  const roomQty = checkCurPreRoomQty(roomTypeAndRate, curRoomType);

  const arrivalDateFormat = transformArrivalDate(arrivalDepartureDate[0]).format('YYYY-MM-DD');
  const departureDateFormat = transformDepartureDate(arrivalDepartureDate[1]).format('YYYY-MM-DD');

  const dayDiff = moment(departureDateFormat).diff(moment(arrivalDateFormat), 'days');
  const obj = {};
  for (let i = 0; i < dayDiff; i++) {
    const keyName = moment(transformArrivalDate(arrivalDepartureDate[0]).valueOf()).add(i, 'days').valueOf();
    obj[keyName] = roomQty;
  }

  return obj;
};

export const checkIsMaxRemain = (roomTypeAndRate, curRoomType) => {
  const preRoomQty = checkCurPreRoomQty(roomTypeAndRate, curRoomType);

  return curRoomType.remainQtyFormat >= preRoomQty;
};

// 编辑页 房客信息有填姓名算一条 20180818
export const calTanantInfoLen = (tanantInfo) => {
  return _.filter(tanantInfo, (item = {}) => {
    return item.value && item.value.guestName
  }).length || 0;
};

export const transformArrivalDate = (date): Moment => {
  return ((date && date._isAMomentObject) ? date : moment(date)).hour(14).minute(0).seconds(0).milliseconds(0)
};

export const transformDepartureDate = (date): Moment => {
  return ((date && date._isAMomentObject) ? date : moment(date)).hour(12).minute(0).seconds(0).milliseconds(0)
};

export const addRemainRoom = ({gresDetails, value, gresSelectRoom, timeArr, index}) => {
  const oldRoomList = _.cloneDeep(gresDetails.preRoomList);

  const list = _.map(value, (roomId) => {
    const curRoom = _.find(gresSelectRoom, (item) => {
      return item.roomId === Number(roomId);
    });

    const curPreRoom = _.find(oldRoomList, (item) => {
      return item.roomId === Number(roomId);
    }) || {};

    const arrivalDate = transformArrivalDate(timeArr[0]).valueOf();
    const departureDate = transformDepartureDate(timeArr[1]).valueOf();

    return {
      roomId,
      roomNo: curRoom ? curRoom.roomNo : '',
      gresStatus: 'WI',
      arrivalDate,
      departureDate,
      roomRate: curPreRoom.roomRate || (oldRoomList[index] || {}).roomRealPrice,
      buildingRoomNo: curRoom ? curRoom.buildingRoomNo : '',
      roomDescription: curRoom ? curRoom.roomDescription : '',
    };
  });

  oldRoomList[index].list = oldRoomList[index].list ? oldRoomList[index].list.concat(list) : list;
  return _.map(oldRoomList, item => plainToClassFromExist(new RoomBookingTotalResp(), item))
};

// 详情、编辑页需要读创建时存的标准价
export const restGresSelectRoomType = (gresSelectRoomType, gresRoomTypeVOs, isCheckIn) => {
  return _.map(gresSelectRoomType, (item) => {
    const curItem = _.find(gresRoomTypeVOs, (room) => isCheckIn ? item.businessDay === room.businessDay : item.roomTypeId === room.roomTypeId);

    if (curItem) {
      item.rate = curItem.stdPrice;
      return classToClassFromExist(new RoomTypeBooking(), item)
    }

    return item;
  });
};

// 详情、编辑页 库存 = 可定+已定
export const resetRoomTypeStock = (gresSelectRoomType, gresRoomTypeVOs) => {
  return _.map(gresSelectRoomType, (item) => {
    const curItem = _.find(gresRoomTypeVOs, (room) => item.roomTypeId === room.roomTypeId);

    if (curItem) {
      item.roomQty = item.roomQty + curItem.roomQty;
      return classToClassFromExist(new RoomTypeBooking(), item)
    }

    return item;
  });
};

export const formatDateRoomTypeStock = (arrivalDepartureDate, gresSelectRoomType) => {
  const arrivalDateFormat = transformArrivalDate(arrivalDepartureDate[0]).valueOf();
  const departureDateFormat = transformDepartureDate(arrivalDepartureDate[1]).valueOf();

  const dayDiff = moment(departureDateFormat).diff(arrivalDateFormat, 'days') + 1;

  const obj = {};
  for (let i = 0; i < dayDiff; i++) {
    const keyName = moment(transformArrivalDate(arrivalDepartureDate[0]).valueOf()).add(i, 'days').valueOf();

    _.forEach(gresSelectRoomType, (item) => {
      obj[`r_${keyName}_${item.roomTypeId}`] = {
        roomStock: item.roomStock,
        roomTypeName: item.roomTypeName,
        arrivalDate: keyName,
      };
    });
  }

  return obj;
};

export const formatDateRoomType = ({arrivalDepartureDate, roomTypeAndRate, preRoomList}, isCheckIn) => {
  const arrivalDateFormat = transformArrivalDate(arrivalDepartureDate[0]).valueOf();
  const departureDateFormat = transformDepartureDate(arrivalDepartureDate[1]).valueOf();

  const dayDiff = moment(departureDateFormat).diff(arrivalDateFormat, 'days') + 1;

  const arrRoomType = isCheckIn ? roomTypeAndRate :
    _.filter(roomTypeAndRate, ({value}) => value && Boolean(value.roomQty));
  const obj = {};
  for (let i = 0; i < dayDiff; i++) {
    const keyName = moment(transformArrivalDate(arrivalDepartureDate[0]).valueOf()).add(i, 'days').valueOf();

    _.forEach(arrRoomType, (item) => {
      obj[`r_${keyName}_${item.value.roomTypeId}`] = {
        roomQty: item.value.roomQty,
        roomTypeName: item.value.roomTypeName,
        arrivalDate: keyName,
      };
    });
  }

  return obj;
};

export const formatDateRoomList = ({preRoomList}) => {
  const remainObj = {};
  _.forEach(preRoomList, (item) => {
    if (item.list) {
      _.forEach(item.list, (child) => {
        const remainDayDiff = moment(child.departureDate).diff(child.arrivalDate, 'days') + 1;
        for (let i = 0; i < remainDayDiff; i++) {
          const keyName = `r_${moment(transformArrivalDate(child.arrivalDate).valueOf()).add(i, 'days').valueOf()}_${item.roomTypeId}`;

          if (!remainObj[keyName]) {
            remainObj[keyName] = {
              roomQty: 1,
              roomTypeName: item.roomTypeName,
              arrivalDate: moment(child.arrivalDate).add(i, 'days'),
            };
          } else {
            remainObj[keyName].roomQty = remainObj[keyName].roomQty + 1;
          }
        }
      });
    }
  });

  return remainObj;
};

export const checkRemainRoom = (formatDateRoomType, formatDateRoomList) => {
  const obj = formatDateRoomType;
  const remainObj = formatDateRoomList;

  const isExceed: any[] = [];
  _.forEach(_.keys(remainObj), (key) => {
    if (obj[key] && remainObj[key].roomQty > obj[key].roomQty) {
      isExceed.push({...remainObj[key], maxQty: obj[key] ? obj[key].roomQty : 0});
    }
  });

  return isExceed;
};

export const checkRemainRoomExceedStock = (formatDateRoomTypeStock, formatDateRoomList) => {
  const obj = formatDateRoomTypeStock;
  const remainObj = formatDateRoomList;

  const isExceed: any[] = [];

  _.forEach(_.keys(remainObj), (key) => {
    if (obj[key] && remainObj[key].roomQty > obj[key].roomStock) {
      isExceed.push({...remainObj[key], maxQty: obj[key] ? obj[key].roomStock : 0});
    }
  });

  return isExceed
};

export const checkRemainRoomRepeat = ({preRoomList}) => {
  const remainObj = {};
  _.forEach(preRoomList, (item) => {
    if (item.list) {
      _.forEach(item.list, (child) => {
        const remainDayDiff = moment(child.departureDate).diff(child.arrivalDate, 'days') + 1;
        for (let i = 0; i < remainDayDiff; i++) {
          const keyName = `r_${moment(transformArrivalDate(child.arrivalDate).valueOf()).add(i, 'days').valueOf()}_${child.roomId}`;

          if (!remainObj[keyName]) {
            remainObj[keyName] = {
              roomQty: 1,
              roomNo: child.roomNo,
              arrivalDate: moment(child.arrivalDate).add(i, 'days'),
            };
          } else {
            remainObj[keyName].roomQty = remainObj[keyName].roomQty + 1;
          }
        }
      });
    }
  });

  const isRepeat: any[] = [];
  _.forEach(_.keys(remainObj), (key) => {
    if (remainObj[key].roomQty > 1) {
      isRepeat.push(remainObj[key])
    }
  });

  return isRepeat;
};

export const getGresSelectRoomType = (checkIn, arrivalDepartureDate) => {
  const {gresSelectRoomType, gresDetails} = checkIn;

  if (!arrivalDepartureDate) return gresSelectRoomType;

  const detailsRoomTypeList = _.map(gresDetails.gresRoomTypeVOs, (item) => {
    const curRoomType = _.find(gresSelectRoomType, (roomType) => roomType.businessDay === item.businessDay) || {};
    item.stdPrice = curRoomType.stdPrice;
    return item
  });

  const otherGresSelectRoomType = _.filter(gresSelectRoomType, (item) => {
    return !_.find(detailsRoomTypeList, room => room.businessDay === item.businessDay);
  });

  const departureDate = arrivalDepartureDate[1].valueOf();

  const lastArrivalDate = transformArrivalDate(departureDate).valueOf();

  return _.orderBy((plainToClassFromExist(new RoomTypeBookingResp(), {
    result: _.filter((detailsRoomTypeList || []).concat(otherGresSelectRoomType), (item) =>
      transformArrivalDate(item.businessDay).valueOf() < lastArrivalDate
    ),
  }) || {}).result, 'businessDay');
};

/**
 * objRoomType : {"roomQty6":1,"_1543334400000":{"@6":{"value":{"realPriceFormat":0}}},"packageServiceOrders6":[{"serviceItemId":"10","unitQty":1,"salePriceFormat":0.04}]}
 * @param values
 * @param gresSelectRoomType
 * @returns {{roomTypeAndRate: any[]}}
 */
export const getRoomTypeAndRate = (values, gresSelectRoomType) => {
  const objRoomType = values ? values.roomTypeAndRate : {};
  const arrKeys = _.filter(_.keys(objRoomType), key => (!key.match('roomQty') && !key.match('packageServiceOrders')));
  const arr: any[] = [];

  _.forEach(arrKeys, (key) => {
    _.forEach(_.keys(objRoomType[key]), (roomTypeKey) => {
      const item = objRoomType[key][roomTypeKey];
      const index = Number(roomTypeKey.replace('@', ''));
      const packageServiceOrders = _.map(
        _.filter(objRoomType[`packageServiceOrders${index}`], (item) => item),
        (item:any) => ({..._.omit(item, 'serviceName')})
      );
      const curBusinessDay = Number(key.replace('_', ''));
      arr.push({
        value: {
          ...item.value,
          businessDay: curBusinessDay,
          roomTypeId: index,
          roomQty: objRoomType[`roomQty${index}`],
          stdPrice: (_.find(gresSelectRoomType, roomTypeItem =>
            roomTypeItem.roomTypeId === index && roomTypeItem.businessDay === curBusinessDay
          ) || {}).stdPrice,
          packageServiceOrders
        },
      });
    });
  });

  return {
    roomTypeAndRate: arr,
  };
}

/**
 * 将入住单的增值服务转成按日期展示
 */
const transformAddServiceOrdersByDate = (gresRoomTypeVOs) => {
  const addServiceOrdersByDate = {};

  _.forEach(gresRoomTypeVOs, (item) => {
      addServiceOrdersByDate[`_${item.businessDay}`] = item.addServiceOrders;
    }
  )
  return addServiceOrdersByDate;
}

/**
 * 将表单的addServiceOrdersByDate转成接口需要的addServiceOrders,
 * 并挂在roomTypeAndRate节点下
 */
export const getAddServiceOrdersByDate = (roomTypeAndRate, addServiceOrdersByDate, {roomId, gresId}) => {
  return _.map(roomTypeAndRate, (item) => ({
    value: {
      ...item.value,
      addServiceOrders: _.map(_.filter((addServiceOrdersByDate || {})[`_${item.value.businessDay}`], (serviceItem) =>
        serviceItem), (item: any) => ({..._.omit(item,'serviceName'), roomId, gresId}))
    }
  }))
};

/**
 * 根据开始时间，结束时间，获取时间数组
 * @param arrivalDate
 * @param departureDate
 * @returns {any[]}
 */
export const getDateRange = (arrivalDate, departureDate) => {
  const d = moment(departureDate).valueOf();
  const a = moment(arrivalDate).valueOf();

  const remainDayDiff = moment(d).startOf('day').diff(moment(a).startOf('day'), 'days');
  const arr: any[] = [];
  for (let i = 0; i < remainDayDiff; i++) {
    arr.push(moment(a).add(i, 'days').startOf('day').valueOf())
  }

  return arr;
};
