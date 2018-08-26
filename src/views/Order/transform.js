/*
 * @Author: wuhao
 * @Date: 2018-04-25 15:38:10
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-01 10:45:53
 *
 * 数据转换
 */
import { getMillisecondForSecondArr } from 'utils/datetime';
import { classToPlain, plainToClassFromExist } from 'class-transformer';
import * as viewModels from 'viewmodels/Orders';
import { mul, sub } from 'utils/number';


import {
  getOptionLabelForValue,
  payTypeOptions,
  payStatusNoDepositOptions,
  GoodsTypeOptions,
  orderStatusOptions,
  getStartTimeAndEndTimeFor6Months,

  isOrderGoodsShipped,
  isCustomGoodsOrder,
  IsOrderGoodsIsRemark,
  isSetMealOrderGoodsInfo,
} from './attr';


/**
 * 订单列表搜素数据格式化
 * @param {*} param0
 */
export const transformSearchParam = ({ pageInfo, ...query }) => {
  const {
    payTime,
    finishTime,
    orderTime,
    project = [],
    region = [],
    orderStatusList = [],
    orderStatus,
    ...other
  } = query;

  const { value: [provinceId, cityId, areaId] = [] } = region;
  const [,, communityId] = project;

  const newOrderStatusList = [];
  if (orderStatus && orderStatus > 0) {
    newOrderStatusList.push(orderStatus);
  } else if (orderStatusList && orderStatusList.length > 0) {
    newOrderStatusList.push(...orderStatusList);
    if (orderStatusList?.some(item => `${item}` === '7')) {
      newOrderStatusList.push(8);
    }
  }

  const params = {
    orderQueryVO: {
      pageInfo,
      ...other,
      ...getMillisecondForSecondArr(payTime, 'pay'),
      ...getMillisecondForSecondArr(finishTime, 'finish'),
      ...getMillisecondForSecondArr(
        orderTime && orderTime?.length > 0 ? orderTime : getStartTimeAndEndTimeFor6Months()
      ),
      provinceId,
      cityId,
      areaId,
      communityId,
      orderStatus,
      orderStatusList: newOrderStatusList,
    },
  };


  return params;
};

/**
 * 订单列表数据转换
 * @param {*} orderList
 */
export const transformOrderList = (orderList = []) => {
  const newList = [];

  (orderList || []).forEach((item) => {
    newList.push({
      ...item,
      isParentOrder: true,
    });

    if (item?.orderVOList && item.orderVOList.length > 0) {
      newList.push(...item.orderVOList);
    }
  });

  newList.forEach((item) => {
    const newItem = item;
    if (
      !item.isParentOrder &&
      isCustomGoodsOrder(item.orderGoodsType) &&
      item.orderGoodsVOList.length > 1
    ) {
      newItem.orderGoodsVOList = item.orderGoodsVOList.filter((goodsItem) => {
        return IsOrderGoodsIsRemark(goodsItem.isRemark);
      });
    }
  });

  return newList.map((item) => {
    return classToPlain(plainToClassFromExist(new viewModels.Detail(), item));
  });
};

/**
 * 订单详情---支付记录数据格式化
 * @param {*} paymentRecordVOList
 * @param {*} addOrderPayListForLocal
 * @param {*} editOrderPayStatusListForLocal
 */
export const transformOrderPayRecords = (
  paymentRecordVOList = [],
  addOrderPayListForLocal = [],
  editOrderPayStatusListForLocal = []
) => {
  const newRecordList = [
    ...addOrderPayListForLocal.map((item) => {
      return {
        [`${getOptionLabelForValue(payStatusNoDepositOptions)(item.payStatus) === '未支付' ? 'amount' : 'amountPaid'}`]: item.money,
        paymentMethodCode: item.paymentMethodCode,
        paymentMethodName: getOptionLabelForValue(payTypeOptions)(item.paymentMethodCode),
        status: item.payStatus,
        thirdPartTransactionId: item.transactionId,
        isAdd: true,
        paymentRecordId: item.paymentRecordId,
      };
    }),
    ...paymentRecordVOList.map((item) => {
      const editOrderPayRecord = editOrderPayStatusListForLocal.filter((editItem) => {
        return editItem.paymentRecordId === item.paymentRecordId;
      });

      return {
        ...item,
        ...editOrderPayRecord.length > 0 ? {
          amount: 0,
          amountPaid: editOrderPayRecord?.[0].money,
          paymentMethodCode: item.paymentMethodCode,
          paymentMethodName: getOptionLabelForValue(payTypeOptions)(
            editOrderPayRecord?.[0].paymentMethodCode
          ),
          status: editOrderPayRecord?.[0].payStatus,
          thirdPartTransactionId: editOrderPayRecord?.[0].transactionId,
        } : null,
      };
    }),
  ];

  return newRecordList.map((item) => {
    return classToPlain(plainToClassFromExist(new viewModels.PaymentRecordVO(), item));
  });
};

/**
 * 获取订单中赠品优惠
 * @param {*} goodsList
 */
export const transformGiftAmount = (goodsList = []) => {
  let giftAmount = 0;
  goodsList.forEach((item) => {
    const tagName = getOptionLabelForValue(GoodsTypeOptions)(item.goodsType);
    if (tagName === '赠品') {
      giftAmount += mul(item.salePrice, item.goodsNum);
    }
  });
  return giftAmount > 0 ? -giftAmount : giftAmount;
};

/**
 * 获取订单中套餐优惠
 * @param {*} goodsList
 */
export const transformSetMealAmount = (goodsList = []) => {
  let setMealAmount = 0;
  goodsList.forEach((item) => {
    if (isSetMealOrderGoodsInfo(item.isPackage)) {
      setMealAmount += mul(sub(item.marketPrice, item.salePrice), item.goodsNum);
    }
  });
  return setMealAmount > 0 ? -setMealAmount : setMealAmount;
};

/**
 * 获取初始化展开key
 * @param {*} dataSource
 */
export const transformExpandEdRowKey = (dataSource = []) => {
  const expandedRowKeys = [];

  dataSource?.forEach((item) => {
    const orderStatusName = getOptionLabelForValue(orderStatusOptions)(item.orderStatus);
    if (!item.isParentOrder || (item.isParentOrder && (orderStatusName === '待支付' || orderStatusName === '已取消'))) {
      expandedRowKeys.push(item?.orderId);
    }
  });

  return expandedRowKeys;
};

/**
 * 未发货订单商品过滤(顺便过滤掉默认定制商品)
 * @param {*} dataSource
 */
export const transformShipOrderGoodsList = (dataSource = []) => {
  return transformOrderDetailsGoodsList(dataSource).filter((item) => {
    return !isOrderGoodsShipped(item?.shippedStatus);
  });
};

/**
 * 订单详情，定制商品订单过滤掉默认定制商品
 * @param {*} dataSource
 */
export const transformOrderDetailsGoodsList = (dataSource = []) => {
  return dataSource?.length > 1 ? dataSource?.filter((item) => {
    return isCustomGoodsOrder(item?.goodsType) ? IsOrderGoodsIsRemark(item?.isRemark) : true;
  }) : dataSource;
};
