import React from 'react';
import moment from 'moment';
import { Link } from 'dva/router';
import { fenToYuan } from 'utils/money';

const format = 'YYYY-MM-DD';

export default () => {
  return [
    {
      title: '房间号',
      dataIndex: 'roomNo',
    },
    {
      title: '房型',
      dataIndex: 'roomTypeName',
    },
    {
      title: '抵店日期',
      dataIndex: 'arrivalDate',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '离店日期',
      dataIndex: 'departureDate',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '业务来源',
      dataIndex: 'sourceName',
    },
    {
      title: '价格类别',
      dataIndex: 'rateCodeName',
    },
    {
      title: '标准房价',
      dataIndex: 'stdPrice',
      render: fenToYuan,
    },
    {
      title: '实际房价',
      dataIndex: 'realPrice',
      render: fenToYuan,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (val, row) => {
        return <a href={`/#/checkin/checkinform/edit/${row.gresId}`} target="blank">详情</a>;
        // return <Link to={`/checkin/checkinform/edit/${row.gresId}`}><a>详情</a></Link>;
      },
    },
  ];
};

