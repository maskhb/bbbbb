import { Type, Expose } from 'class-transformer';
import moment from 'moment';
/**
 * StatisticsCondition
 * 统计查询条件
 */
export default class StatisticsCondition {
  /**
   * 营业日期
   */
  @Type(() => Number)
  _businessTime?:number[];
  /**
   * 结束营业日期
   */
  @Expose()
  endBusinessTime() {
    const [,endBusinessTime = undefined] = this._businessTime || [];
    return endBusinessTime ? moment(moment(endBusinessTime).format('YYYY-MM-DD 23:59:59')).valueOf():undefined;
  } // int64
  /**
   * 所属组织，比如阳江恒大御景湾
   */
  orgId?: number; // int64
  /**
   * 开始营业日期
   */
  @Expose()
  startBusinessTime() {
    const [startBusinessTime = undefined] = this._businessTime || [];
    return startBusinessTime ? moment(moment(startBusinessTime).format('YYYY-MM-DD 00:00:00')).valueOf():undefined;

  } // int64
  /**
   * 报表类型（1：日报；2：入住分析）
   */
  type?: number = 2; // int32
}
