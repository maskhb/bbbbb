import { Type, Transform,Exclude,Expose } from 'class-transformer';

import IPaymentMethodQueryVO from '../interfaces/PaymentMethodQueryVO';

import {orgId} from '../../utils/getParams';

export default class PaymentMethodQueryVO extends IPaymentMethodQueryVO {
  /**
   * 所属组织id
   */
  @Expose()
  orgId:any = () => {
    return orgId()
  };
}
