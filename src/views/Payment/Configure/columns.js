import React from 'react';
import { Popconfirm } from 'antd';
import { handleRemove } from 'components/Handle';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',

    },
    {
      title: '支付方式名称',
      dataIndex: 'name',
    },
    {
      title: '支付方式编码',
      dataIndex: 'name',
    },
    {
      title: '排序',
      dataIndex: 'categoryNameLv1',
    },
    {
      title: '状态',
      dataIndex: 'categoryNameLv2',
      render: (val) => {
        switch (val) {
          case 1:
            return '是';
          case 2:
            return '否';
          default:
            break;
        }
      },
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm placement="top" title="是否确认禁用该支付方式？" onConfirm={handleRemove.bind(me, [val.id], 'goods')} okText="确认" cancelText="取消">
              <a>启用</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
