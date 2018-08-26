import React, { PureComponent } from 'react';
import { format } from 'components/Const';
import { Table } from 'antd';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import ReimburseBtn from '../ReimburseBtn';


class Reimburse extends PureComponent {
  static defaultProps = {};


  getColumns = (type = 'detail') => {
    const columnsDetail = [
      {
        title: '退款方式',
        dataIndex: 'paymentMethodName',
        key: 'paymentMethodName',
      },
      {
        title: '意向金额',
        dataIndex: 'intentRefundAmountFormat',
        key: 'intentRefundAmountFormat',
      },
      {
        title: '实际退款金额',
        dataIndex: 'hasRefundAmountFormat',
        key: 'hasRefundAmountFormat',
        render: (val, data) => (data.refundStatus === 0 ? '' : val),
      },
      {
        title: '是否已退款',
        dataIndex: 'refundStatus', // 退款状态（0：未退款；1：退款中；2：已退款；3：无需退款；4：已取消）
        key: 'refundStatus',
        render: val => ['未退款', '退款中', '已退款', '无需退款', '已取消'][val],
      },
      {
        title: '退款时间',
        dataIndex: 'refundTimeFormat',
        key: 'refundTimeFormat',
      },
      {
        title: '退款系统备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '交易流水号',
        dataIndex: 'transactionId',
        key: 'transactionId',
      },
      {
        title: '失效日期',
        dataIndex: 'expiryTime',
        key: 'expiryTime',
        render: (val) => {
          return (val ? moment(val).format(format) : '');
        },
      },
      {
        title: '开户行',
        dataIndex: 'bankName',
        key: 'bankName',
      },
      {
        title: '开户名称',
        dataIndex: 'accountName',
        key: 'accountName',
      },
      {
        title: '银行账号',
        dataIndex: 'bankAccount',
        key: 'bankAccount',
      },
    ];

    /* 执行退款 */

    const columnsPerform = [
      {
        title: '退款方式',
        dataIndex: 'paymentMethodName',
        key: 'paymentMethodName',
      },
      {
        title: '意向金额',
        dataIndex: 'intentRefundAmountFormat',
        key: 'intentRefundAmountFormat',
      },
      {
        title: '实际退款金额',
        dataIndex: 'hasRefundAmountFormat',
        key: 'hasRefundAmountFormat',
        render: (val, data) => (data.refundStatus === 0 ? '' : val),
      },
      {
        title: '是否已退款',
        dataIndex: 'refundStatus', // 退款状态（0：未退款；1：退款中；2：已退款；3：无需退款；4：已取消）
        key: 'refundStatus',
        render: val => ['未退款', '退款中', '已退款', '无需退款', '已取消'][val],
      },
      {
        title: '退款操作',
        render: (data = 0) => {
          return [2, 3, 4].includes(Number(data.refundStatus)) ? '' : (
            <Authorized authority={
              ['OPERPORT_JIAJU_REFUNDLIST_REFUND']
              }
            >
              <ReimburseBtn {...this.props} data={data} />
            </Authorized>
          );
        },
      },
      {
        title: '退款时间',
        dataIndex: 'refundTimeFormat',
        key: 'refundTimeFormat',
      },
      {
        title: '退款系统备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '交易流水号',
        dataIndex: 'transactionId',
        key: 'transactionId',
      },
      {
        title: '失效日期',
        dataIndex: 'expiryTime',
        key: 'expiryTime',
        render: (val) => {
          return (val ? moment(val).format(format) : '');
        },
      },
      {
        title: '开户行',
        dataIndex: 'bankName',
        key: 'bankName',
      },
      {
        title: '开户名称',
        dataIndex: 'accountName',
        key: 'accountName',
      },
      {
        title: '银行账号',
        dataIndex: 'bankAccount',
        key: 'bankAccount',
      },
    ];

    return (type === 'detail' ? columnsDetail : columnsPerform);
  }


  render() {
    const { loading, refundIntentionList, detailVO, type } = this.props;

    return (
      <Table
        columns={this.getColumns(type)}
        dataSource={refundIntentionList || detailVO?.refundIntentionList}
        loading={loading}
      />
    );
  }
}

export default Reimburse;
