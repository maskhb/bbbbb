import React from 'react';
import { Badge, Popconfirm, Divider } from 'antd';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import { handleOperate, handleRemove } from 'components/Handle';
import TextBeyond from 'components/TextBeyond';
import ListImg from 'components/ListImg';
import ONLINESTATUS from 'components/OnlineStatus';
import AUDITSTATUS from 'components/AuditStatus';

export default (me, searchDefault, audit) => {
  const operateFields = audit === AUDITSTATUS.WAIT.value
    ? []
    : [{
      title: '操作',
      render: (record) => {
        return (
          <div>
            <Authorized authority="OPERPORT_JIAJU_PRORECYCLEBIN_RESTORE">
              <a onClick={handleOperate.bind(me, {
                goodsIds: [record.goodsId],
                isRecovery: 1,
              }, 'goods', 'recovery', '还原')}
              >还原
              </a>
              <Divider type="vertical" />
            </Authorized>
            <Authorized authority="OPERPORT_JIAJU_PRORECYCLEBIN_DELETE">
              <Popconfirm
                placement="top"
                title="确定删除？"
                disabled
                onConfirm={handleRemove.bind(me, {
                  goodsId: record.goodsId,
                }, 'goods')}
                okText="确认"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </Authorized>
          </div>
        );
      },
    }];

  return [
    {
      title: 'ID',
      dataIndex: 'goodsId',
    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      render(val) {
        return <ListImg url={val} />;
      },
    },
    {
      title: '标题',
      dataIndex: 'goodsName',
      render(val, record) {
        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`#/goods/list/${audit === AUDITSTATUS.WAIT.value ? 'detailwaitaudit' : 'detail'}/${record.goodsId}`}
          >
            <TextBeyond content={val} maxLength="20" width="300px" />
          </a>
        );
      },
    },
    {
      title: '所属商家',
      dataIndex: 'merchantName',
      render(val) {
        return (
          <TextBeyond content={val} maxLength="12" width="300px" />
        );
      },
    },
    {
      title: '所属分类',
      dataIndex: 'goodsCategory',
    },
    {
      title: '上下架状态',
      dataIndex: 'status',
      filters: Object.values(ONLINESTATUS),
      filteredValue: String(me.search?.props.stateOfSearch.status || searchDefault.status).split(','),
      render(val) {
        const current = Object.values(ONLINESTATUS).find(
          ({ value }) => value === val);

        const text = (
          <span>{current?.text}</span>
        );
        return (
          <Authorized authority="" noMatch={current?.text}>
            <Badge status={current?.color} text={text} />
          </Authorized>
        );
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      filters: Object.values(AUDITSTATUS).filter(v => (audit ? audit === v : true)),
      filteredValue: String(me.search?.props.stateOfSearch.auditStatus || searchDefault.auditStatus).split(','),
      render(val) {
        const current = Object.values(AUDITSTATUS).find(
          ({ value }) => value === val);
        const text = (
          <span>{current?.text}</span>
        );
        return (
          <Badge key={val} status={current?.color} text={text} />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    ...operateFields,
  ];
};
