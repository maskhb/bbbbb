import * as moment from 'moment';
import { Exclude, Expose, Type, Transform } from 'class-transformer';

import * as Attr from '../../utils/attr/aftersale';
import { fenToYuan } from "../../utils/money";

////////////////////////////////////////////

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
    const [endTime = undefined] = this._applyTime || [];
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
    // TODO wuhao mock数据不正确，暂时进行相反判断
    return !Attr.isToBePutInStorage(this.isHasEntity);
  }

  //退货单详情跳转路径
  @Expose()
  returnGoodsDetailsSkipPath() {
    return `#/aftersale/returnbill/detail/${this.returnSn}`;
  }
}

/**
 * 退货/换货单列表
 */
export class ReturnExchangeList {
  @Type(() => ReturnExchangeVO)
  list?: ReturnExchangeVO[]
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
}
/**
 * ApplyInfoVo
 * 售后单申请信息
 */
export class ApplyInfoVo {
  applyInfoId?: number; // int64
  /**
   * 售后申请单ID
   */
  applyOrderId?: number; // int64
  /**
   * 联系人
   */
  contact?: string;
  /**
   * 联系电话
   */
  contactPhone?: string;
  /**
   * 快递名称
   */
  courierName?: string;
  /**
   * 快递单号
   */
  courierNum?: string;
  /**
   * 发货信息：联系人
   */
  deliveryContact?: string;
  /**
   * 发货信息：联系电话
   */
  deliveryContactPhone?: string;
  /**
   * 配送方式（1：物流配送；2：快递配送）
   */
  distributionType?: number; // int32
  /**
   * 配送运费
   */
  freight?: number; // int32
  /**
   * 运费承担方（1：商家；2：客户）
   */
  freightType?: number; // int32
  /**
   * 上门取件地址
   */
  pickupAddress?: string;
  /**
   * 配送要求
   */
  requirement?: string;
  /**
   * 商品返回方式（1：客户寄回；2：上门取货）
   */
  returnWay?: number; // int32

  /**
   * 配送方式 label
   */
  @Expose()
  distributionTypeFormat() {
    return Attr.getOptionLabelForValue(Attr.DistributionTypeOptions)(this.distributionType);
  }

  /**
   * 运费承担方
   */
  @Expose()
  freightTypeFormat() {
    return Attr.getOptionLabelForValue(Attr.FreightTypeOptions)(this.freightType);
  }

  /**
   * 商品返回方式 label
   */
  @Expose()
  returnWayFormat() {
    return Attr.getOptionLabelForValue(Attr.ReturnWayOptions)(this.returnWay);
  }
}

/**
 * OrderInfoVO
 * 原单据信息
 */
export class OrderInfoVO {
  /**
   * 收货人手机
   */
  consigneeMobile?: string;
  /**
   * 收货人姓名
   */
  consigneeName?: string;
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 配送方式，1：免费配送
   */
  deliveryMethod?: number; // int32
  /**
   * 详细地址
   */
  detailedAddress?: string;
  /**
   * 所属商家名称
   */
  merchantName?: string;
  /**
   * 订单金额（已付）
   */
  orderAmountPaid?: number; // int64
  /**
   * 订单编号
   */
  orderSn?: string;
  /**
   * 订单状态,1：待支付，2：待审核，3：待付尾款，4：待发货，5：待收货，6：已完成，7：已取消
   */
  orderStatus?: number; // int32
  /**
   * 下单用户昵称
   */
  userNickname?: string;

  /**
   * 配送方式
   */
  @Expose()
  deliveryMethodFormat() {
    return Attr.getOptionLabelForValue(Attr.DeliveryMethodOptions)(this.deliveryMethod);
  }

  /**
   * 订单金额（已付） 元
   */
  @Expose()
  orderAmountPaidFormat() {
    return fenToYuan(this.orderAmountPaid, false);
  }

  /**
   * 订单状态 label
   */
  @Expose()
  orderStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.OrderStatusOptions)(this.orderStatus);
  }

  /**
   * 创建时间
   */
  @Expose()
  createdTimeFormat() {
    return this.createdTime?moment(this.createdTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }
}

/**
 * OrderGoodsVo
 * 售后订单商品
 */
export class OrderGoodsVo {
  /**
   * 售后总数
   */
  afterSaleNum?: number; // int32
  /**
   * 售后单价
   */
  afterSaleUnitPrice?: number; // int64
  applyOrderId?: number; // int64
  /**
   * 成交单价
   */
  dealUnitPrice?: number; // int64
  goodsId?: number; // int64
  /**
   * 商品名称
   */
  goodsName?: string;
  /**
   * 商品数量
   */
  goodsNum?: number; // int32
  /**
   * 规格属性
   */
  goodsPropertis?: string;
  goodsUrl?: string;
  orderGoodsId?: number; // int64
  /**
   * 销售单价
   */
  saleUnitPrice?: number; // int64
  /**
   * 签收时间
   */
  signTime?: number; // int64
  skuId?: number; // int64

  /**
   * 售后单价 元
   */
  @Expose()
  afterSaleUnitPriceFormat() {
    return fenToYuan(this.afterSaleUnitPrice, false);
  }

  /**
   * 成交单价 元
   */
  @Expose()
  dealUnitPriceFormat() {
    return fenToYuan(this.dealUnitPrice, false);
  }

  /**
   * 销售单价 元
   */
  @Expose()
  saleUnitPriceFormat() {
    return fenToYuan(this.saleUnitPrice, false)
  }

  /**
   * 签收时间 YYYY-MM-DD HH:mm:ss
   */
  @Expose()
  signTimeFormat() {
    return this.signTime?moment(this.signTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }
}

/**
 * PaymentRecordVO
 * 订单支付记录
 */
export class PaymentRecordVO {
  /**
   * 已付金额
   */
  amountPaid?: number; // int64
  /**
   * 支付方式名称
   */
  paymentMethodName?: string;
  /**
   * 支付状态，1：未支付，2：已支付
   */
  status?: number; // int32

  /**
   * 已付金额 元
   */
  @Expose()
  amountPaidFormat() {
    return fenToYuan(this.amountPaid, false);
  }

  @Expose()
  statusFormat() {
    return Attr.getOptionLabelForValue(Attr.PayStatusOptions)(this.status);
  }
}

/**
 * RefundIntentionVo
 * 退款意向
 */
export class RefundIntentionVo {
  /**
   * 账户名称
   */
  accountName?: string;
  /**
   * 售后单ID
   */
  applyOrderId?: number; // int64
  /**
   * 银行账号
   */
  bankAccount?: string;
  /**
   * 银行名称
   */
  bankName?: string;
  /**
   * 创建人ID
   */
  createdBy?: number; // int64
  /**
   * 创建时间
   */
  createdTime?: number; // int64
  /**
   * 过期时间
   */
  expiryTime?: number; // int64
  /**
   * 已经退款金额
   */
  hasRefundAmount?: number; // int64
  /**
   * 意向退款金额
   */
  intentRefundAmount?: number; // int64
  /**
   * 是否已删除（0：否；1：是）
   */
  isDelete?: number; // int32
  /**
   * 支付方式编码
   */
  paymentMethodCode?: string;
  /**
   * 退款意向ID
   */
  refundIntentionId?: number; // int64
  /**
   * 退款状态（0：未退款；1：退款中；2：已退款；3：无需退款；4：已取消）
   */
  refundStatus?: number; // int32
  /**
   * 退款时间
   */
  refundTime?: number; // int64
  /**
   * 退款备注
   */
  remark?: string;
  /**
   * 交易流水号
   */
  transactionId?: string;

  /**
   * 是否已删除 label
   */
  @Expose()
  isDeleteFormat() {
    return Attr.getOptionLabelForValue(Attr.IsDeleteOptions)(this.isDelete);
  }

  /**
   * 退款状态 label
   */
  @Expose()
  refundStatusFormat() {
    return Attr.getOptionLabelForValue(Attr.RefundStatusOptions)(this.refundStatus);
  }

  /**
   * 已经退款金额 元
   */
  @Expose()
  hasRefundAmountFormat() {
    return fenToYuan(this.hasRefundAmount, false);
  }

  /**
   * 意向退款金额 元
   */
  @Expose()
  intentRefundAmountFormat() {
    return fenToYuan(this.intentRefundAmount, false);
  }

  /**
   * 退款时间 YYYY-MM-DD HH:mm:ss
   */
  @Expose()
  refundTimeFormat() {
    return this.refundTime?moment(this.refundTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }

  /**
   * 过期时间
   */
  @Expose()
  expiryTimeFormat() {
    return this.expiryTime?moment(this.expiryTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }

  /**
   * 创建时间
   */
  @Expose()
  createdTimeFormat() {
    return this.createdTime?moment(this.createdTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }
}

/**
 * WriteLogVo
 * 操作日志封装对象
 */
export class WriteLogVo {
  /**
   * 操作后
   */
  afterOperation?: string;
  /**
   * 操作前
   */
  beforeOperation?: string;
  /**
   * 业务类型描述
   */
  businessName?: string;
  /**
   * 业务类型
   */
  businessType?: string;
  /**
   * 创建人ID
   */
  createdBy?: number; // int64
  /**
   * 操作时间
   */
  createdTime?: number; // int64
  /**
   * 扩展信息
   */
  extendedInfo?: string;
  /**
   * 日志ID
   */
  logId?: number; // int64
  /**
   * 登陆账号
   */
  loginName?: string;
  /**
   * 被操作者
   */
  passiveOperator?: string;
  /**
   * 备注
   */
  remarks?: string;
  /**
   * 业务子类型描述
   */
  subtypesName?: string;
  /**
   * 业务子类型
   */
  subtypesType?: string;

  /**
   * 操作时间 YYYY-MM-DD HH:mm:ss
   */
  @Expose()
  createdTimeFormat() {
    return this.createdTime?moment(this.createdTime).format("YYYY-MM-DD HH:mm:ss"):null;
  }
}
