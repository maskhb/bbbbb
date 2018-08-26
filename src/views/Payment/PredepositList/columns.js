import React from 'react';
import moment from 'moment';
import { format } from 'components/Const';
import { Divider } from 'antd';
import Authorized from 'utils/Authorized';
import { fenToYuan } from '../../../utils/money';

const detailcolumns = [
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
    title: '交易时间',
    dataIndex: 'createdTime',
    render: (val) => {
      if (val !== 0) {
        return <span>{moment(val).format(format)}</span>;
      }
    },
  },
  {
    title: '交易原因',
    dataIndex: 'remarks',
    width: '20%',
  },
];

const logcolumns = [
  {
    title: '操作时间',
    dataIndex: 'createdTime',
    render: (val) => {
      if (val !== 0) {
        return <span>{moment(val).format(format)}</span>;
      }
    },
  },
  {
    title: '操作人',
    dataIndex: 'loginName',
  },
  {
    title: '操作对象',
    dataIndex: 'passiveOperator',
  },
  {
    title: '操作类型',
    dataIndex: 'subtypesName',
  },
  {
    title: '操作前',
    dataIndex: 'beforeOperation',
    width: '20%',
  },
  {
    title: '操作后',
    dataIndex: 'afterOperation',
    width: '20%',
  },
  {
    title: '备注',
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
      title: '预存款余额',
      dataIndex: 'balance',
      render: (val) => {
        return fenToYuan(val);
      },
    },
    {
      title: '有效期',
      dataIndex: 'validityStart',
      render: (val, record) => {
        return (
          <div>
            { record.validityStart !== 0 ? <span>{moment(record.validityStart).format(format)}</span> : ''}
            <span>~</span>
            { record.validityEnd !== 0 ? <span>{moment(record.validityEnd).format(format)}</span> : ''}
          </div>
        );
      },
    },
    {
      title: '是否过期',
      dataIndex: 'isExpire',
      render: (val) => {
        switch (val) {
          case 1:
            return '是';
          case 2:
            return '否';
          default:
            return '否';
        }
      },
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <Authorized authority="OPERPORT_JIAJU_PREDEPOSITLIST_SETTERM"><a onClick={() => me.setperiod(record)}>设置有效期</a><Divider type="vetical" /></Authorized>
            <Authorized authority="OPERPORT_JIAJU_PREDEPOSITLIST_RECHARGE"><a onClick={() => me.charge(record)}>充值预存款</a></Authorized>
          </div>
        );
      },
    },
  ];
};

export {
  detailcolumns,
  logcolumns,
};
