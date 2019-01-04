import React from 'react';
import moment from 'moment';
import { format } from 'components/Const';

export default () => {
  return [
    {
      title: '营业日',
      dataIndex: 'businessTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'createdName',
    },
    {
      title: '夜审时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
  ];
};
