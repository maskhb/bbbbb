import { Type, Transform,Exclude,Expose } from 'class-transformer';

import IRoomTypeQueryVO from '../interfaces/RoomTypeQueryVO';

import {orgId} from '../../utils/getParams';

export default class RoomTypeQueryVO extends IRoomTypeQueryVO {
  /**
   * 所属组织id
   */
  @Expose()
  orgId:any = () => {
    return orgId()
  };
}
