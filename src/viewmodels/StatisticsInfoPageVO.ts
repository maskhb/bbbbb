/**
 * StatisticsInfoPageVO
 * 查询分页参数对象封装对象
 */
import StatisticsCondition  from './StatisticsCondition';
import {transformPageModal} from '../utils/transform';
import { Type, Transform, Exclude, Expose } from 'class-transformer';
@Exclude({toClassOnly:true})
export default class StatisticsInfoPageVO {
  /**
   * 当前页,第一页默认1
   */
  @Expose()
  currPage?: number; // int32
  /**
   * 排序字段【,】分隔
   */
  @Expose()
  orderField: string = '';
  /**
   * 默认降序
   */
  @Expose()
  orderType: string = '';
  /**
   * 每页的数量
   */
  @Expose()
  pageSize?: number; // int32
  /**
   * 统计信息表
   */
  @Expose()
  @Transform((value,obj) =>{return transformPageModal(obj, new StatisticsCondition());},{toClassOnly:true})
  statisticsCondition: StatisticsCondition = new StatisticsCondition();
}
