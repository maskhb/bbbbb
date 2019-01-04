import React from 'react';
// import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import moment from 'moment';
import { fenToYuan } from 'utils/money';


export default () => {
  return [
    {
      title: '登记单号',
      dataIndex: 'gressNo',
    },
    {
      title: '房间',
      dataIndex: 'roomNo',
    },

    {
      title: '账务类别',
      dataIndex: 'itemName',
    },
    {
      title: '金额',
      dataIndex: 'rate',
      render: val => (val ? fenToYuan(val) : 0),
    },
    {
      title: '发生时间',
      dataIndex: 'accountDate',
      render: current => <span>{current ? moment(current).format(format) : ''}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'userName',
    },
    {
      title: '状态',
      dataIndex: 'checkoutMethodName',
    },
    {
      title: '备注',
      dataIndex: 'memo',
    },
  ];
};
