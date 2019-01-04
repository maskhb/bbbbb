import { Type, Transform,Exclude,Expose } from 'class-transformer';

import IRoomTypeVO from '../interfaces/RoomTypeVO';

import {
  getOptionLabelForValue,
  stateEnabledOrDisableOptions
} from '../../utils/attr/public';
export default class RoomTypeVO extends IRoomTypeVO {
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
}
