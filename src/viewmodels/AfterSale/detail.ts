import * as moment from 'moment';
import { Exclude, Expose, Type, Transform } from 'class-transformer';

import * as Attr from '../../utils/attr/aftersale';
import { fenToYuan } from "../../utils/money";
import { sub } from "../../utils/number";

import { PageInfo } from './list'
import { ApplyInfoVo, WriteLogVo,OrderGoodsVo, OrderGoodsExchangeVo, OrderInfoVO, PaymentRecordVO, RefundIntentionVo  } from './item'
/**
 * ReturnExchangeQueryVO
 * 退货单/换货单查询条件
 */
export class ReturnExchangeQueryVO {

  /**
   * 项目下拉框数组
   */
  @Expose({ name: "project" })
  _project?: number[]; //int32

  /**
   * 申请时间数组
   */
  @Type(() => Number)
  @Expose({ name: "applyTime" })
  private _applyTime?: number[];

  /**
   * 换货子单号
   */
  exchangeOrderSn?: string;
  /**
   * 换货母单号
   */
  exchangeParentOrderSn?: string;
  /**
   * 厂家名称
   */
  factoryName?: string;
  /**
   * 是否有实物退货（1：有实物；2：无实物）
   */
  isHasEntity?: number; // int32
  /**
   * 商家名称
   */
  merchantName?: string;
  /**
   * 子订单编号
   */
  orderSn?: string;
  /**
   * 退货单编号
   */
  returnSn?: string;
  /**
   * （多选）入库状态（0：待入库；1：已入库；2：无需入库）
   */
  returnStatusList?: number /* int32 */ [];
  /**
   * （多选）服务类型，1：退货退款；2：换货；3：仅退款；4：仅退款（超额支付）
   */
  serviceTypeList?: number /* int32 */ [];
  /**
   * 分页
   */
  @Type(() => PageInfo)
  pageInfo?: PageInfo;

  /**
   * 所属项目id
   */
  @Expose()
  communityId() {
    const [,,communityId = undefined] = this._project || [];
    return communityId
  }
  /**
   * 开始时间
   */
  @Expose()
  startTime() {
    const [startTime = undefined] = this._applyTime || [];
    return startTime;
  }
  /**
   * 结束时间
   */
  @Expose()
  endTime() {
    const [,endTime = undefined] = this._applyTime || [];
    return endTime;
  }
}




////////////////////////////////////////////

/**
 * 退货/换货单
 */
export class ReturnExchangeVO {
  /**
   * 售后单ID
   */
  applyOrderId?: number; // int64
  /**
   * 售后申请单编号
   */
  applyOrderSn?: string;
  /**
   * 创建人
   */
  createdByNick?: number; // int64
  /**
   * 申请单申请时间
   */
  createdTime?: number; // int64
  /**
   * 换货子单号
   */
  exchangeOrderSn?: string;
  /**
   * 换货母单号
   */
  exchangeParentOrderSn?: string;
  /**
   * 厂家名称
   */
  factoryName?: string;
  /**
   * 是否有实物退货（1：有实物；2：无实物）
   */
  isHasEntity?: number; // int32
  /**
   * 商家名称
   */
  merchantName?: string;
  /**
   * 子订单id
   */
  orderId?: number; // int64
  /**
   * 子订单编号
   */
  orderSn?: string;
  /**
   * 退款金额
   */
  refundAmount?: number; // int64
  /**
   * 退货单编号
   */
  returnSn?: string;
  /**
   * 入库状态（0：待入库；1：已入库；2：无需入库）
   */
  returnStatus?: number; // int32
  /**
   * 服务类型，1：退货退款；2：换货；3：仅退款；4：仅退款（超额支付）
   */
  serviceType?: number; // int32

  shutDownStatus?: number;

  //入库状态 label
  @Expose()
  returnStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.warehouseStatusOptions)(this.returnStatus);
  }

  //服务类型 label
  @Expose()
  serviceTypeFormat() {
    return Attr.getOptionLabelForValue(Attr.applyServiceTypeOptions)(this.serviceType);
  }

  @Expose()
  shutDownStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.shutDownStatusOptions)(this.shutDownStatus);
  }

  //申请单申请时间 YYYY-MM-DD HH:mm:ss
  @Expose()
  createdTimeFormat() {
    return this.createdTime?moment(this.createdTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }

  //退款金额 元
  @Expose()
  refundAmountFormat() {
    return fenToYuan(this.refundAmount,false)
  }

  //是否有实物退货 label
  @Expose()
  isHasEntityFormat() {
    return Attr.getOptionLabelForValue(Attr.returnOfGoodsTypeOptions)(this.isHasEntity);
  }

  //是否可以进行 退货签收 操作
  @Expose()
  isReturnReceiptOper() {
    return Attr.isToBePutInStorage(this.returnStatus);
  }

  //退货单详情跳转路径
  @Expose()
  returnGoodsDetailsSkipPath() {
    return `#/aftersale/returnbill/detail/${this.returnSn}`;
  }
  //换货单情跳转路径
  @Expose()
  exchangeBillDetailsSkipPath() {
    return `#/aftersale/exchangebill/detail/${this.returnSn}`;
  }
}


/**
 * ApplyOrderDetailVO
 * 售后申请详情
 */
export class ApplyOrderDetailVO {
  /**
   * 审核状态（0：待审核；1：同意退货；2：同意退款；3：同意换货；4：已取消；5：同意线下退款；6：同意线下退货；7：同意线下换货）
   */
  afterSaleStatus?: number; // int32
  /**
   * 售后类型（1：退货退款；2：换货；3：仅退款）
   */
  afterSaleType?: number; // int32
  /**
   * 申请信息
   */
  @Type(() => ApplyInfoVo)
  applyInfoVo?: ApplyInfoVo;
  /**
   * 售后单ID
   */
  applyOrderId?: number; // int64
  /**
   * 售后申请单编号
   */
  applyOrderSn?: string;
  /**
   * 客户备注
   */
  consumerRemark?: string;
  /**
   * 经手人
   */
  createdByNick?: number; // int64
  /**
   * 申请日期
   */
  createdTime?: number; // int64
  /**
   * 客服备注
   */
  customRemark?: string;
  /**
   * 实际退款总金额
   */
  hasRefundAmount?: number; // int64
  /**
   * 商品退货总价
   */
  intentRefundAmount?: number; // int64
  /**
   * 状态处理日志
   */
  @Type(() => WriteLogVo)
  operateLogList?: WriteLogVo[];
  /**
   * 商品信息
   */
  @Type(() => OrderGoodsVo)
  orderGoodsList?: OrderGoodsVo[];

  @Type(() => OrderGoodsExchangeVo)
  orderGoodsExchangeList?: OrderGoodsVo[];
  /**
   * 原单据信息
   */
  @Type(() => OrderInfoVO)
  orderInfoVO?: OrderInfoVO;
  /**
   * 原订单支付记录
   */
  @Type(() => PaymentRecordVO)
  paymentRecordVOList?: PaymentRecordVO[];
  /**
   * 商品退款金额
   */
  refundAmount?: number; // int64
  /**
   * 退款意向/信息
   */
  @Type(() => RefundIntentionVo)
  refundIntentionList?: RefundIntentionVo[];
  /**
   * 退款单号，如果没有生成退款单，则为null
   */
  refundSn?: string;
  /**
   * 退款状态（0：未退款；1：退款中；2：已退款；3：无需退款；4：已取消）
   */
  refundStatus?: number; // int32
  /**
   * 责任归属（1：厂家；2：商家；3：物流；4：业主；5：平台；6：物业）
   */
  responsibility?: number; // int32
  /**
   * 退货原因
   */
  returnReason?: string;
  /**
   * 退货单号，如果没有生成退货单，则为null
   */
  returnSn?: string;
  /**
   * 入库状态（0：待入库；1：已入库；2：无需入库）
   */
  returnStatus?: number; // int32
  /**
   * 退货类型（1：无理由退款；2：有理由退款）
   */
  returnType?: number; // int32
  /**
   * 已结算金额
   */
  settleAmount?: number; // int64
  /**
   * 结算状态（0：未结算；1：已结算）
   */
  settlementStatus?: number; // int32
  /**
   * 换货商品总额
   */
  totalExchangeAmount?: number; // int64
  /**
   * 原商品售后总额
   */
  totalOriginAfterSaleAmount?: number; // int64
  /**
   * 用户名
   */
  userName?: string;

  /**
   * 服务类型，1：退货退款；2：换货；3：仅退款；4：仅退款（超额支付）
   */
  serviceType?: number; // int32

  shutDownStatus?: number;


  /**
   * 申请时间 YYYY-MM-DD HH:mm:ss
   */
  @Expose()
  createdTimeFormat() {
    return this.createdTime?moment(this.createdTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }

  /**
   * 审核状态 label
   */
  @Expose()
  afterSaleStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.afterSaleStatusOptions)(this.afterSaleStatus);
  }

  /**
   * 售后类型 label
   */
  @Expose()
  afterSaleTypeFormat() {
    return Attr.getOptionLabelForValue(Attr.AfterSaleTypeOptions)(this.afterSaleType);
  }

  /**
   * 实际退款总金额 元
   */
  @Expose()
  hasRefundAmountFormat() {
    return fenToYuan(this.hasRefundAmount, false);
  }

  /**
   * 商品退货总价 元
   */
  @Expose()
  intentRefundAmountFormat() {
    return fenToYuan(this.intentRefundAmount, false);
  }

  /**
   * 商品退款金额 元
   */
  @Expose()
  refundAmountFormat() {
    return fenToYuan(this.refundAmount, false);
  }

  /**
   * 退款状态 label
   */
  @Expose()
  refundStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.RefundStatusOptions)(this.refundStatus);
  }

  /**
   * 责任归属 label
   */
  @Expose()
  responsibilityFormat() {
    return Attr.getOptionLabelForValue(Attr.ResponsibilityOptions)(this.responsibility);
  }

  /**
   * 入库状态 label
   */
  @Expose()
  returnStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.warehouseStatusOptions)(this.returnStatus);
  }

  /**
   * 退货类型 label
   */
  @Expose()
  returnTypeFormat() {
    return Attr.getOptionLabelForValue(Attr.ReturnTypeOptions)(this.returnType);
  }

  /**
   * 退货类型 元
   */
  @Expose()
  settleAmountFormat() {
    return fenToYuan(this.settleAmount, false);
  }

  /**
   * 结算状态 label
   */
  @Expose()
  settlementStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.SettlementStatusOptions)(this.settlementStatus);
  }

  /**
   * 换货商品总额 元
   */
  @Expose()
  totalExchangeAmountFormat() {
    return fenToYuan(this.totalExchangeAmount, false);
  }

  /**
   * 原商品售后总额 元
   */
  @Expose()
  totalOriginAfterSaleAmountFormat() {
    return fenToYuan(this.totalOriginAfterSaleAmount, false);
  }

  //服务类型 label
  @Expose()
  serviceTypeFormat() {
    return Attr.getOptionLabelForValue(Attr.applyServiceTypeOptions)(this.serviceType);
  }

  @Expose()
  shutDownStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.shutDownStatusOptions)(this.shutDownStatus);
  }

  //是否生成退款单
  @Expose()
  whetherRefundNoFormat() {
    return this.refundSn ? '已生成' : '未生成';
  }

  //是否生成退货单
  @Expose()
  whetherReturnNoFormat() {
    return this.returnSn ? '已生成' : '未生成';
  }

  //实际差价金额
  @Expose()
  aftersaleActualDifferenceAmount() {
    return fenToYuan(sub(this.totalOriginAfterSaleAmount || 0,this.totalExchangeAmount || 0), false);
  }
}
