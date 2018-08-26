import { classToPlain, plainToClassFromExist } from 'class-transformer';
import * as viewModels from '../../viewmodels/Orders';

import {
  isCustomGoodsOrder,
  IsOrderGoodsIsRemark,
} from '../../views/Order/attr';
/**
 * 订单列表数据转换
 * @param {*} orderList
 */
export const transformOrderList = (response) => {
  const { list: orderList, ...other } = response || {};
  const newList = [];

  orderList.forEach((item) => {
    newList.push({
      ...item,
      isParentOrder: true,
    });

    if (item?.orderVOList && item.orderVOList.length > 0) {
      newList.push(...item.orderVOList);
    }
  });

  const list = newList.map((item) => {
    return classToPlain(plainToClassFromExist(new viewModels.Detail(), item));
  });

  list.forEach((item) => {
    const newItem = item;
    if (
      !item.isParentOrder &&
      isCustomGoodsOrder(item.orderGoodsType) &&
      item.orderGoodsVOList.length > 1
    ) {
      newItem.newOrderGoodsVOList = newItem.orderGoodsVOList;
      newItem.orderGoodsVOList = item.orderGoodsVOList.filter((goodsItem) => {
        return IsOrderGoodsIsRemark(goodsItem.isRemark);
      });
    }
  });

  return {
    list,
    ...other,
  };
};
