import React from 'react';
import { Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { format } from 'components/Const';
import { handleRemove } from 'components/Handle';
import { STATUS, STATUSLEVELS } from './status';

export default (me, searchDefault) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      render(val) {
        return <a href={`#/goods/brand/list/detail/${val}`}>{val}</a>;
      },
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      render(val) {
        return (
          <a target="_blank" href={val}>
            <div style={{
              width: 80,
              height: 50,
              backgroundImage: `url(${val})`,
              backgroundSize: 'cover',
              }}
            />
          </a>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: Object.values(STATUS).map((v, k) => ({ text: v, value: k })),
      filteredValue: String(me.search?.props.stateOfSearch.status || searchDefault.status).split(','),
      render(val, record) {
        const confirmText = STATUS[val === 0 ? 1 : val === 1 ? 2 : val === 2 ? 1 : ''];
        const text = (
          <Popconfirm placement="top" title={`确认${confirmText}？`} onConfirm={me.popConfirm.bind(me, val, record, confirmText)} okText="确认" cancelText="取消">
            <a>{STATUS[val]}</a>
          </Popconfirm>
        );

        return <Badge status={STATUSLEVELS[val]} text={text} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'createdByName',
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm placement="top" title="确认删除？" onConfirm={handleRemove.bind(me, [val.id], 'goodsBrand')} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
