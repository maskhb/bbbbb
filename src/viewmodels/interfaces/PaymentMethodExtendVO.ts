/**
 * PaymentMethodExtendVO
 * 收款方式分页返回对象
 */
export default class PaymentMethodExtendVO {
  /**
   * 收款方式设置Id
   */
  paymentMethodId?: number; // int64
  /**
   * 收款方式名称
   */
  paymentMethodName?: string; 
  /**
   * 组织收款方式设置Id
   */
  paymentMethodOrgId?: number; // int64
  /**
   * 自定义收款方式名称
   */
  paymentMethodOtherName?: string; 
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 1-启用   2-禁用
   */
  status?: number; // int32
  /**
   * 所属门店名称
   */
  orgName?: string; 
}
