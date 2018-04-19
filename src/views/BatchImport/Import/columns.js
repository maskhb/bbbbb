import React from 'react';
import batchImportOptions from './attr';

export default () => {
  return [
    {
      title: '上传时间',
      dataIndex: 'spaceId',
    },
    {
      title: '上传数据量',
      dataIndex: 'name',
    },
    {
      title: '上传人',
      dataIndex: 'aliasName',
    },
    {
      title: '上传状态',
      dataIndex: 'orderNum',
      render: val => batchImportOptions.getLabelByValue('SCZT', val),
    },
    {
      title: '上传结果',
      dataIndex: 'status',
    },
    {
      title: '结果文件',
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
