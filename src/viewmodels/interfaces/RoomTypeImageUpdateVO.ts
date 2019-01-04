/**
 * RoomTypeImageUpdateVO
 * 更新房型图片信息参数对象
 */
export default class RoomTypeImageUpdateVO {
  /**
   * 房型Id
   */
  roomTypeId?: number; // int64
  /**
   * 房型图片URL，按顺序传
   */
  images?: Array<string>; 
}
