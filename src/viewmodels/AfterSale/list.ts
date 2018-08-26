
import { Exclude, Expose, Type, Transform } from 'class-transformer';

import {ReturnExchangeVO, ApplyOrderDetailVO } from './detail'
/**
 * 分页对象
 */
export class PageInfo {
  /**
   * 页码
   */
  currPage?: number;// int32
  /**
   * 每页条数
   */
  pageSize?: number;// int32
}


/**
 * 退货/换货单列表
 */
export class ReturnExchangeList {
  @Type(() => ReturnExchangeVO)
  list?: ReturnExchangeVO[]
}

export class ApplyAfterOrderList {
  @Type(() => ApplyOrderDetailVO)
  list?: ApplyOrderDetailVO[]
}
