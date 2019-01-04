/**
 * PaymentItemExtendVO
 * 收费类目分页查询返回结果
 */
export default class PaymentItemExtendVO {
  /**
   * 所属门店名称
   */
  orgName?: string;
  /**
   * 收费类目Id
   */
  paymentItemId?: number; // int64
  /**
   * 收费类目名称
   */
  paymentItemName?: string;
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
   * 1-启用   2-禁用
   */
  status?: number; // int32

  /**
   * 是否是房费 1-是
   */
  isRoomRate?: number; // int32
}
