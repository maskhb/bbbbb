import React from 'react';
import moment from 'moment';
import messagePushOptions from '../attr';
import { format } from '../../../components/Const';

export default () => {
  return [
    {
      title: '收信人',
      dataIndex: 'phone',
    },
    {
      title: '发给用户/商家',
      dataIndex: 'phoneType',
      render: val => messagePushOptions.getLabelByValue('FGYHSJ', val),
    },
    {
      title: '触发条件',
      dataIndex: 'triggerCondition',
      render: val => messagePushOptions.getLabelByValue('CFTJ', val),
    },
    {
      title: '推送时间',
      dataIndex: 'sendTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '推送内容',
      dataIndex: 'content',
    },
  ];
};
