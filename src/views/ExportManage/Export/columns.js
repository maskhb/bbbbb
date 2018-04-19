import React from 'react';
import ExportOptions from './attr';

export default () => {
  return [
    {
      title: '创建时间',
      dataIndex: 'spaceId',
    },
    {
      title: '记录条数',
      dataIndex: 'name',
    },
    {
      title: '操作人',
      dataIndex: 'aliasName',
    },
    {
      title: '导出时间',
      dataIndex: 'orderNum',
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
    },
    {
      title: '请求状态',
      dataIndex: 'status',
      render: val => ExportOptions.getLabelByValue('SCZT', val),
    },
    {
      title: '操作',
      render: () => {
        return (
          <div>
            12122
          </div>
        );
      },
    },
  ];
};
