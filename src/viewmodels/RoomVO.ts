/**
 * RoomVO
 * 房间表
 */
import { Type } from 'class-transformer';
import RoomOwnerQuery from './RoomOwnerQuery';
import RoomTagExtendVO from './RoomTagExtendVO';

export default class RoomVO {
  /**
   * 分机号
   */
  phone?: string;
  /**
   * 省市
   */
  regionNamePath?: string;
  /**
   * 楼层业主
   */
  @Type(() => RoomOwnerQuery)
  roomOwners?: RoomOwnerQuery[];
  /**
   * 所属门店Id
   */
  orgId?: number; // int64
  /**
   * 楼层id
   */
  floorId?: number; // int64
  /**
   * 所属门店
   */
  orgName?: string;
  /**
   * 楼层标签
   */
  @Type(() => RoomTagExtendVO)
  roomTags?: RoomTagExtendVO[];
  /**
   * 楼层标签名
   */
  roomTagsName?: string;
  /**
   * 房型id
   */
  roomTypeId?: number; // int64
  /**
   * 状态: 1 启用, 2 禁用
   */
  status?: number; // int32
  /**
   * 楼栋
   */
  buildingName?: string;
  /**
   * 房间描述
   */
  roomDescription?: string;
  /**
   * 房间号（房间名称）
   */
  roomNo?: string;
  /**
   * 状态: 启用, 禁用
   */
  statusName?: string;
  /**
   * 楼栋+房间号
   */
  buildingRoomNo?: string;
  /**
   * 楼层
   */
  floorName?: string;
  /**
   * 省市地址Id
   */
  regionId?: number; // int64
  /**
   * 房间Id
   */
  roomId?: number; // int64
  /**
   * 楼栋id
   */
  buildingId?: number; // int64
}
