import React from 'react';
import { Divider } from 'antd';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => me.renderColumns(text, record, 'name'),
      width: '20%',
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (text, record) => me.renderColumns(text, record, 'description'),
      width: '20%',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => me.renderColumnsSelect(text, record, 'status'),
      width: '20%',
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        const { editable } = record;

        return (
          <div>
            {
              editable
                ? (
                  <span>
                    <a onClick={() => me.save(record.key)}>保存</a>
                    <Divider type="vetical" />
                    <a onClick={() => me.cancel(record.key)}>取消</a>
                  </span>
                )
                : <a onClick={() => me.edit(record.key)}>编辑</a>
            }
            <Divider type="vetical" />
            <a>删除</a>
            <Divider type="vetical" />
            <a>新增二级分类</a>
          </div>
        );
      },
    },
  ];
};
