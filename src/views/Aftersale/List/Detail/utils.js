import { mul, div, sub, add } from 'utils/number';
import { fenToYuan } from 'utils/money';
import { Modal } from 'antd';
import * as OrderViewModels from '../../../../viewmodels/Orders';

import { transformObjectToTSModal } from '../../../../utils/transform/aftersale';

export const ObjectRemoveByReg = (obj, reg = /Format$/) => {
  if (Array.isArray(obj)) {
    return obj.map(o => ObjectRemoveByReg(o, reg));
  }
  const result = {};
  for (const k of Object.keys(obj)) {
    if (!reg.test(k)) {
      const val = obj[k];
      if (val && typeof val === 'object') {
        result[k] = ObjectRemoveByReg(val);
      } else {
        result[k] = val;
      }
    }
  }
  return result;
};


export const getRefundByOrderInfo = (paymentList, goodsList, exchangeList) => {
  let sumRefund = 0;
  let sumCouponRefund = 0;
  if (!exchangeList && typeof (goodsList) !== 'object') {
    sumRefund = goodsList;
  } else {
    const sumPrice = goodsList.reduce((pval, val) => {
      const newVal = add(pval, (mul(val.afterSaleNum, val.afterSaleUnitPrice || 0) || 0));
      return newVal;
    }, 0);

    const exchangeSumPrice = exchangeList?.reduce((pval, val) => {
      const newVal = add(pval, (mul(val.exchangeNum, val.exchangeUnitPrice || 0) || 0));
      return newVal;
    }, 0) || 0;
    sumRefund = sub(sumPrice, exchangeSumPrice);
  }
  if (sumRefund <= 0) {
    return [];
  }
  const paymentSize = paymentList?.length;
  let originSumPrice = 0;
  let couponSumPrice = 0;
  // if ()
  paymentList?.forEach((val) => {
    if (val.paymentMethodCode === 'coupon') {
      couponSumPrice += val.amountPaid;
    } else {
      originSumPrice += val.amountPaid;
    }
  });
  sumCouponRefund = mul(sumRefund, div(couponSumPrice, originSumPrice));
  // console.log('sumcoupond', sumCouponRefund, 'refundsum', sumRefund);
  // const couponSumPrice =
  let refundAmount = 0;
  let refundCouponAmount = 0;
  return paymentList?.map((payment, i) => {
    const { paymentMethodName, paymentMethodCode, transactionId,
      expiryTime, bankAccount, bankName, accountName } = payment;
    let realRefundAmount;
    let remainRefundAmount;
    if (payment.paymentMethodCode === 'coupon') {
      remainRefundAmount = Math.round(sub(sumCouponRefund, refundCouponAmount));
    } else {
      remainRefundAmount = Math.round(sub(sumRefund, refundAmount));
    }
    if (i === paymentSize - 1) {
      realRefundAmount = remainRefundAmount;
    } else {
      if (payment.paymentMethodCode === 'coupon') {
        realRefundAmount = Math.round(
          div(mul(sumCouponRefund, payment.amountPaid), couponSumPrice)
        );
      } else {
        realRefundAmount = Math.round(div(mul(sumRefund, payment.amountPaid), originSumPrice));
      }
      if (realRefundAmount > payment.amountPaid) {
        realRefundAmount = payment.amountPaid;
      } else if (realRefundAmount > remainRefundAmount) {
        realRefundAmount = remainRefundAmount;
      }
      if (payment.paymentMethodCode === 'coupon') {
        refundCouponAmount = add(refundCouponAmount, realRefundAmount);
      } else {
        refundAmount = add(refundAmount, realRefundAmount);
      }
    }

    return {
      paymentMethodName,
      paymentMethodCode,
      transactionId,
      expiryTime,
      bankAccount,
      bankName,
      accountName,
      intentRefundAmount: realRefundAmount,
    };
  }) || [];
};

export const checkRequestBody = (body, { type, hasRefund, orderInfoVo, aftersaleType } = {}) => {
  if (type === 'add' && aftersaleType !== 'refund') {
    if (!body.applyInfoVo?.contact || !body.applyInfoVo?.contactPhone) {
      Modal.error({
        title: '提交数据错误',
        content: '请填写申请信息',
      });
      return false;
    }
  }
  const { orderGoodsExchangeList, orderGoodsList } = body;
  // console.log('goodorderList', orderGoodsList, aftersaleType);
  if ((!orderGoodsList || orderGoodsList.length === 0) && aftersaleType !== 'refund') {
    Modal.error({
      title: '信息未填写完整,请完善原商品信息',
      content: '请检查后重新确认',
    });
    return false;
  }

  if ((!orderGoodsExchangeList || orderGoodsExchangeList.length === 0) && aftersaleType === 'exchange') {
    Modal.error({
      title: '信息未填写完整,请完善换货商品信息',
      content: '请检查后重新确认',
    });
    return false;
  }
  let { refundIntentionList } = body;
  // console.log(refundIntentionList);
  const goodsSum = orderGoodsList.reduce((pval, val) => {
    const newVal = add(pval, (mul(val.afterSaleNum, val.afterSaleUnitPrice || 0) || 0));
    return newVal;
  }, 0);
  const exchangeSum = orderGoodsExchangeList?.reduce((pval, val) => {
    const newVal = add(pval, (mul(val.exchangeNum, val.exchangeUnitPrice || 0) || 0));
    return newVal;
  }, 0) || 0;
  const refundPrice = sub(goodsSum, exchangeSum);
  if (refundPrice < 0) {
    // Modal.error({
    //   title: '提交数据错误',
    //   content: '换货商品金额不可大于原商品的金额',
    // });
    // return false;
  }
  if (
    type === 'add' && hasRefund !== false &&
    (!refundIntentionList || refundIntentionList.length === 0) &&
    orderInfoVo?.paymentRecordVOList?.length > 0
  ) {
    // eslint-disable-next-line
    refundIntentionList = body.refundIntentionList = getRefundByOrderInfo(orderInfoVo.paymentRecordVOList, orderGoodsList, orderGoodsExchangeList);
  }
  const realRefundPrice = refundIntentionList?.reduce((pval, val) => {
    if (val.paymentMethodCode !== 'coupon') {
      const newVal = add(pval, val.intentRefundAmount || 0);
      return newVal;
    }
    return pval;
  }, 0) || 0;

  if (realRefundPrice !== refundPrice && realRefundPrice > 0 && hasRefund) {
    Modal.error({
      title: '提交数据错误',
      content: '意向退款金额不等可退金额',
    });
    return false;
  }

  if ((body.aftersaleType === 1 || body.aftersaleType === 2) && (
    orderGoodsList && orderGoodsList.length === 0
  )) {
    Modal.error({
      title: '信息未填完整',
      content: '请检查商品信息',
    });
    return false;
  }

  if (body.applyInfoVo?.applyOrderId) {
    body.refundIntentionList.forEach((l) => {
      if (!l.applyOrderId) {
        // eslint-disable-next-line
        l.applyOrderId = body?.applyOrderId;
      }
    });
  }
  // return false;
  // if(bod)
  return true;
};


export const transformQueryOrder = (orderInfoVo, other, detail) => {
  // console.log('orderInfoVo.... ', orderInfoVo, detail);
  // console.log('transform', orderInfoVo, other, detail);
  // eslint-disable-next-line
  let data = transformObjectToTSModal(
    orderInfoVo,
    new OrderViewModels.Detail()
  );
  if (!data.userId) {
    data.userId = detail?.userId;
  }
  if (Object.keys(orderInfoVo).length < 2 || orderInfoVo.orderSn === detail?.orderSn) {
    ['settleAmount', 'settleAmountFormat', 'createdTimeFormat'].forEach((attr) => {
      data[attr] = detail?.[attr];
    });
  }
  // Object.assign()

  data.orderInfoVO = { ...orderInfoVo, ...orderInfoVo?.orderInfoVO };
  // 原商品售后总额
  data.totalOriginAfterSaleAmount = (
    other.goodsList || detail?.orderGoodsList || []).reduce((pval, good) => {
    const sum = add(pval, mul(good.afterSaleUnitPrice, good.afterSaleNum));
    return sum;
  }, 0);
  data.totalOriginAfterSaleAmountFormat = fenToYuan(data.totalOriginAfterSaleAmount);
  // 商品退款金额
  // data.refundAmount
  data.refundAmount = (
    ((other.refundIntentionList?.length > 0 || other?.hasRefundChange) ?
      other?.refundIntentionList : detail?.refundIntentionList) || []
  ).reduce((pval, l) => {
    const sum = add(pval, l.intentRefundAmount);
    return sum;
  }, 0);

  data.refundAmountFormat = fenToYuan(data.refundAmount);

  data.hasRefundAmount = (
    ((other.refundIntentionList?.length > 0 || other?.hasRefundChange) ?
      other?.refundIntentionList : detail?.refundIntentionList) || []
  ).reduce((pval, l) => {
    const sum = add(pval, l.hasRefundAmount || 0);
    return sum;
  }, 0);
  data.hasRefundAmountFormat = fenToYuan(data.hasRefundAmount);

  data.intentRefundAmount = data.refundAmount;
  // (
  //   other.goodsList || detail?.orderGoodsList || []
  // ).reduce((pval, good) => {
  //   const sum = add(pval, mul(good.dealUnitPrice, good.afterSaleNum));
  //   return sum;
  // }, 0);
  data.totalExchangeAmount = (
    other.exchangeGoddsList || detail?.orderGoodsExchangeList || []).reduce(
    (pval, good) => {
      const sum = add(pval, mul(good.exchangeUnitPrice, good.exchangeNum));
      return sum;
    }, 0);
  data.totalExchangeAmountFormat = fenToYuan(data.totalExchangeAmount);
  data.intentRefundAmountFormat = fenToYuan(data.intentRefundAmount);
  data.aftersaleActualDifferenceAmount = fenToYuan(sub(
    data.totalOriginAfterSaleAmount, data.totalExchangeAmount
  ));

  // console.log('dat.a......', data);

  return data;
};
