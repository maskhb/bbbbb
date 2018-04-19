import React from 'react';

export default (me) => {
  console.log(me);
  return {
    columns: [
      {
        title: '商品信息',
        dataIndex: 'goodsName',
        render: (text, row) => {
          return row.goodsName;
        },
      },
      {
        title: '单价/数量',
        width: '200px',
        dataIndex: 'goodsNum',
        render: (text, row) => {
          return `￥${row.salePrice} x ${row.goodsNum}`;
        },
      },
      {
        title: '用户',
        width: '180px',
        dataIndex: 'userId',
        render: (text, row, index, record) => {
          const { orderGoodsVOList } = record;
          return {
            children: record.userId,
            props: {
              rowSpan: index === 0 ? orderGoodsVOList.length : 0,
            },
          };
        },
      },
      {
        title: '订单金额',
        width: '180px',
        dataIndex: 'userId',
      },
      {
        title: '收货信息',
        width: '200px',
        dataIndex: 'userId',
      },
      {
        title: '订单状态',
        width: '180px',
        dataIndex: 'userId',
      },
      // {
      //   title: '售后',
      //   dataIndex: 'id',
      // },
      // {
      //   title: '结算状态',
      //   dataIndex: 'id',
      // },
      {
        title: '操作',
        width: '200px',
        dataIndex: 'userId',
      },
    ],
    parentRender: (value, row, index) => {
      console.log(index);
      return (
        <div>
          <span>母单号：</span>
          <span>&nbsp;&nbsp;下单时间：</span>
          <span>&nbsp;&nbsp;订单来源：</span>
          <span>&nbsp;&nbsp;所属项目：</span>
          <span>&nbsp;&nbsp;所属商家：</span>
          <span>&nbsp;&nbsp;所属厂商：</span>
          <span>&nbsp;&nbsp;需要发票：</span>
          <span>&nbsp;&nbsp;是否超额:</span>
        </div>
      );
    },
    childrenDataSource: (record) => {
      return record?.orderGoodsVOList;
    },
  };
};
