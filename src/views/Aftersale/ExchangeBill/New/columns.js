import React from 'react';
// import moment from 'moment';
// import { format } from 'components/Const';
import { fenToYuan } from 'utils/money';

const goodsColumns = [
  {
    title: '商品skuId',
    dataIndex: 'skuId',
  },
  {
    title: '商品图片',
    dataIndex: 'goodsUrl',
    render: (text) => {
      return (
        <div>
          <img style={{ width: '50px', height: '50px' }} src={text} alt="" />
        </div>
      );
    },
  },
  {
    title: '商品名称',
    dataIndex: 'goodsName',
  },
  {
    title: '商品规格',
    dataIndex: 'goodsPropertis',
  },
  {
    title: '销售价',
    dataIndex: 'saleUnitPrice',
    render: (val) => {
      return fenToYuan(val);
    },
  },
  {
    title: '换货单价',
    dataIndex: 'exchangeUnitPrice',
    render: (val) => {
      return fenToYuan(val);
    },
  },
  {
    title: '数量',
    dataIndex: 'exchangeNum',
  },
  {
    title: '换货总价',
    dataIndex: 'totalPrice',
    render: (val, row) => {
      return (
        fenToYuan(row.exchangeNum * row.exchangeUnitPrice)
      );
    },
  },
];

export {
  goodsColumns,
};

