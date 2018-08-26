import { fenToYuan } from 'utils/money';
import React from 'react';
import { MonitorInput } from 'components/input';

import styles from './styles.less';

export const RefundInfoColumns = (self) => {
  const { isEdit = false } = self.props;
  return {
    rowKey(row) {
      return row.transactionId;
    },
    columns: [
      {
        title: '退款方式',
        dataIndex: 'paymentMethodName',
      },
      {
        title: '意向金额',
        dataIndex: 'intentRefundAmountFormat',
        render(val, row) {
          if (val) {
            return val;
          } else if (row.intentRefundAmount) {
            return fenToYuan(row.intentRefundAmount, false);
          }
          return 0;
        },
      },
      {
        title: '交易流水号',
        dataIndex: 'transactionId',
      },
      {
        title: '失效日期',
        dataIndex: 'expiryTimeFormat',
      },
      {
        title: '银行账号',
        dataIndex: 'bankAccount',
        render(val, record) {
          if (isEdit) {
            return (
              <div className={styles.td_monitor_input_wrapper}>
                <MonitorInput
                  maxLength={30}
                  defaultValue={val}
                  onChange={self.handleChangeAttr.bind(self, record, 'bankAccount')}
                />
              </div>
            );
          }
          return val;
        },
      },
      {
        title: '开户行',
        dataIndex: 'bankName',
        render(val, record) {
          if (isEdit) {
            return (
              <div className={styles.td_monitor_input_wrapper}>
                <MonitorInput
                  maxLength={30}
                  defaultValue={val}
                  onChange={self.handleChangeAttr.bind(self, record, 'bankName')}
                />
              </div>
            );
          }
          return val;
        },
      },
      {
        title: '开户名称',
        dataIndex: 'accountName',
        render(val, record) {
          if (isEdit) {
            return (
              <div className={styles.td_monitor_input_wrapper}>
                <MonitorInput
                  maxLength={30}
                  defaultValue={val}
                  onChange={self.handleChangeAttr.bind(self, record, 'accountName')}
                />
              </div>
            );
          }
          return val;
        },
      },
    ],
  };
};
