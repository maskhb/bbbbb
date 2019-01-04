
import React from 'react';
import { moduleOptions, statusOptions } from 'utils/attr/exportFile';
import moment from 'moment';
import { format } from 'components/Const';
import ExportDownload from 'components/Download/ExportDownload';

export default () => {
  return [
    {
      title: '导出文件名',
      dataIndex: 'fileName',
    },
    {
      title: '导出模块',
      dataIndex: 'prefix',
      render: (val) => {
        let str = '';
        moduleOptions.map((v) => {
          if (v.value === val) {
            str = v.label;
          }
          return '';
        });
        return str;
      },
    },
    {
      title: '导出人账号',
      dataIndex: 'userName',
    },
    {
      title: '创建导出时间',
      dataIndex: 'createdTime',
      render: current => <span>{moment(current).format(format)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val) => {
        let str = '';
        statusOptions.map((v) => {
          if (val === v.value) {
            str = v.label;
          }
          return '';
        });
        return str;
      },
    },
    {
      title: '操作',
      dataIndex: 'options',
      render: (val, row) => {
        return (
          <div>
            {row.status === 3 ? (
              <ExportDownload
                exportId={row.exportId}
                loginType={7}
                title="下载"
              />
            ) : ''}
          </div>
        );
      },
    },
  ];
};
