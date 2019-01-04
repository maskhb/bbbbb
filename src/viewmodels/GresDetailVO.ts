import _ from 'lodash';
import moment from 'moment';
import { Exclude, Type, Expose, Transform, plainToClassFromExist, classToPlain } from 'class-transformer';
import { GresAccountTotalResp, transformArrivalDate, transformDepartureDate } from './GresDetailResp'

import {
  GresDetailVO,
  GresGuestVO,
  GresRoomTypeVO,
  GresAccountVO,
  RoomTypeBookingVO, GresLogVO, RoomBookingTotalVO, GresAccountTotalVO,
  RoomBookingVO
} from './st';
import { fenToYuan } from "../utils/money";
import { add, mul } from '../utils/number';

export const typeMap = new Map([
  [1, '新增'],
  [2, '编辑'],
  [3, '取消'],
  [4, 'NOSHOW'],
  [5, '延到'],
  [6, '预留房间'],
  [7, '修改预留'],
  [8, '取消预留'],
  [9, '入住'],
  [10, '添加账务'],
  [11, '冲销账务'],
  [12, '退房'],
  [13, '新增套餐服务'],
  [14, '删除套餐服务'],
  [15, '修改套餐服务'],
  [16, '新增增值服务'],
  [17, '删除增值服务'],
  [18, '修改增值服务'],
]);

export const roomStatusMap = new Map([
  [1, '有效预订'],
  [2, '失效预订'],
]);

export const roomGresStatusMap = new Map([
  ['I', '入住'],
  ['WI', '未入住'],
]);

export const accTypeMap = new Map([
  [1, '费用'],
  [2, '收款'],
  [3, '退款'],
]);

export const orderAddAccTypeMap = new Map([
  [2, '收款'],
]);

export const orderEditAccTypeMap = new Map([
  [2, '收款'],
  [3, '退款'],
]);

export const payTypeMap = new Map([
  [0, '现金'],
  [1, '微信'],
  [2, '支付宝'],
  [3, '信用卡'],
  [4, '转账'],
]);

export const receiptTypeMap = new Map([
  [1, '预付款'],
  [2, '押金'],
  [3, '结账收款'],
]);

export const orderAddReceiptTypeMap = new Map([
  [1, '预付款'],
]);

export const orderEditReceiptTypeMap = new Map([
  [1, '预付款'],
  [2, '押金'],
]);

export const roomEditReceiptTypeMap = new Map([
  [1, '预付款'],
  [2, '押金'],
  [3, '结账收款'],
]);


export const teamEditAccTypeMap = accTypeMap;

export const checkInAddAccTypeMap = orderAddAccTypeMap;

export const checkInEditAccTypeMap = accTypeMap;

export const receiptItems = new Map([]);

class GresGuestReq extends GresGuestVO {
}

class GresAccountReq extends GresAccountVO {
  @Exclude()
  payType?: number;

  paymentMethodId?: number;

  @Exclude()
  buildingRoomNo?: string;

  @Exclude()
  accId?: any;
}

class RoomBookingReq extends RoomBookingVO {
}

class GresServiceOrderVO {
  businessDay: number = 0;
  gresId: number = 0;
  unitQty: number = 0;
  roomId: number = 0;
  roomTypeId: number = 0;

  @Expose({ name: 'salePriceFormat' })
  @Transform((value) => {
    return mul(value || 0, 100)
  })
  salePrice: number = 0;
  serviceItemId: number = 0;
  serviceOrderId: number = 0;
}

class GresRoomTypeReq extends GresRoomTypeVO {
  @Exclude()
  rate?: number;

  // @Type(() => GresServiceOrderVO)
  // packageServiceOrders: Array<GresServiceOrderVO> = []
}

/**
 * GresDetailVO
 * 客单主表
 */
export class GresDetailReq extends GresDetailVO {
  @Exclude()
  isCheckIn?: Boolean;

  @Exclude()
  parentLinkRoom?: String;

  @Exclude()
  isPreCheckIn?: Boolean;

  @Exclude()
  rateCodeName?: String;

  @Exclude()
  linkRoomOptions?: any[];

  remainTime?: any;

  @Expose()
  @Type(() => Date)
  set arrivalDepartureDate(value) {
    this.arrivalDate = (value && value[0]) ? transformArrivalDate(value[0]).valueOf() : 0;
    this.departureDate = (value && value[1]) ? transformDepartureDate(value[1]).valueOf() : 0;
  }

  @Expose()
  @Type(() => Date)
  set remainTimeFormat(value) {
    this.remainTime = value ? moment(value).valueOf() : 0;
  }

  set arrMember(value) {
    if (value) {
      this.man = value[0] || 0;
      this.woman = value[1] || 0;
      this.children = value[2] || 0;
    }
  }

  // 房客信息
  @Expose({ name: 'tanantInfo' })
  @Transform((values) => {
    return _.filter(_.map(values, ({ value }) => {
      return _.omit(value, ['id']);
    }), (item = {}) => Object.keys(_.omitBy(item, (value) => {
      return !value;
    })).length > 0)
  })
  @Type(() => GresGuestReq)
  gresGuestVOs: Array<GresGuestReq> = [];

  // 预订房型及房价
  @Expose({ name: 'roomTypeAndRate' })
  @Transform((params) => {
    const { isCheckIn, ...values } = params || {} as any;
    return _.map(
      isCheckIn ? values : _.filter(values, ({ value }) => value && Boolean(value.roomQty)
      ), ({ value }) => {
        let realPrice;
        if (value.realPriceFormat) {
          realPrice = mul(value.realPriceFormat, 100)
        } else if (value.realPriceFormat === 0) {
          realPrice = 0
        } else {
          realPrice = value.stdPrice
        }

        if (isCheckIn) {
          value.roomQty = 1;
        }

        value.packageServiceOrders = (value.packageServiceOrders || []).map((item) =>
          plainToClassFromExist(new GresServiceOrderVO(), { ..._.omit(item,'serviceName'), businessDay: value.businessDay, roomTypeId:value.roomTypeId, unitQty:item.unitQty || 0 }));

          value.addServiceOrders = (value.addServiceOrders || []).map((item) =>
          plainToClassFromExist(new GresServiceOrderVO(), { ..._.omit(item,'serviceName'), businessDay: value.businessDay, roomTypeId:value.roomTypeId, unitQty:item.unitQty || 0  }));

        return {
          ..._.omit(filterFormat(value), 'rate'),
          realPrice
        };
      })
  })
  @Type(() => GresRoomTypeReq)
  gresRoomTypeVOs: Array<GresRoomTypeReq> = [];

  linkRoomIds: string = '';

  set arrLinkRoomIds(value) {
    this.linkRoomIds = value ? value.join(',') : ''
  }

  @Exclude()
  depName?: string;

  @Expose()
  salesDeptId: number = 0;

  set sourceList(value) {
    this.salesDeptId = (_.find(value, (item) => {
      return item.sourceId === this.sourceId
    }) || {}).depId || 0;
  }

  /** 账务信息请求参数 */
  @Expose({ name: 'accountInfo' })
  @Transform((values) => {
    const arr: Array<any> = [];
    _.forEach(values, (item: any) => {

      const { children, accountDetails, ...others } = item;
      const obj = filterFormat(others);
      _.forEach(
        _.filter(children, ({ isDone }) =>
          isDone
        ), (child) => {
          arr.push(_.omit({
            ...obj,
            ...filterFormat(child),
          }, ['buildingRoomNo', 'accId', 'isDone', 'paymentMethodName']))
        });
    });
    return arr;
  })
  gresAccountVOs: Array<GresAccountReq> = [];

  @Exclude()
  gresLogVOs?: GresLogVO[];

  @Exclude()
  roomBookingTotalVOs?: RoomBookingTotalVO[];

  @Exclude()
  gresSelectRoomType?: any[];

  @Exclude()
  gresAccountTotalVOs?: GresAccountTotalVO[];

  @Expose({ name: 'preRoomList' })
  @Transform((values) => {
    let arr: any[] = [];
    _.map(values, (item) => {
      arr = arr.concat(_.map(item.list, (child) => (_.omit({ ...child, roomTypeId: item.roomTypeId }, 'buildingRoomNo'))))
    });

    return arr;
  })
  @Type(() => RoomBookingReq)
  roomBookingVOs: Array<RoomBookingReq> = [];

  @Exclude()
  gresRoomTypeDateVOs?: any[];

  @Type(() => GresServiceOrderVO)
  addServiceOrders: Array<GresServiceOrderVO> = [];

  @Type(() => GresServiceOrderVO)
  assginServiceOrders: Array<GresServiceOrderVO> = [];
}

const filterFormat = (item) => {
  const obj = {};
  _.keys(item).forEach(key => {
    if (!key.match('Format')) {
      obj[key] = item[key];
    }
  });

  return obj;
};


export class RoomTypeBooking extends RoomTypeBookingVO {
  stdPrice?: number;

  @Expose()
  get roomStock() {
    return this.roomQty;
  }

  @Expose()
  get stdPriceFormat() {
    return this.stdPrice ? `¥ ${fenToYuan(this.stdPrice, false)}` : `¥ ${this.stdPrice}`
  }

  businessDay?: number;

  @Expose()
  get businessDayFormat() {
    return this.businessDay ? moment(this.businessDay).format('YYYY-MM-DD') : ''
  }
}

export class RoomTypeBookingResp {
  @Type(() => RoomTypeBooking)
  result: Array<RoomTypeBooking> = [];
}

/**
 * accountVO->accountInfo
 * @param accountInfo
 * @param accountVO
 */
export const transformAccountVOToAccountInfo = (accountInfo, accountVO) => {
  const curItem: any = classToPlain(_.find(accountInfo, (item) => {
    return item.accType === accountVO.accType;
  })) || { accType: accountVO.accType, rateFormat: 0, rate: 0, accountDetails: [] };

  curItem.rateFormat = add(curItem.rateFormat || 0, accountVO.rateFormat || 0);
  accountVO.rate = mul(accountVO.rateFormat || 0, 100);
  curItem.rate = add(curItem.rate || 0, accountVO.rate || 0);
  const accountIndex = _.findIndex(curItem.accountDetails, (item: any) => item.accId === accountVO.accId);
  if (accountIndex === -1) {
    curItem.accountDetails.push(accountVO)
  } else {
    curItem.accountDetails[accountIndex] = accountVO;
  }

  const index = _.findIndex(accountInfo, (item: any) => {
    return item.accType === accountVO.accType;
  });

  const data = plainToClassFromExist(new GresAccountTotalResp(), curItem);

  if (index >= 0) {
    accountInfo[index] = data;
  } else {
    accountInfo.push(data)
  }

  return accountInfo;
};

export const recalAccountInfo = (accountInfo) => {
  _.map(accountInfo, (item) => {
    let count = 0;

    _.map(item.accountDetails, (child) => {
      count = add(count, child.rate);
    });

    item.rate = count;
  });

  return accountInfo;
};

export const getPreRoomList = (roomTypeAndRate) => {
  return _.map(
    _.filter(roomTypeAndRate, (item) => Boolean(item) && Boolean(item.value) && Boolean(item.value.roomQty)),
    ({ value }) => value
  );
};
