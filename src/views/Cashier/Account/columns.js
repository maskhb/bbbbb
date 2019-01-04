import Authorized from 'utils/Authorized';
import React from 'react';
import { fenToYuan } from '../../../utils/money';
import EditModal from './modal';
import styles from './view.less';
import TextBeyond from 'components/TextBeyond';

export default (me) => {
  return [
    {
      title: '账号名称',
      dataIndex: 'accountName',
    },
    {
      title: '账号代码 ',
      dataIndex: 'accountCode',
    },
    {
      title: '关联的业务来源 ',
      dataIndex: 'businessSource',
      render: val => <TextBeyond content={val || ''} maxLength={val ? 15 : 0} width="300px" />,
    },
    {
      title: '总挂账额度 ',
      dataIndex: 'totalAmountCredit',
      render: val => fenToYuan(val || 0),
    },
    {
      title: '已使用额度 ',
      dataIndex: 'usedAmount',
      render: val => fenToYuan(val || 0),
    },
    {
      title: '账号状态 ',
      dataIndex: 'status',
      render: val => ['启用', '禁用'][val - 1],
    },
    {
      title: '操作 ',
      render: (data) => {
        return (
          <div className={styles.mgr10}>
            <Authorized authority="PMS_ACCOUNT_ACCOUNTRECEIVABLE_EDIT">
              <EditModal type="edit" sourseData={data} dispatch={me.props.dispatch} />
            </Authorized>

            <Authorized authority="PMS_ACCOUNT_ACCOUNTRECEIVABLE_ACCOUNTS">
              <a onClick={() => me.handleOperation(data, 'accounting')}> 账务</a>
            </Authorized>

            <Authorized authority="PMS_ACCOUNT_ACCOUNTRECEIVABLE_DELETE">
              <a onClick={() => me.handleOperation(data, 'delete')}> 删除</a>
            </Authorized>

          </div>
        );
      },
    },
  ];
};
