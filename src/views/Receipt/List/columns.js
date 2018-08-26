import React from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { payeeMethod, printState } from './attr';
import { fenToYuan } from '../../../utils/money/index';

export default () => {
  return [
    {
      title: '订单号',
      dataIndex: 'orderSn',
      align: 'center',
    },
    {
      title: '收据编号',
      dataIndex: 'eleReceiptSn',
      align: 'center',
    },
    {
      title: '收款日期',
      dataIndex: 'collectionDays',
      align: 'center',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '收货人姓名',
      align: 'center',
      dataIndex: 'consigneeName',
    },
    {
      title: '收货人手机号',
      dataIndex: 'consigneeMobile',
      align: 'center',
    },
    {
      title: '收款金额',
      dataIndex: 'collectionAmount',
      align: 'center',
      render: (val) => {
        return fenToYuan(val, false);
      },
    },
    {
      title: '收款单位',
      dataIndex: 'payeeUnitName',
      align: 'center',
    },
    {
      title: '收款方式',
      dataIndex: 'payeeMethod',
      align: 'center',
      render: (val) => {
        return payeeMethod[val];
      },
    },
    {
      title: '收据状态',
      dataIndex: 'printState',
      align: 'center',
      render: (val) => {
        return printState[val];
      },
    },
    {
      title: '操作',
      align: 'center',
      render: (record) => {
        return <Link target="_blank" to={`/print/receipt/${record.eleReceiptId}`}>预览收据</Link>;
      },
    },
  ];
};
