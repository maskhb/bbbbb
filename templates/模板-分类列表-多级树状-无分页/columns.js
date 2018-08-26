import React from 'react';
import { Divider, Popconfirm, message } from 'antd';

export default (me) => {
  return [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      render(text) {
        return (
          <span style={{ whiteSpace: 'nowap' }}>
            {text}
          </span>
        );
      },
    },
    {
      title: 'ID',
      dataIndex: 'categoryId',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '操作',
      render: (text, record) => {
        return (
          <div>
            <a onClick={me.handleAdd.bind(me, record.categoryId)}>添加子分类</a>
            <Divider type="vetical" />
            <a onClick={me.handleEdit.bind(me, record)}>编辑</a>
            <Divider type="vetical" />
            {(!record.children) ? (
              <Popconfirm placement="top" title="确认删除？" onConfirm={me.handleRemove.bind(me, [record.categoryId])} okText="确认" cancelText="取消">
                <a>删除</a>
              </Popconfirm>
                ) : (
                  <a onClick={() => { message.warn('请先删除子分类！'); }}>删除</a>
            )}
          </div>
        );
      },
    },
  ];
};
