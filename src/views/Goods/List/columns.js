import React from 'react';
import { Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { OPERPORT_JIAJU_PRODUCTLIST_PUBLISH, OPERPORT_JIAJU_PRODUCTLIST_UNPUBLISH,
  OPERPORT_JIAJU_PRODUCTLIST_DELETE, OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE } from 'config/permission';
import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import { handleOperate, handleRemove } from 'components/Handle';
import TextBeyond from 'components/TextBeyond';
import TextPopover from 'components/TextPopover';
import ListImg from 'components/ListImg';
import ONLINESTATUS from 'components/OnlineStatus';
import AUDITSTATUS from 'components/AuditStatus';

export default (me, searchDefault) => {
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
          <a target="_blank" href={`#/goods/list/detail/${record.goodsId}`}><TextBeyond content={val} maxLength="12" width="300px" /></a>
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
      render(val, record) {
        const current = Object.values(ONLINESTATUS).find(
          ({ value }) => value === val);
        const targetStatus = val === ONLINESTATUS.ON.value
          ? ONLINESTATUS.OFF.value
          : ONLINESTATUS.ON.value;
        const targetText = Object.values(ONLINESTATUS).find(
          ({ value }) => value === targetStatus).text;
        const text = (
          <Popconfirm
            placement="top"
            title={`确认${targetText}？`}
            onConfirm={handleOperate.bind(me, {
              goodsIds: [record.goodsId],
              status: targetStatus,
            }, 'goods', 'online', targetText)}
            okText="确认"
            cancelText="取消"
          >
            <a>{current?.text}</a>
          </Popconfirm>
        );

        const auditStatusArray = [AUDITSTATUS.WAIT.value, AUDITSTATUS.SUCCESS.value];
        const fText = auditStatusArray.includes(record.auditStatus) ? text : current?.text;

        const permission = targetStatus === ONLINESTATUS.ON.value
          ? [OPERPORT_JIAJU_PRODUCTLIST_PUBLISH]
          : targetStatus === ONLINESTATUS.OFF.value
            ? [OPERPORT_JIAJU_PRODUCTLIST_UNPUBLISH]
            : [];

        return (
          <Authorized authority={permission} noMatch={current?.text}>
            <Badge status={current?.color} text={fText} />
          </Authorized>
        );
      },
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      filters: Object.values(AUDITSTATUS),
      filteredValue: String(me.search?.props.stateOfSearch.auditStatus || searchDefault.auditStatus).split(','),
      render(val, record) {
        const current = Object.values(AUDITSTATUS).find(
          ({ value }) => value === val);

        let { text } = current;

        // 待审核 + 非复制商品
        if (val === AUDITSTATUS.WAIT.value && record.isCopy === 1) {
          text = (
            <Authorized
              authority={[OPERPORT_JIAJU_TOAPPROVEPROLIST_APPROVE]}
              noMatch={current.text}
            >
              <a onClick={me.modalAuditShow.bind(me, record)}>{current.text}</a>
            </Authorized>
          );
        }

        // 待审核 + 复制商品
        if (val === AUDITSTATUS.WAIT.value && record.isCopy === 2) {
          text = <TextPopover content={current?.text} tip="复制商品" />;
        }

        // 审核不通过
        if (val === AUDITSTATUS.FAIL.value) {
          text = <TextPopover content={current?.text} tip={record.auditOpinion} />;
        }

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
    {
      title: '操作',
      render: (record) => {
        return (
          record.status !== ONLINESTATUS.ON.value
            ? (
              <Authorized authority={[OPERPORT_JIAJU_PRODUCTLIST_DELETE]}>
                <Popconfirm
                  placement="top"
                  title="确认删除？"
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
            )
            : ''
        );
      },
    },
  ];
};
