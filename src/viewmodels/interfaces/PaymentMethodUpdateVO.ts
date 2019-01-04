/**
 * PaymentMethodUpdateVO
 * 收款方式数据更新对象
 */
export default class PaymentMethodUpdateVO {
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
   * 状态：0-全部，1-启用，2-禁用
   */
  status?: number; // int32
}
