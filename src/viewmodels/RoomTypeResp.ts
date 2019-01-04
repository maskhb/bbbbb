import {RoomTypeVO} from './st'
import {Expose, Type} from "class-transformer";

class RoomTypeVOResp extends RoomTypeVO{
  @Expose()
  get value(){
    return this.roomTypeId;
  }

  @Expose()
  get label(){
    return this.roomTypeName;
  }
}

class RoomTypeResp {
  @Type(() => RoomTypeVOResp)
  dataList:RoomTypeVOResp[]=[];
}

export default RoomTypeResp
