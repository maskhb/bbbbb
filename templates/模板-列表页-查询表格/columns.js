import React from 'react';
import { Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { STATUS, STATUSLEVELS } from './status';
import { format } from '../../../components/Const';

export default (me, searchDefault) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render(val) {
        return <a href={`#/model/list/detail/${val}`}>{val}</a>;
      },
    },
    {
      title: '图片',
      dataIndex: 'image',
      render(val) {
        return (
          <div style={{
            width: 80,
            height: 50,
            backgroundImage: `url(${val})`,
            backgroundSize: 'cover',
            }}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: Object.values(STATUS).map((v, k) => ({ text: v, value: k })),
      filteredValue: String(me.search?.props.stateOfSearch.status || searchDefault.status).split(','),
      render(val) {
        const confirmText = STATUS[val === 0 ? 1 : 0];
        const text = (
          <Popconfirm placement="top" title={`确认${confirmText}？`} onConfirm={me.popConfirm.bind(me, val)} okText="确认" cancelText="取消">
            <a>{STATUS[val]}</a>
          </Popconfirm>
        );

        return <Badge status={STATUSLEVELS[val]} text={text} />;
      },
    },
    {
      title: '时间',
      dataIndex: 'time',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm placement="top" title="确认删除？" onConfirm={me.popConfirmDelete.bind(me, [val])} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
