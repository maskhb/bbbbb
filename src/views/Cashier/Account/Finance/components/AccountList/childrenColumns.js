import React from 'react';
import Authorized from 'utils/Authorized';
import moment from 'moment';
import { fenToYuan } from 'utils/money';
import EditModal from './modal';

export default (me) => {
  return [
    {
      title: '账务类型',
      dataIndex: 'accountTypeName',
      key: 'accountTypeName',
    }, {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: val => fenToYuan(val || 0),
    }, {
      title: '挂账时间 ',
      dataIndex: 'regTime',
      key: 'regTime',
      render: current => (current ? <span>{moment(current).format('YYYY-MM-DD HH:mm')}</span> : ''),
    }, {
      title: '营业日期 ',
      dataIndex: 'businessDate',
      key: 'businessDate',
      render: current => (current ? <span>{moment(current).format('YYYY-MM-DD')}</span> : ''),
    }, {
      title: '备注 ',
      dataIndex: 'remark',
      key: 'remark',
    }, {
      title: '操作',
      render: data => (
        <EditModal sourseData={data} dispatch={me.props.dispatch} me={me} />
      ),
    },
  ];
};
