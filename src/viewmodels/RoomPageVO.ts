import { Expose, Exclude } from "class-transformer";
import {orgId} from '../utils/getParams';

/**
 * RoomPageVO
 * 查询分页参数对象封装对象
 */
export default class RoomPageVO {
  /**
   * 所属组织id
   */
  @Expose()
  orgId:any = () => {
    return orgId()
  };
  /**
   * 分机号
   */
  phone?: string;
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 房型名称
   */
  roomTypeName?: string;
  /**
   * 状态 1 启用 2 禁用
   */
  @Expose()
  status () {
    return this._status || 0;
  }

  _status?: number; // int32
  /**
   * 楼栋id
   */
  buildingId?: number; // int64
  /**
   * 楼栋名称
   */
  buildingName?: string;
  /**
   * 所在楼层名称
   */
  floorName?: string;
  /**
   * 排序字段【,】分隔
   */
  orderField: string = '';
  /**
   * 默认降序
   */
  orderType: string = '';
  /**
   * 每页的数量
   */
  pageSize?: number; // int32
  /**
   * 房间Id
   */
  roomId?: number; // int64
  /**
   * 当前页,第一页默认1
   */
  currPage?: number; // int32
  /**
   * 楼层id
   */
  floorId?: number; // int64
  /**
   * 所属门店名称
   */
  orgName?: string;
  /**
   * 楼层标签，多个用英文逗号隔开
   */
  roomTagNames?: string;
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
}
