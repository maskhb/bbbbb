import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import Collecter from 'components/Collecter';
import { GRES_STATE, STATUS_TO_OPERATION } from '../common/status';
import { getOperates } from '../common/OperatesBar';

export default (me, searchDefault, checkIn) => {
  const arrOperate = [
    {
      title: '团队名称',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (val, record) => <a href={`#/checkin/teambooking/edit/${record.gresId}`}>{val}</a>,
    },
    {
      title: '预订人',
      dataIndex: 'guestName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '房型',
      dataIndex: 'roomTypeNo',
    },
    {
      title: '入离店日期',
      render: (val, record) => {
        return (
          <span>
            {moment(new Date(record.arrivalDate)).format('YYYY-MM-DD')}
            <span style={{ color: '#ccc' }}> ~ </span>
            {moment(new Date(record.departureDate)).format('YYYY-MM-DD')}
          </span>
        );
      },
      sorter: (a, b) => (a.arrivalDate - b.arrivalDate || a.departureDate - b.departureDate),
    },
    {
      title: '状态',
      render: (val, record) => {
        const obj = _.find(GRES_STATE, item => item.value == record.status);
        return <span> { obj?.label } </span>;
      },
    },
    {
      title: '操作',
      render: (val, record) => <Collecter list={filterOperates(val, record)('team')} />,
    },
  ];

  /**
   * @param {*} val
   * @param {*} record
   * @param {string} page 取值 'order/team/checkIn'
   * @param {number} status
   */
  const filterOperates = (val, record) => (page) => {
    const list = getOperates(me, record, checkIn);
    const pageOperations = STATUS_TO_OPERATION[page][record.status];
    // return list;
    if (+record.status == 0) return [];
    return pageOperations?.map(item => list[item]);
  };

  return arrOperate;
};

