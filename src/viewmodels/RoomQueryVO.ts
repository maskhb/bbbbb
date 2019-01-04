/**
 * RoomQueryVO
 * 房间分页查询对象
 */
import { Type, Transform,Exclude,Expose } from 'class-transformer';

import {
  getOptionLabelForValue,
  stateEnabledOrDisableOptions
} from '../utils/attr/public';
export default class RoomQueryVO {
  /**
   * 楼栋id
   */
  buildingId?: number; // int64
  /**
   * 楼层id
   */
  floorId?: number; // int64
  /**
   * 所属组织id
   */
  orgId?: number; // int64
  /**
   * 每页的数量
   */
  pageSize?: number; // int32
  /**
   * 房间Id）
   */
  roomId?: number; // int64
  /**
   * 状态：0-全部，1-启动，2-禁用
   */
  status?: number; // int32
  //状态 格式化
  @Expose()
  f_status() {
    return getOptionLabelForValue(stateEnabledOrDisableOptions)(this.status)
  }

  //是否显示启用
  @Expose()
  f_showEnable() {
    return this.status !== 1;
  }
  /**
   * 当前页,第一页默认1
   */
  currPage?: number; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField: string = '';
  /**
   * 默认降序
   */
  orderType: string = '';
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 标签id
   */
  roomTagId?: number; // int64
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
}
