
import React, { PureComponent } from 'react';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { connect } from 'dva';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { goTo } from 'utils/utils';
import Authorized from 'utils/Authorized';

import { Card, Modal, message } from 'antd';
import Input from 'components/input/DecorateInput';
import getColumns from './columns';
import EditModal from './modal';
@connect(({ cashier, loading }) => ({
  cashier,
  loading: loading.effects['cashier/queryList'],
}))
export default class View extends PureComponent {
  static handleTimeStr(timestamp, type) { // type 1:到00:00:00   2：到23:59:59
    let result = '';
    if (type === 1) {
      result = new Date(timestamp).setHours(0, 0, 0);
    } else if (type === 2) {
      result = new Date(timestamp).setHours(23, 59, 59);
    }
    return result;
  }
  state = {};
  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    let { accountName, ...pageInfo } = values;
    accountName = accountName?.trim();
    const accountReceivablePageVO = { ...pageInfo, accountReceivableQueryVO: { accountName } };

    return dispatch({
      type: 'cashier/queryAccountReceivable',
      payload: { accountReceivablePageVO },
    });
  };

  handleOperation = (v, type) => {
    switch (type) {
      case 'edit':
        return this.handleEdit(v);

      case 'accounting':
        return this.accounting(v);

      case 'delete':
        return this.handleDelete(v);
      default:
    }
  }

  handleEdit = async (v) => {
    console.log(v, 'edit');
  }
  handleDelete = async (v) => {
    const { dispatch } = this.props;
    if (v.usedAmount) {
      return message.error('已使用额度不为0，不能删除');
    }
    Modal.confirm({
      title: '确定要删除该账号？',
      content: '删除后该账号将无法找回',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'cashier/accountReceivableDelete',
          payload: { accountId: v.accountId },
        }).then((res) => {
          if (res) {
            message.success('删除成功');
            this.handleSearch();
          }
        });
      },
    });
  }
  accounting = (v) => {
    goTo(`/cashier/account/Finance/${v.accountId}`);
  }


  render() {
    const { cashier, loading, searchDefault } = this.props;
    return (
      <PageHeaderLayout>
        <Card
          style={{ position: 'relative' }}
          title="应收账号管理"
          extra={
            <Authorized authority={['PMS_ACCOUNT_ACCOUNTRECEIVABLE_ADD']} >
              <EditModal type="add" />
            </Authorized >
          }
        >
          <PanelList>
            <Search
              ref={(inst) => {
                this.search = inst;
              }}
              searchDefault={this.searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item label="账号名称" simple>
                {({ form }) => (form.getFieldDecorator('accountName', {
                })(<Input />))}
              </Search.Item>
            </Search>
            <Batch />
            <Table
              loading={loading}
              rowKey="orderSn"
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={cashier?.AccountReceivableListData?.list}
              pagination={cashier?.AccountReceivableListData?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
