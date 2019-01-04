import { Type, Transform,Exclude,Expose } from 'class-transformer';

import IPaymentMethodExtendVO from '../interfaces/PaymentMethodExtendVO';

import {
  getOptionLabelForValue,
  stateAvailableOrUnavailable
} from '../../utils/attr/public';

export default class PaymentMethodExtendVO extends IPaymentMethodExtendVO {

  //状态 格式化
  @Expose()
  f_status() {
    return getOptionLabelForValue(stateAvailableOrUnavailable)(this.status)
  }
}
