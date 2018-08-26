import { format } from 'components/Const';

import { Button /*  Modal */ } from 'antd';
import React from 'react';
import Authorized from 'utils/Authorized';
import { toFullPath } from 'utils/request/utils';
// import TextBeyond from 'components/TextBeyond';
import moment from 'moment';
import { Link } from 'dva/router';
import { fenToYuan } from 'utils/money';

import styles from './view.less';

export default (me) => {
  function renderOperat(val) {
    const { flagDo, flagAgree, flagCancel } = me.checkStatus(val) || {};
    const debug = false;
    return (
      <div className={styles.inline}>
        <Authorized authority="OPERPORT_JIAJU_REFUNDLIST_DETAILS" >
          <Link to={`/aftersale/refund/detail/${val.refundSn}`}>
            <Button>
            详情
            </Button>
          </Link>
        </Authorized>
        {
          flagDo || debug ? (
            <Authorized authority="OPERPORT_JIAJU_REFUNDLIST_REFUND" >

              <Link to={`/aftersale/refund/perform/${val.refundSn}`}>
                <Button>
                执行退款
                </Button>
              </Link>
            </Authorized>

          ) : ''
        }

        {
          flagAgree || debug ? (
            <Authorized authority="OPERPORT_JIAJU_REFUNDLIST_AGREE" >
              <Button
                type="primary"
                onClick={() => me.handleAgreeRefund(val)}
              >
              同意退款
              </Button>
            </Authorized>

          ) : ''
        }
        {
          flagCancel || debug ? (
            <Authorized authority="OPERPORT_JIAJU_REFUNDLIST_CANCEL" >
              <Button
                type="primary"
                onClick={() => me.handleCancelRefund(val)}
              >
              取消退款单
              </Button>
            </Authorized>

          ) : ''
        }
      </div>
    );
  }

  return [
    {
      title: '退款单编号  ',
      dataIndex: 'refundSn',
    },
    {
      title: '母订单编号',
      dataIndex: 'parentOrderSn',
      render: (val, data) => {
        const url = toFullPath(`/#/order/list/detail/0/${data.parentOrderId}`);
        return (
          <a href={url} rel="noopener noreferrer" target="_blank">
            {val}
          </a>
        );
      },
    },
    {
      title: '子订单编号',
      dataIndex: 'orderSn',
      render: (val, data) => {
        const url = toFullPath(`/#/order/list/detail/1/${data.orderId}`);
        return (
          <a href={url} rel="noopener noreferrer" target="_blank">
            {val}
          </a>
        );
      },
    },
    {
      title: '退货单号',
      dataIndex: 'returnSn',
      render: (val) => {
        const url = toFullPath(`/#/aftersale/returnbill/detail/${val}`);
        return (
          <a href={url} rel="noopener noreferrer" target="_blank">
            {val}
          </a>
        );
      },
    },
    {
      title: '所属商家',
      dataIndex: 'merchantName',
    },
    {
      title: '所属厂家',
      dataIndex: 'factoryName',
    },
    {
      title: '订单成交金额',
      dataIndex: 'orderAmountReal',
      render(val) {
        return fenToYuan(val || 0);
      },
    },

    {
      title: '退款意向金额',
      dataIndex: 'intentRefundAmount',
      render(val) {
        return fenToYuan(val || 0);
      },
    },
    {
      title: '实际退款金额',
      dataIndex: 'hasRefundAmount',
      render(val) {
        return fenToYuan(val || 0);
      },
    },
    {
      title: '服务类型',
      dataIndex: 'serviceType',
      render: val => ['退货退款', '换货', '仅退款', '仅退款（超额支付）'][val - 1],
    },
    {
      title: '申请单申请时间',
      dataIndex: 'createdTime',
      render: current => <span>{moment(current).format(format)}</span>,
    },
    {
      title: '申请单创建人',
      dataIndex: 'createdByNick',
    },
    {
      title: '审核状态',
      dataIndex: 'afterSaleStatus',
      render: val => ['待审核', '同意退货', '同意退款', '同意换货', ' 已取消', '同意线下退款', '同意线下退货', '同意线下换货'][val],
    },
    {
      title: '退款状态',
      dataIndex: 'refundStatus',
      render: val => ['未退款', '退款中', '已退款', '无需退款', '已取消', '已退款（系统）'][val],
    },
    {
      title: '关闭状态',
      dataIndex: 'shutDownStatus',
      render: val => ['', '未关闭', '已关闭'][val],

    },
    {
      title: '最后修改时间',
      dataIndex: 'updatedTime',
      render: current => <span>{moment(current).format(format)}</span>,
    },
    {
      title: '操作',
      render: val => renderOperat(val),
    },
  ];
};
