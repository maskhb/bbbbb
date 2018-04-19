/**
 * Created by rebecca on 2018/4/3.
 */
import React from 'react';

export default (me) => {
  return [
    {
      title: '页面',
      dataIndex: 'page',
      key: 'index',
      width: '50%',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <div><a onClick={() => me.edit(record.index)}>编辑</a></div>
        );
      },
    },
  ];
};