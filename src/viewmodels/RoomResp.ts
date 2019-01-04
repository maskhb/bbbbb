import {RoomVO} from './st';
import {Expose, Type} from 'class-transformer';

class RoomVOExtend extends RoomVO{
  buildingRoomNo?:string;

  @Expose()
  get value(){
    return this.roomId;
  }

  @Expose()
  get label(){
    return this.buildingRoomNo;
  }
}

export default class RoomResp{
  @Type(() => RoomVOExtend)
  result:RoomVOExtend[] = [];
}
