/**
 * RoomTypeVO
 * 房型表
 */
export default class RoomTypeVO {
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 状态 1 启用 2 禁用
   */
  status?: number; // int32
  /**
   * 所属门店Id
   */
  orgId?: number; // int64
  /**
   * 所属门店名
   */
  orgName?: string; 
  /**
   * 房间数
   */
  roomQty?: number; // int32
  /**
   * 房型Id
   */
  roomTypeId?: number; // int64
  /**
   * 房型名
   */
  roomTypeName?: string; 
}
