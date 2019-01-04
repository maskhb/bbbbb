import { Type, Transform,Exclude,Expose } from 'class-transformer';

import IPaymentItemExtendVO from '../interfaces/PaymentItemExtendVO';

import {
  getOptionLabelForValue,
  stateAvailableOrUnavailable
} from '../../utils/attr/public';

export default class PaymentItemExtendVO extends IPaymentItemExtendVO {
  //状态 格式化
  @Expose()
  f_status() {
    return getOptionLabelForValue(stateAvailableOrUnavailable)(this.status)
  }
}
