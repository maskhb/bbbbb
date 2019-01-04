/**
 * PaymentMethodQueryVO
 * 收款方式数据查询对象
 */
export default class PaymentMethodQueryVO {
  /**
   * 每页的数量
   */
  pageSize?: number; // int32
  /**
   * 收款方式名称，模糊查询
   */
  paymentMethodName?: string; 
  /**
   * 状态：0-全部，1-启用，2-禁用
   */
  status?: number; // int32
  /**
   * 当前页,第一页默认1
   */
  currPage?: number; // int32
  /**
   * 排序字段【,】分隔
   */
  orderField: string = ''; 
  /**
   * 默认降序
   */
  orderType: string = ''; 
  /**
   * 所属组织id
   */
  orgId?: number; // int64
}
