/**
 * Created by rebecca on 2018/4/5.
 */
import React from 'react';
import { Divider } from 'antd';

export default (me) => {
  return [
    {
      title: '栏目名称',
      dataIndex: 'adName',
      width: '30%',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: '30%',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => me.edit(record)}>编辑</a>
            <Divider type="vetical" />
            <a onClick={() => me.delete(record)}>删除</a>
          </div>
        );
      },
    },
  ];
};
