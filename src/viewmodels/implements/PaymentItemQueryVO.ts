import { Type, Transform,Exclude,Expose } from 'class-transformer';

import IPaymentItemQueryVO from '../interfaces/PaymentItemQueryVO';

import {orgId} from '../../utils/getParams';

export default class PaymentItemQueryVO extends IPaymentItemQueryVO {
  /**
   * 所属组织id
   */
  @Expose()
  orgId:any = () => {
    return orgId()
  };
}
