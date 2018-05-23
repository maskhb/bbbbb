import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Modal } from 'antd';
import { handleOperate } from 'components/Handle';
import getColumns from './columns';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';


@connect(({ payment, loading }) => ({
  payment,
  loading: loading.models.payment,
}))

export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    list: [],
  };

  componentDidMount() {
    this.fetchlist();
  }

  fetchlist = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'payment/infolist',
      payload: { condition: { systemType: 1 } },
    }).then(() => {
      const { payment } = this.props;
      this.setState({
        list: payment?.searchPayTypeAndInfoList,
      });
    });
  }

  change = (record) => {
    const that = this;
    const TCashier = {
      payTypeKey: record.payTypeKey,
      payTypeInfoId: record.payTypeInfoId,
      infoType: record.info_type,
      info: record.info_type,
      systemType: record.systemType,
    };
    if (record.isValid === 1) { // 禁用
      TCashier.payTypeIsValid = 0;
      Modal.confirm({
        title: '是否确认禁用该支付方式？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          handleOperate.call(that, { cashier: TCashier }, 'payment', 'modifyPayTypeAndInfo', '禁用', that.fetchlist);
        },
      });
    } else if (record.isValid === 0) { // 启用
      TCashier.payTypeIsValid = 1;
      handleOperate.call(that, { cashier: TCashier }, 'payment', 'modifyPayTypeAndInfo', '启用', that.fetchlist);
    }
  }

  render() {
    const { loading } = this.props;
    const { list } = this.state;
    return (
      <PageHeaderLayout>
        <Card>
          <Table
            loading={loading}
            columns={getColumns(this)}
            dataSource={list?.dataList}
            pagination={false}
            rowKey="payTypeKey"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
