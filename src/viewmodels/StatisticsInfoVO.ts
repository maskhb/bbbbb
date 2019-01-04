/**
 * StatisticsInfoVO
 * 统计信息表
 */
export default class StatisticsInfoVO {
  /**
   * 营业结束日期
   */
  businessEndTime?: number; // int64
  /**
   * 营业开始日期
   */
  businessStartTime?: number; // int64
  /**
   * 营业日期
   */
  businessTime?: number; // int64
  /**
   * 本日在住房
   */
  housingToday?: number; // int64
  /**
   * 报表类型（1：日报；2：入住分析）
   */
  type?: number; // int32
  /**
   * 文件路径
   */
  fileUrl?: string; 
  /**
   * 本日收入
   */
  incomeToday?: number; // int64
  /**
   * 
   */
  infoId?: number; // int32
  /**
   * 所属组织，比如阳江恒大御景湾
   */
  orgId?: number; // int64
}
