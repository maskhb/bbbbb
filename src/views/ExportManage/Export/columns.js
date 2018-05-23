import React from 'react';
import moment from 'moment';
import { format } from 'components/Const';
import ExportDownload from 'components/Download/ExportDownload';
import ExportOptions from './attr';

export default () => {
  return [
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: 'center',
      width: 200,
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '记录条数',
      dataIndex: 'totalCount',
      width: 100,
      align: 'center',
    },
    {
      title: '操作人',
      dataIndex: 'userName',
      align: 'center',
      width: 100,
    },
    {
      title: '导出时间',
      dataIndex: 'updatedTime',
      align: 'center',
      width: 200,
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '文件名',
      align: 'center',
      width: 250,
      dataIndex: 'fileName',
      render: (val, row) => {
        if (row.status === 3) {
          return val;
        }
      },
    },
    {
      title: '请求状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: val => ExportOptions.getLabelByValue('QQZT', val),
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (obj) => {
        if (obj.status === 3) {
          return (
            <ExportDownload
              exportId={obj.exportId}
              loginType={1}
              title="下载"
            />
          );
        }
      },
    },
  ];
};
