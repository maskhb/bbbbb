/**
 * RoomOwnerVO
 * 房间业主关联表
 */
import { Type } from 'class-transformer';
import RoomVO from './RoomVO';

export default class RoomOwnerVO {
  /**
   * 证件类型，关联t_tag表(type=docType)
   */
  docType?: number; // int64
  /**
   * 业主姓名
   */
  name?: string; 
  /**
   * 业主电话
   */
  phone?: string; 
  /**
   * 房间id
   */
  roomId?: number; // int64
  /**
   * 更新人
   */
  updatedBy?: number; // int64
  /**
   * 证件号码
   */
  docNo?: string; 
  /**
   * 房间业主id
   */
  roomOwnerId?: number; // int64
  /**
   * 房间列表
   */
  @Type(() => RoomVO)
  roomVO?: RoomVO[]; 
  /**
   * 更新时间
   */
  updatedTime?: number; // int64
  /**
   * 生日
   */
  birthday?: number; // int64
  /**
   * 房间关联名称
   */
  roomPathName?: string; 
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 性别(F:女性，M:男性)
   */
  gender?: string; 
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 创建人
   */
  createdBy?: number; // int64
}
