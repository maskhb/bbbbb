import React from 'react';
import { Popconfirm } from 'antd';

export default (me) => {
  return [
    {
      title: '品牌ID',
      dataIndex: 'brandId',
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName',
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm placement="top" title="是否确认取消绑定该品牌？" onConfirm={me.handleRemove.bind(me, val)} okText="确认" cancelText="取消">
              <a>取消绑定</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
