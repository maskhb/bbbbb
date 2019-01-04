/**
 * RoomTypeUpdateVO
 * 更新房型参数对象
 */
export default class RoomTypeUpdateVO {
  /**
   * 房型名
   */
  roomTypeName?: string; 
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 房型Id
   */
  roomTypeId?: number; // int64
}
