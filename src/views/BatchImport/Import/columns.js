import React from 'react';
import moment from 'moment';
import { format } from '../../../components/Const';
import Download from '../../../components/Download';
import batchImportOptions from './attr';

export default () => {
  return [
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      width: 150,
      align: 'center',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '上传数据量',
      dataIndex: 'uploadCount',
      width: 250,
      align: 'center',
    },
    {
      title: '上传人',
      dataIndex: 'uploadBy',
      width: 250,
      align: 'center',
    },
    {
      title: '上传状态',
      dataIndex: 'status',
      width: 250,
      align: 'center',
      render: val => batchImportOptions.getLabelByValue('SCZT', val),
    },
    {
      title: '上传结果',
      dataIndex: 'result',
      width: 250,
      align: 'center',
    },
    {
      title: '结果文件',
      width: 250,
      align: 'center',
      render: (obj) => {
        if (obj.status === 3) {
          const urls = obj.fileUrl.split(',');
          const fileNames = obj.fileName.split(',');
          if (urls.length === fileNames.length && urls.length === 2) {
            return (
              <div>
                导入文件: <Download
                  key={urls[0]}
                  baseUrl="/ht-mj-log-server/downloadResultFile"
                  query={{ fileUrl: urls[0], fileName: fileNames[0] }}
                  title={fileNames[0]}
                />
                <br />
                结果文件: <Download
                  key={urls[1]}
                  baseUrl="/ht-mj-log-server/downloadResultFile"
                  query={{ fileUrl: urls[1], fileName: fileNames[1] }}
                  title={fileNames[1]}
                />
              </div>
            );
          } else {
            return (
              <Download
                baseUrl="/ht-mj-log-server/downloadResultFile"
                query={{ fileUrl: obj.fileUrl, fileName: obj.fileName }}
                title={obj.fileName}
              />
            );
          }
        } else if (obj.status !== 4) {
          return obj.fileName;
        }
      },
    },
  ];
};
