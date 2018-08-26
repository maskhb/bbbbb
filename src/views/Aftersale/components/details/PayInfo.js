/**
 * 支付信息
 */
import { Table } from 'antd';
import React from 'react';

const columnsConfig = {
  columns: [
    {
      title: '支付金额',
      dataIndex: 'amountPaidFormat',
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethodName',
    },
    {
      title: '支付状态',
      dataIndex: 'statusFormat',
    },
  ],
};
export default function (props) {
  const { paymentRecordVOList, detailVO } = props;
  return (
    <Table
      loading={false}
      {...columnsConfig}
      dataSource={paymentRecordVOList || detailVO?.paymentRecordVOList}
      pagination={false}
    />
  );
}
