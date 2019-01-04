import React from 'react';
import request from '../../../../../../utils/request';
import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import moment from 'moment';
import { fenToYuan } from 'utils/money';
import { goTo } from 'utils/utils';


async function goDetail(val) {
  const { gresId } = val;
  const res = await request('/fc/ht-fc-pms-server/gres/details', {
    method: 'POST',
    body: {
      ...{ gresId },
    },
  });
  const { resType = 1 } = res;
  const add = (resType === 1 ? `/checkin/checkinform/edit/${gresId}` : `/checkin/teambooking/edit/${gresId}`);
  goTo(add);
  // resType: 1 散客  2 团体。
  // 团体http://localhost:8000/#/checkin/teambooking/edit/163  goTo(`/checkin/checkinform/edit/${val.gresId}`);
  // 散客http://localhost:8000/#/checkin/orderform/edit/191
}

export default () => {
  return [
    {
      title: '登记单号',
      dataIndex: 'regNo',
      key: 'regNo',
    }, {
      title: '房间',
      dataIndex: 'roomNo',
      key: 'roomNo',
    }, /* {
      title: '入住日期',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: current => <span>{moment(current).format(format)}</span>,
    }, */ {
      title: '入住日期',
      render: data => <span>{moment(data.checkInDate).format('YYYY-MM-DD')}  --  {moment(data.checkOutDate).format('YYYY-MM-DD')}</span>,
    }, {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: val => fenToYuan(val || 0),
    }, {
      title: '操作',
      render: val => <a onClick={() => goDetail(val)} >详情</a>,
    },
  ];
};
