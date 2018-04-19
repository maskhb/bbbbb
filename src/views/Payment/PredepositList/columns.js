import React from 'react';
import moment from 'moment';
import { format } from 'components/Const';
import { Divider } from 'antd';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '登录ID',
      dataIndex: 'image',
    },
    {
      title: '手机号码',
      dataIndex: 'name',
    },
    {
      title: '预存款余额',
      dataIndex: 'categoryNameLv1',
    },
    {
      title: '有效期',
      dataIndex: 'categoryNameLv2',
      render: (val) => {
        return (
          <div>
            <span>{moment(val[0]).format(format)}</span>
            <span>~</span>
            <span>{moment(val[1]).format(format)}</span>
          </div>
        );
      },
    },
    {
      title: '是否过期',
      dataIndex: 'onlineStatus',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => me.setperiod(record)}>设置有效期</a>
            <Divider type="vetical" />
            <a onClick={() => me.charge(record)}>充值预存款</a>
          </div>
        );
      },
    },
  ];
};
