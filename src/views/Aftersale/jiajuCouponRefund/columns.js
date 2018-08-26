import React from 'react';
import { format } from 'components/Const';
import moment from 'moment';
import { Button } from 'antd';
import Authorized from 'utils/Authorized';
import {
  OPERPORT_JIAJU_JIAJUQUANRETURNLIST_APPROVE,
  OPERPORT_JIAJU_JIAJUQUANRETURNLIST_SYNC,
} from 'config/permission';
// import { Link } from 'dva/router';

import { SYNC_OPTIONS, APPROVE_OPTIONS, OPERATE_TYPE_OPTIONS } from './attr';


export const getListColumns = (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'applyId',
    },
    {
      title: '订单编号',
      dataIndex: 'orderAliasCode',
    },
    {
      title: '支付单号',
      dataIndex: 'payNo',
    },
    {
      title: '家居券编号',
      dataIndex: 'jiajuQuanCode',
    },
    {
      title: '商家名称',
      dataIndex: 'merchantName',
    },
    {
      title: '金额(元)',
      dataIndex: 'amount',
      render(val) {
        return val / 100;
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 90,
      render(_, record) {
        const html = [];
        for (const o of APPROVE_OPTIONS) {
          if (o.value === record.approveState) {
            html.push(<div>{o.label}</div>);
          }
        }
        for (const o of SYNC_OPTIONS) {
          if (o.value === record.syncState) {
            html.push(<div>{o.label}</div>);
          }
        }
        return html;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createdTime',
      render(val) {
        return val ? moment(val).format(format) : '';
      },
    },
    {
      title: '申请原因',
      dataIndex: 'reason',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 140,
      render(_, record) {
        const html = [];
        if (record.approveState === 0) {
          html.push((
            <Authorized authority={OPERPORT_JIAJU_JIAJUQUANRETURNLIST_APPROVE}>
              <Button
                type="primary"
                size="small"
                style={{ marginRight: 8 }}
                onClick={() => me.handleApproveShow(record)}
              >
              审核
              </Button>
            </Authorized>));
        }

        if (record.syncState === 0 && record.approveState !== 0) {
          html.push((
            <Authorized authority={OPERPORT_JIAJU_JIAJUQUANRETURNLIST_SYNC}>
              <Button type="primary" size="small" onClick={() => me.handleSync(record)} >
              同步
              </Button>
            </Authorized>
          ));
        }
        return html;
      },
    },
  ];
};

export const getLogColumns = () => {
  return [
    {
      title: '操作时间',
      dataIndex: 'createdTime',
      render(val) {
        return val ? moment(val).format(format) : '';
      },
    },
    {
      title: '操作人',
      dataIndex: 'createdBy',
    },
    {
      title: '退款申请信息',
      dataIndex: 'info',
      render(_, record) {
        return (
          <dl>
            <dt>ID：{record.applyId}</dt>
            <dt>订单编号：{record.orderAliasCode}</dt>
            <dt>支付单号：{record.payNo}</dt>
          </dl>);
      },
    },
    {
      title: '操作类型',
      dataIndex: 'operateType',
      render(val) {
        for (const o of OPERATE_TYPE_OPTIONS) {
          if (o.value === val) {
            return o.label;
          }
        }
        // return
      },
    },
    {
      title: '操作前',
      dataIndex: 'beforeState',
      render(val) {
        for (const o of APPROVE_OPTIONS) {
          if (o.value === val) {
            return o.label;
          }
        }
      },
    },
    {
      title: '操作后',
      dataIndex: 'afterState',
      render(val) {
        for (const o of APPROVE_OPTIONS) {
          if (o.value === val) {
            return o.label;
          }
        }
      },
    },
    {
      title: '备注',
      dataIndex: 'reason',
      width: 320,
    },
  ];
};
