import React from 'react';
import { Badge, Popconfirm, Popover } from 'antd';
import moment from 'moment';
import TextBeyond from 'components/TextBeyond';
import { format } from 'components/Const';
import { handleRemove, handleUpdate } from 'components/Handle';
import { ENABLESTATUS, ENABLESTATUSLEVELS } from 'components/Status/enable';

export default (me, searchDefault) => {
  return [
    {
      title: 'ID',
      dataIndex: 'brandId',
      render(val) {
        return <a href={`#/goods/brand/list/detail/${val}`}>{val}</a>;
      },
    },
    {
      title: 'Logo',
      dataIndex: 'brandUrl',
      render(val) {
        return (
          <Popover placement="right" title="" content={<img src={val} alt="" />} trigger="hover">
            <a target="_blank" href={val}>
              <div style={{
                width: 80,
                height: 50,
                backgroundImage: `url(${val})`,
                backgroundSize: 'cover',
                }}
              />
            </a>
          </Popover>
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'brandName',
      render(val) {
        return (
          <TextBeyond content={val} maxLength="12" width="300px" />
        );
      },
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: Object.values(ENABLESTATUS).map((v, k) => ({ text: v, value: k })),
      filteredValue: String(me.search?.props.stateOfSearch.status || searchDefault.status).split(','),
      onFilter: (val, record) => record.status === Number(val),
      render(val, record) {
        const confirmText = ENABLESTATUS[val === 0 ? 1 : val === 1 ? 2 : val === 2 ? 1 : ''];
        const text = (
          <Popconfirm
            placement="top"
            title={`确认${confirmText}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={handleUpdate.bind(me, {
              brandId: record.brandId,
              status: val,
            }, 'goodsBrand', confirmText)}
          >
            <a>{ENABLESTATUS[val]}</a>
          </Popconfirm>
        );

        return <Badge status={ENABLESTATUSLEVELS[val]} text={text} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '创建人',
      dataIndex: 'createdName',
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm placement="top" title="确认删除？" onConfirm={handleRemove.bind(me, { brandId: val.brandId }, 'goodsBrand')} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
