import { IsPositive, ValidateNested, IsIn, IsNumber, IsDefined } from 'class-validator';
import { Exclude, Type, Expose, Transform } from 'class-transformer';
import { fenToYuan } from '../utils/money';
import { mul } from '../utils/number';

/**
 * 套餐类
 */
class GresVO {
  arrivalDate:number = 0;
  beginArrivalDate:number = 0;
  beginCreatedTime:number = 0;
  beginDepartureDate:number = 0;
  children:number = 0;
  createdBy:number = 0;
  createdTime:number = 0;
  departureDate:number = 0;
  endArrivalDate:number = 0;
  endCreatedTime:number = 0;
  endDepartureDate:number = 0;
  gender:string = '';
  gresId:number = 0;
  gresNo:number = 0; // 在登记单管理里面，gresNo就是登记单; 在预订单里面，gresNo就是预订单号
  gresType:number = 0;
  groupName:string = '';
  guestName:string = '';
  isDelete:number = 0;
  linkId:number = 0;
  linkRooms:string = '';
  man:number = 0;
  memo:string = '';
  orgId:number = 0;
  parentGresNo:number = 0; // 在登记单管理里面, parentGresNo是预订单号
  parentId:number = 0;
  phone:string = '';
  rateCodeId:number = 0;
  remainTime:number = 0;
  resType:number = 0;
  roomId:number = 0;
  roomNo:string = '';
  roomRate:number = 0;
  salesDeptId:number = 0;
  sourceId:number = 0;
  status:string = '';
  updatedBy:number = 0;
  updatedTime:number = 0;
  woman:number = 0;
}


export class GresPageVO {
  currPage: number = 0;
  @ValidateNested()
  gresVO = new GresVO();
  orderField: string = '';
  orderType: string = '';
  pageSize: number = 0
}
