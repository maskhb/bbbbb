import * as moment from 'moment';
import { Exclude, Expose, Type, Transform } from 'class-transformer';

import * as Attr from '../../utils/attr/aftersale';
import { fenToYuan } from "../../utils/money";

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
 * OrderGoodsVo
 * 售后订单商品
 */
export class OrderGoodsExchangeVo {
  /**
   * 售后总数
   */
  exchangeNum?: number; // int32
  /**
   * 售后单价
   */
  exchangeUnitPrice?: number; // int64
  applyOrderId?: number; // int64
  /**
   * 成交单价
   */
  orderGoodsExchangeId?: number; // int64
  orderGoodsExchangeSn?: string;
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
  exchangeUnitPriceFormat() {
    return fenToYuan(this.exchangeUnitPrice, false);
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
