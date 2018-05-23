/*
 * @Author: wuhao
 * @Date: 2018-04-08 15:39:29
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-26 15:16:04
 *
 * 订单的mock数据
 */
import { getUrlParams } from './utils';

// 初始化数据
const listDetails = [
  {
    orderId: 1,
    orderSn: 'ABC',
    parentOrderSn: '',
    createdTime: 1523348922000,
    orderSource: 1,
    orderStatus: 1,
    payStatus: 1,
    settleStatus: 1,
    orderActionVOList: null,
    communityName: '广州第一金碧',
    excessPay: 0,
    merchantName: '恒大中心25floor',
    factoryName: null,
    needInvoice: 0,
    orderAmount: 2000,
    transportFee: 0,
    fullDiscountAmount: 0,
    preDepositAmount: 0,
    couponAmount: 0,
    merchantDiscountAmount: 0,
    orderAmountReal: 0,
    orderAmountPaid: 0,
    depositAmount: 998,
    depositAmountPaid: 0,
    remainAmount: 500,
    remainAmountPaid: 0,
    walletAmount: 0,
    userId: 0,
    userMobile: '18688845649',
    orderGoodsVOList: [
      {
        goodsId: 123,
        skuId: 222,
        goodsType: 1,
        mainImgUrl: '',
        goodsName: '红木沙发',
        salePrice: 300,
        goodsNum: 1,
        propertyValue: '2米*1米',
      },
      {
        goodsId: 456,
        skuId: 7878,
        goodsType: 1,
        mainImgUrl: '',
        goodsName: '海尔空调',
        salePrice: 300,
        goodsNum: 1,
        propertyValue: '白色',
      },
    ],
    orderVOList: [
      {
        orderId: 122,
        orderSn: 'ABC1',
        parentOrderSn: 'ABC',
        createdTime: 1523349922406,
        orderSource: 1,
        orderStatus: 2,
        payStatus: 2,
        settleStatus: 0,
        orderActionVOList: null,
        communityName: '广州第一金碧',
        excessPay: 0,
        merchantName: '恒大中心26floor',
        factoryName: null,
        needInvoice: 6576,
        orderAmount: 1500,
        transportFee: 0,
        fullDiscountAmount: 0,
        preDepositAmount: 800,
        couponAmount: 0,
        merchantDiscountAmount: 0,
        orderAmountReal: 1000,
        orderAmountPaid: 500,
        depositAmount: 500,
        depositAmountPaid: 500,
        remainAmount: 500,
        remainAmountPaid: 500,
        walletAmount: 200,
        userId: 0,
        userMobile: '18688845649',
        orderGoodsVOList: [
          {
            goodsId: 123,
            skuId: 222,
            goodsType: 1,
            mainImgUrl: '',
            goodsName: '红木沙发',
            salePrice: 300,
            goodsNum: 1,
            propertyValue: '2米*1米',
          },
          {
            goodsId: 456,
            skuId: 7878,
            goodsType: 1,
            mainImgUrl: '',
            goodsName: '海尔空调',
            salePrice: 300,
            goodsNum: 1,
            propertyValue: '白色',
          },
        ],
        orderVOList: null,
        communityId: 145,
        orderRemark: '子单1',
        sellerRemark: '',
        cancelRemark: '',
        paidTime: 1523349922406,
        createdBy: 9949,
        receiptVO: {
          consigneeName: '吴泽杰',
          consigneeMobile: '18688888888',
          regionName: null,
          provinceId: 0,
          cityId: 0,
          areaId: 0,
          detailedAddress: null,
          deliveryType: 1,
          deliveryMethod: 1,
          userRemark: '',
        },
        invoiceVO: null,
        paymentRecordVOList: null,
      },
      {
        orderId: 133,
        orderSn: 'ABC2',
        parentOrderSn: 'ABC',
        createdTime: 1523349922406,
        orderSource: 1,
        orderStatus: 2,
        payStatus: 2,
        settleStatus: 0,
        orderActionVOList: null,
        communityName: '广州第一金碧',
        excessPay: 0,
        merchantName: '恒大中心27floor',
        factoryName: null,
        needInvoice: 65767,
        orderAmount: 500,
        transportFee: 0,
        fullDiscountAmount: 0,
        preDepositAmount: 400,
        couponAmount: 0,
        merchantDiscountAmount: 0,
        orderAmountReal: 400,
        orderAmountPaid: 100,
        depositAmount: 0,
        depositAmountPaid: 0,
        remainAmount: 0,
        remainAmountPaid: 0,
        walletAmount: 0,
        userId: 0,
        userMobile: '18688845649',
        orderGoodsVOList: [
          {
            goodsId: 123,
            skuId: 222,
            goodsType: 1,
            mainImgUrl: '',
            goodsName: '红木沙发',
            salePrice: 300,
            goodsNum: 1,
            propertyValue: '2米*1米',
          },
          {
            goodsId: 456,
            skuId: 7878,
            goodsType: 1,
            mainImgUrl: '',
            goodsName: '海尔空调',
            salePrice: 300,
            goodsNum: 1,
            propertyValue: '白色',
          },
        ],
        orderVOList: null,
        communityId: 145,
        orderRemark: '子单2',
        sellerRemark: '',
        cancelRemark: '',
        paidTime: 1523349922406,
        createdBy: 9949,
        receiptVO: {
          consigneeName: '吴泽杰',
          consigneeMobile: '18677777777',
          regionName: null,
          provinceId: 0,
          cityId: 0,
          areaId: 0,
          detailedAddress: null,
          deliveryType: 1,
          deliveryMethod: 1,
          userRemark: '',
        },
        invoiceVO: null,
        paymentRecordVOList: null,
      },
    ],
    communityId: 145,
    orderRemark: '第一次下单',
    sellerRemark: '开门红',
    cancelRemark: '',
    paidTime: 0,
    createdBy: 9949,
    receiptVO: {
      consigneeName: '吴泽杰',
      consigneeMobile: '18688845649',
      regionName: null,
      provinceId: 0,
      cityId: 0,
      areaId: 0,
      detailedAddress: null,
      deliveryType: 1,
      deliveryMethod: 1,
      userRemark: '',
    },
    invoiceVO: null,
    paymentRecordVOList: null,
  },
];
for (let i = 0; i < 100; i += 1) {
  const detail = listDetails[0];
  listDetails.push({
    ...detail,
    orderId: detail.orderId + i + 1,
  });
}

// 订单列表
function list(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...listDetails];

  if (params.orderNo) {
    let filterDataSource = [];
    filterDataSource = filterDataSource.concat(
      [...dataSource].filter(data => parseInt(data.id, 10) === parseInt(params.orderNo, 10))
    );
    dataSource = filterDataSource;
  }


  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }


  const result = {
    dataList: dataSource,
    totalCount: dataSource.length,
    pageSize,
    totalPage: 10,
    firstPage: true,
    lastPage: true,
    currPage: parseInt(params.currentPage, 10) || 1,
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}


export default {
  list,
};
