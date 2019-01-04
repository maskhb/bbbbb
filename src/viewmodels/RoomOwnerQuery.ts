/**
 * RoomOwnerQuery
 * 房间业主表
 */
export default class RoomOwnerQuery {
  /**
   * 业主电话
   */
  phone?: string; 
  /**
   * 房间业主id
   */
  roomOwnerId?: number; // int64
  /**
   * 证件号码
   */
  docNo?: string; 
  /**
   * 证件类型，关联t_tag表(type=docType)
   */
  docType?: number; // int64
  /**
   * 性别(F:女性，M:男性)
   */
  gender?: string; 
  /**
   * 0-未存在  1-已存在
   */
  hasValue?: number; // int32
  /**
   * 0-未删除  1-已删除
   */
  isDelete?: number; // int32
  /**
   * 业主姓名
   */
  name?: string; 
}
