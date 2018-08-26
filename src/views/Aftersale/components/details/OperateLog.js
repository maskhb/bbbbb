/**
 * 状态处理日志
 */
import React from 'react';
import { Table } from 'antd';

const columnsConfig = {
  columns: [
    {
      title: '时间',
      dataIndex: 'createdTimeFormat',
    },
    {
      title: '修改人',
      dataIndex: 'loginName',
    },
    {
      title: '修改前状态',
      dataIndex: 'beforeOperation',
    },
    {
      title: '修改后状态',
      dataIndex: 'afterOperation',
    },
    {
      title: '描述',
      dataIndex: 'remarks',
    },
  ],
};

export default function (props) {
  return (
    <Table
      loading={false}
      {...columnsConfig}
      dataSource={props.operateLogList || props.detailVO?.operateLogList}
      pagination={false}
    />
  );
}
