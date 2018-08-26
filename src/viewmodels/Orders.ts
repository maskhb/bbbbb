/// <reference types="lodash" />
import { Expose, Type,Transform } from 'class-transformer';
import moment from "moment";
import _ from 'lodash';
import * as status from '../views/Order/attr';
import { fenToYuan } from "../utils/money";
import { add, sub, mul } from "../utils/number";

const goodsDefault = require('../assets/goods_default.png');

class OrderAction {
  "action": number = 0;
  "time": number = 0;
}

class OrderGood {
  "goodsId": number = 0;
  "skuId": number = 0;
  "goodsType": number = 0;
  @Transform(value=>value || goodsDefault)
  "mainImgUrl": string = '';
  "goodsName": string = '';
  "marketPrice": number = 0;
  "salePrice": number = 0;
  "goodsNum": number = 0;
  "propertyValue": string = '';
  "merchantDiscount": number = 0;
  "platformCoupon": number = 0;
  "merchantCoupon": number = 0;
  "platformFullDiscount": number = 0;
  "merchantFullDiscount": number = 0;
  "goodsAmount": number = 0;
  "shouldPayAmount": number = 0;

  "finalPrice": number = 0;
  "receiptTime": number = 0;

  @Expose()
  marketPriceFormat() {
    const val = this.marketPrice;
    return fenToYuan(val, false);
  }

  @Expose()
  salePriceFormat() {
    const val = this.salePrice;
    return fenToYuan(val, false);
  }

  @Expose()
  goodsAmountFormat() {
    const val = this.goodsAmount;
    return fenToYuan(val, false);
  }

  @Expose()
  shouldPayAmountFormat() {
    const val = this.shouldPayAmount;
    return fenToYuan(val, false);
  }

  @Expose()
  merchantDiscountFormat() {
    const amount = fenToYuan(this.merchantDiscount, false);
    return this.merchantDiscount > 0 ? `-${amount}` : amount;
  }


  @Expose()
  finalPriceFormat() {
    const val = this.finalPrice;
    return fenToYuan(val, false);
  }

  @Expose()
  receiptTimeFormat() {
    const val = this.receiptTime;
    return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
  }

  /**
   * 商品总额
   */
  @Expose()
  goodsTotalSumFormat() {
    return fenToYuan(mul(this.goodsNum, this.finalPrice), false);
  }

  @Expose()
  get merchantFullDiscountFormat() {
    const amount = fenToYuan(this.merchantFullDiscount,false);
    return this.merchantFullDiscount > 0 ? `-${amount}` : amount;
  }

  @Expose()
  get merchantCouponFormat() {
    const amount = fenToYuan(this.merchantCoupon,false);
    return this.merchantCoupon > 0 ? `-${amount}` : amount;
  }

  @Expose()
  get platformFullDiscountFormat() {
    const amount = fenToYuan(this.platformFullDiscount,false);
    return this.platformFullDiscount > 0 ? `-${amount}` : amount;
  }

  @Expose()
  get platformCouponFormat() {
    const amount = fenToYuan(this.platformCoupon,false);
    return this.platformCoupon > 0 ? `-${amount}` : amount;
  }

}

class ReceiptVO {
  "consigneeName": string = '';
  "consigneeMobile": string = '';
  "regionName": string = '';
  "provinceId": number = 0;
  "cityId": number = 0;
  "areaId": number = 0;
  "detailedAddress": string = '';
  "deliveryType": number = 0;
  "deliveryMethod": number = 0;
  "userRemark": string = '';
  "shippedTime": number = 0;
  "receiptTime": number = 0;

  @Expose()
  detailedAddressShowFormat() {
    return `${this.regionName || ''}${this.detailedAddress || ''}`
  }
}

class InvoiceVO {
  "type": number = 0;
  "title": string = '';
  "taxId": string = '';
  "content": string = '';
}

export class PaymentRecordVO {
  "payOrder": string = '';
  "transactionId": string = '';
  "thirdPartTransactionId": string = '';
  "amount": number = 0;
  "amountPaid": number = 0;
  "status": number = 0;
  "finishPaidTime": number = 0;
  "paymentMethodName": string = '';
  "paymentMethodCode": string = '';

  @Expose()
  statusFormat() {
    const val = this.status;
    return (_.find(status.payStatusOptions, (item) => {
      return item.value === val;
    }) || {}).label;
  }

  @Expose()
  finishPaidTimeFormat() {
    const val = this.finishPaidTime;
    return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
  }

  @Expose()
  amountFormat() {
    const val = this.amount;
    return fenToYuan(val, false);
  }

  @Expose()
  amountPaidFormat() {
    const val = this.amountPaid;
    return fenToYuan(val, false);
  }
}

export class LogisticsVO {
  @Type(() => OrderGood)
  "orderGoodsVOList":OrderGood[]
}

export class RefundVO {
  "createdTime": number = 0;
  "hasRefundAmount": number = 0;
  "refundAmount": number = 0;
  "refundMethod": string = '';
  "refundSn": string ='';
  "refundStatus": number = 0;
  "refundTime": number = 0;

  @Expose()
  createdTimeFormat() {
    const val = this.createdTime;
    return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
  }

  @Expose()
  refundTimeFormat() {
    const val = this.refundTime;
    return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
  }

  @Expose()
  hasRefundAmountFormat() {
    return fenToYuan(this.hasRefundAmount, false);
  }

  @Expose()
  refundAmountFormat() {
    return fenToYuan(this.refundAmount, false);
  }

  @Expose()
  refundStatusFormat() {
    const refundStatusOptions = [
      {
        value: 0,
        label: "未退款"
      },
      {
        value: 1,
        label: "退款中"
      },
      {
        value: 2,
        label: "已退款"
      },
      {
        value: 3,
        label: "无需退款"
      },
      {
        value: 4,
        label: "已取消"
      }
    ];
    return status.getOptionLabelForValue(refundStatusOptions)(this.refundStatus);
  }

  @Expose()
  showRefundNoDetailFormat() {
    return `#/aftersale/refund/detail/${this.refundSn}`
  }
}

export class Detail {
  "cancelRemark": string = '';
  "communityId": number = 0;
  "communityName": string = '';
  "couponAmount": number = 0;
  "createdBy": number = 0;
  "createdTime": number = 0;
  "depositAmount": number = 0;
  "depositAmountPaid": number = 0;
  "excessPay": number = 0;
  "factoryName": string = '';
  "factoryRemark": string = '';
  "fullDiscountAmount": number = 0;
  "invoiceVO": InvoiceVO;
  "merchantDiscountAmount": number = 0;
  "merchantName": string = '';
  "needInvoice": number = 0;
  "orderActionVOList": OrderAction[];
  "orderAmount": number = 0;
  "orderAmountPaid": number = 0;
  "orderAmountReal": number = 0;
  @Type(() => OrderGood)
  "orderGoodsVOList": OrderGood[];
  @Type(() => OrderGood)
  "orderGoodsList": OrderGood[];
  @Type(() => OrderGood)
  "orderGoodsExchangeList"?: OrderGood[];
  "orderId": number = 0;
  "orderRemark": string = '';
  "orderSn": string = '';
  "orderSource": number = 0;
  "orderStatus": number = 0;
  "paidTime": number = 0;
  "parentOrderSn": string = '';
  "payStatus": number = 0;
  @Type(() => PaymentRecordVO)
  "paymentRecordVOList": PaymentRecordVO[];
  "preDepositAmount": number = 0;
  @Type(() => ReceiptVO)
  "receiptVO": ReceiptVO;
  "remainAmount": number = 0;
  "remainAmountPaid": number = 0;
  "sellerRemark": string = '';
  "settleStatus": number = 0;
  "transportFee": number = 0;
  "userId": number = 0;
  "userMobile": string = '';
  "userName": string = '';
  "userNickname": string = '';
  "walletAmount": number = 0;
  "intentRefundAmount": number = 0;
  "hasRefundAmount": number = 0;
  "depositExcessAmount": number = 0;
  @Type(() => LogisticsVO)
  "logisticsVOList":LogisticsVO[];
  "merchantFullDiscount": number = 0;
  "merchantCoupon": number = 0;
  "platformFullDiscount": number = 0;
  "platformCoupon": number = 0;
  "afterSaleTag": number = 0; // 是否有售后 1:否 2:是
  "settleAmount": number = 0; //结算金额
  "totalAfterSaleAmount": number = 0;//原商品售后总额
  "totalExchangeAmount": number = 0; //原订单换货金额
  "refundAmount": number = 0;
  @Type(() => RefundVO)
  "refundVOList": RefundVO[];
  "packageDiscountAmount": number = 0; //套餐优惠


  @Expose()
  get orderStatusFormat() {
    return status.getOptionLabelForValue(status.orderStatusOptions)(this.orderStatus);
  }

  @Expose()
  get paidTimeFormat() {
    return this.paidTime ? moment(this.paidTime).format('YYYY-MM-DD HH:mm:ss') : '';
  }

  @Expose()
  get createdTimeFormat(){
    return this.createdTime ? moment(this.createdTime).format('YYYY-MM-DD HH:mm:ss') : '';
  }

  @Expose()
  get payStatusFormat() {
    return (_.find(status.payStatusOptions,
      (item: any) => {
        return item.value === this.payStatus;
      }) || {}).label;
  }

  @Expose()
  get orderAmountFormat() {
    return fenToYuan(this.orderAmount, false);
  }

  @Expose()
  get merchantDiscountAmountFormat() {
    const amount = fenToYuan(this.merchantDiscountAmount, false);
    return this.merchantDiscountAmount > 0 ? `-${amount}` : amount;
  }

  @Expose()
  get orderAmountRealFormat() {
    return fenToYuan(this.orderAmountReal, false);
  }

  @Expose()
  get transportFeeFormat() {
    return fenToYuan(this.transportFee, false);
  }

  @Expose()
  get orderAmountPaidFormat() {
    return fenToYuan(this.orderAmountPaid, false);
  }

  // 订单金额  商品总额+运费
  @Expose()
  get orderTotalFormat() {
    return fenToYuan(add(this.orderAmount, this.transportFee), false);
  }

  // 待付金额  待付金额=实付金额-已付金额
  @Expose()
  get waitTotalFormat() {
    return fenToYuan(sub(this.orderAmountReal, this.orderAmountPaid), false);
  }

  @Expose()
  get depositAmountFormat() {
    return fenToYuan(this.depositAmount, false);
  }

  @Expose()
  get depositAmountPaidFormat() {
    return fenToYuan(this.depositAmountPaid, false);
  }

  //待付定金  待付定金=实付金额-已付订金
  @Expose()
  get waitDepositAmountFormat() {
    return fenToYuan(sub(this.orderAmountReal, this.depositAmountPaid), false);
  }

  @Expose()
  get remainAmountFormat() {
    return fenToYuan(this.remainAmount, false);
  }

  @Expose()
  get remainAmountPaidFormat() {
    return fenToYuan(this.remainAmountPaid, false);
  }

  //待付尾款  待付尾款=实付金额-已付订金-已付尾款-已付订金+定金超额
  @Expose()
  get waitRemainAmountFormat() {
    return fenToYuan(add(sub(sub(this.orderAmountReal, this.remainAmountPaid),this.depositAmountPaid),this.depositExcessAmount), false);
  }

  @Expose()
  get intentRefundAmountFormat() {
    return fenToYuan(this.intentRefundAmount, false);
  }

  @Expose()
  get hasRefundAmountFormat() {
    return fenToYuan(this.hasRefundAmount, false);
  }

  @Expose()
  get depositExcessAmountFormat() {
    return fenToYuan(this.depositExcessAmount, false);
  }

  @Expose()
  get settleStatusFormat() {
    return status.getOptionLabelForValue(status.settleStatusOptions)(this.settleStatus);
  }

  @Expose()
  get merchantFullDiscountFormat() {
    const amount = fenToYuan(this.merchantFullDiscount,false);
    return this.merchantFullDiscount > 0 ? `-${amount}` : amount;
  }

  @Expose()
  get merchantCouponFormat() {
    const amount = fenToYuan(this.merchantCoupon,false);
    return this.merchantCoupon > 0 ? `-${amount}` : amount;
  }

  @Expose()
  get platformFullDiscountFormat() {
    const amount = fenToYuan(this.platformFullDiscount,false);
    return this.platformFullDiscount > 0 ? `-${amount}` : amount;
  }

  @Expose()
  get platformCouponFormat() {
    const amount = fenToYuan(this.platformCoupon,false);
    return this.platformCoupon > 0 ? `-${amount}` : amount;
  }

  //满减优惠
  @Expose()
  get orderFullDiscountAmountFormat() {
    const coupon = add(this.merchantFullDiscount, this.platformFullDiscount);
    const amount = fenToYuan(coupon, false);
    return coupon > 0 ? `-${amount}` : amount;
  }

  //优惠券
  @Expose()
  get orderCouponAmountFormat() {
    const coupon = add(this.merchantCoupon, this.platformCoupon);
    const amount = fenToYuan(add(this.merchantCoupon, this.platformCoupon), false);
    return coupon > 0 ? `-${amount}` : amount;
  }

  //售后操作
  @Expose()
  get orderAftersaleOperFormat() {
    return `#/aftersale/list?orderSn=${this.orderSn}`;
  }

  //是否有售后
  @Expose()
  get isOrderAftersaleFormat() {
    return this.afterSaleTag === 2;
  }

  @Expose()
  get totalAfterSaleAmountFormat() {
    return fenToYuan(this.totalAfterSaleAmount, false);
  }

  //需付金额 换货订单金额-原商品售后总额（需付金额≥0）
  @Expose()
  get needToPayAmountFormat() {
    const needToPayAmount = sub(add(this.orderAmount, this.transportFee), this.totalAfterSaleAmount);
    return needToPayAmount>0?fenToYuan(needToPayAmount, false):0;
  }

  @Expose()
  get totalExchangeAmountFormat() {
    return fenToYuan(this.totalExchangeAmount, false);
  }

  @Expose()
  get settleAmountFormat() {
    return this.settleAmount?fenToYuan(this.settleAmount, false):0;
  }

  //是否显示 新增售后单 按钮
  @Expose()
  get needShowAfterSaleBtnFormat() {
    return this.afterSaleTag === 1 && this.excessPay === 1;
  }

  /**
   * 售后已退款金额 格式化
   */
  @Expose()
  get refundAmountFormat() {
    return fenToYuan(this.refundAmount, false);
  }

  /**
   * 套餐优惠金额 格式化
   */
  @Expose()
  get packageDiscountAmountFormat() {
    const amount = fenToYuan(this.packageDiscountAmount, false);
    return this.packageDiscountAmount > 0 ? `-${amount}` : amount;
  }
}

class WriteLogVo {
  afterOperation: string = '';
  beforeOperation: string = '';
  businessName: string = '';
  businessType: string = '';
  createdBy: number = 0;
  createdTime: number = 0;
  extendedInfo: string = '';
  loginName: string = '';
  passiveOperator: string = '';
  remarks: string = '';
  subtypesName: string = '';
  subtypesType: string = '';
}

export class OrderRelatedLogs {
  currPage: number = 0;

  @Type(() => WriteLogVo)
  dataList: WriteLogVo[] = [];

  firstPage: boolean = true;
  lastPage: boolean = true;
  pageSize: number = 0;
  totalCount: number = 0;
  totalPage: number = 0;
}

export class List {
  @Type(() => Detail)
  "list": Detail[]
}
