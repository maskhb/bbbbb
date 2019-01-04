/**
 * PaymentItemUpdateVO
 * 收费类目数据更新对象
 */
export default class PaymentItemUpdateVO {
  /**
   * 收费类目组织Id
   */
  paymentItemOrgId?: number; // int64
  /**
   * 自定义收费类目名称
   */
  paymentItemOtherName?: string;
  /**
   * 优先级
   */
  sort?: number; // int32
  /**
   * 状态：0-全部，1-启用，2-禁用
   */
  status: number = 1; // int32
}
