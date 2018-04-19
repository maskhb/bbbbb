/**
 * Created by rebecca on 2018/4/5.
 */
/**
 * Created by rebecca on 2018/4/5.
 */
import React from 'react';
import { Divider } from 'antd';

export default (me) => {
  return [
    {
      title: '是否默认',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
    },
    {
      title: '图片',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => me.renderColumns(text, record, 'name'),
      width: '20%',
    },
    {
      title: '栏目名称',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => me.renderColumns(text, record, 'description'),
      width: '20%',
    },
    {
      title: '排序',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => me.renderColumnsSelect(text, record, 'status'),
      width: '20%',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        return (
          <div>
            <a onClick={() => me.edit(record.key)}>编辑</a>
            <Divider type="vetical" />
            <a>删除</a>
            <Divider type="vetical" />
            <a>设为默认</a>
          </div>
        );
      },
    },
  ];
};
