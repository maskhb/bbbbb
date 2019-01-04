import React from 'react';
// import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import moment from 'moment';
import { fenToYuan } from 'utils/money';


export default () => {
  return [

    {
      title: '房间号 ',
      key: 'roomNo',
      render: data => (
        <span>
          <a href={`/#/checkin/checkinform/edit/${data.gresId}`} target="_blank" rel="noopener noreferrer" > {data.roomNo || '详情'} </a>
        </span>
      ),
    },
    {
      title: '房间类型',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',

    },
    {
      title: '入住日期',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: current => <span>{current ? moment(current).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '离店日期',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: current => <span>{current ? moment(current).format('YYYY-MM-DD') : ''}</span>,
    },
    {
      title: '入住人',
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: '账务余额',
      dataIndex: 'accountBalance',
      key: 'accountBalance',
      render: (current) => {
        if (current < 0) {
          return <span>余￥{fenToYuan(Math.abs(current))}</span>;
        } else if (current > 0) {
          return <span style={{ color: 'red' }}>欠￥{fenToYuan(Math.abs(current))}</span>;
        } else {
          return <span>余￥ 0</span>;
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
};
