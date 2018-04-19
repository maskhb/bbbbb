import React from 'react';

export default () => {
  return [
    {
      title: '项目ID',
      dataIndex: 'id',
    },
    {
      title: '项目名称',
      dataIndex: 'name',
    },
    {
      title: '地区',
      dataIndex: 'area',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '操作',
      render: () => {
        return (
          <div>
            <a>设置商家排序</a>
          </div>
        );
      },
    },
  ];
};
