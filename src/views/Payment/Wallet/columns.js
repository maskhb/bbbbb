import React from 'react';
import Authorized from 'utils/Authorized';
import moment from 'moment';
import { format } from 'components/Const';
import { fenToYuan } from '../../../utils/money';

const detailcolumns = [
  {
    title: 'ID',
    dataIndex: 'entryId',
  },
  {
    title: '交易时间',
    dataIndex: 'createdTime',
    render: (val) => {
      if (val !== 0) {
        return <span>{moment(val).format(format)}</span>;
      }
    },
  },
  {
    title: '登录ID',
    dataIndex: 'oldLoginName',
  },
  {
    title: '手机号码',
    dataIndex: 'accountMobile',
  },
  {
    title: '交易类型',
    dataIndex: 'ruleName',
  },
  {
    title: '订单编号',
    dataIndex: 'orderId',
  },
  {
    title: '交易前余额',
    dataIndex: 'frontBalance',
    render: (val) => {
      return fenToYuan(val);
    },
  },
  {
    title: '交易金额',
    dataIndex: 'dealAmount',
    render: (val) => {
      return fenToYuan(val);
    },
  },
  {
    title: '交易后余额',
    dataIndex: 'afterBalance',
    render: (val) => {
      return fenToYuan(val);
    },
  },
  {
    title: '交易原因',
    dataIndex: 'remarks',
    width: '20%',
  },
];

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'acctId',
    },
    {
      title: '登录ID',
      dataIndex: 'oldLoginName',
    },
    {
      title: '手机号码',
      dataIndex: 'accountMobile',
    },
    {
      title: '钱包余额',
      dataIndex: 'balance',
      render: (val) => {
        return fenToYuan(val);
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <Authorized authority="OPERPORT_JIAJU_WALLETLIST_RECHARGE"><a onClick={() => me.charge(record)}>充值</a></Authorized>
          </div>
        );
      },
    },
  ];
};

export {
  detailcolumns,
};

