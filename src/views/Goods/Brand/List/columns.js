import React from 'react';
import { Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { OPERPORT_JIAJU_BRANDLIST_ENABLE, OPERPORT_JIAJU_BRANDLIST_DISABLE, OPERPORT_JIAJU_BRANDLIST_DELETE } from 'config/permission';
import Authorized from 'utils/Authorized';
import TextBeyond from 'components/TextBeyond';
import { format } from 'components/Const';
import { handleRemove, handleOperate } from 'components/Handle';
import ListImg from 'components/ListImg';
import ENABLESTATUS from 'components/EnableStatus';
import ENABLEALLSTATUS from 'components/EnableStatus/ENABLEALLSTATUS';

export default (me, searchDefault) => {
  return [
    {
      title: 'ID',
      dataIndex: 'brandId',
    },
    {
      title: 'logo',
      dataIndex: 'brandUrl',
      render(val) {
        return <ListImg url={val} />;
      },
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName',
      render(val, record) {
        return (
          <a target="_blank" href={`#/goods/brand/list/detail/${record.brandId}`}><TextBeyond content={val} maxLength="12" width="300px" /></a>
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
      filterMultiple: false,
      filters: Object.values(ENABLEALLSTATUS),
      filteredValue: String(me.search?.props.stateOfSearch.status || searchDefault.status).split(','),
      onFilter: (val, record) => record.status === Number(val)
        || Number(val) === ENABLEALLSTATUS.ALL.value,
      render(val, record) {
        const current = Object.values(ENABLESTATUS).find(
          ({ value }) => value === val);
        // 启用 -> 禁用，禁用、草稿 -> 启用
        const targetStatus = val === ENABLESTATUS.ENABLE.value
          ? ENABLESTATUS.DISENABLE.value
          : ENABLESTATUS.ENABLE.value;
        const targetText = Object.values(ENABLESTATUS).find(
          ({ value }) => value === targetStatus).text;

        const text = (
          <Popconfirm
            placement="top"
            title={`确认${targetText}？`}
            okText="确认"
            cancelText="取消"
            onConfirm={handleOperate.bind(me, {
              brandId: record.brandId,
              status: targetStatus,
            }, 'goodsBrand', 'status', targetText)}
          >
            <a>{current?.text}</a>
          </Popconfirm>
        );

        const permission = targetStatus === ENABLESTATUS.ENABLE.value
          ? [OPERPORT_JIAJU_BRANDLIST_ENABLE]
          : targetStatus === ENABLESTATUS.DISENABLE.value
            ? [OPERPORT_JIAJU_BRANDLIST_DISABLE]
            : [];

        return (
          <Authorized authority={permission} noMatch={current?.text}>
            <Badge status={current?.color} text={text} />
          </Authorized>
        );
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
      render: (val, record) => {
        return (
          record.status === 3
            ? (
              <Authorized authority={[OPERPORT_JIAJU_BRANDLIST_DELETE]}>
                <Popconfirm placement="top" title="确认删除？" onConfirm={handleRemove.bind(me, { brandId: val.brandId }, 'goodsBrand')} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              </Authorized>
            )
            : ''
        );
      },
    },
  ];
};
