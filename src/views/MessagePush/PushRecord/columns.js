// import React from 'react';
import messagePushOptions from '../attr';

export default () => {
  return [
    {
      title: '收信人',
      dataIndex: 'id',
    },
    {
      title: '发给用户/商家',
      dataIndex: 'model',
      render: val => messagePushOptions.getLabelByValue('FGYHSJ', val),
    },
    {
      title: '触发条件',
      dataIndex: 'name',
      render: val => messagePushOptions.getLabelByValue('CFTJ', val),
    },
    {
      title: '推送时间',
      dataIndex: 'categoryNameLv1',
    },
    {
      title: '推送内容',
      dataIndex: 'categoryNameLv2',
    },
  ];
};
