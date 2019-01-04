import React from 'react';
// import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import moment from 'moment';
import { fenToYuan } from 'utils/money';


export default () => {
  return [
    {
      title: '房间号',
      dataIndex: 'roomNum',
    },
    {
      title: '房价类型',
      dataIndex: 'roomType',
      // render: (val, row) => {
      //   return row.cityName + row.communityName;
      // },
    },

    {
      title: '入住时间',
      dataIndex: 'checkInTime',
      render: current => <span>{current ? moment(current).format(format) : ''}</span>,
    },
    {
      title: '离店时间',
      dataIndex: 'checkOutTime',
      render: current => <span>{current ? moment(current).format(format) : ''}</span>,
    },
    {
      title: '入住人',
      dataIndex: 'checkInName',
    },
    {
      title: '账务余额',
      dataIndex: 'restMoney',
      render(val) {
        return fenToYuan(val || 0);
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];
};
