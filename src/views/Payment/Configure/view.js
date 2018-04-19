import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';
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
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'payment/getList',
    //   payload: {},
    // }).then(() => {
    //   const { payment } = this.props;
    //   this.setState({
    //     list: payment?.list,
    //   });
    // });
    dispatch({
      type: 'payment/getList',
      payload: {},
    });
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
            dataSource={list}
            pagination={false}
            rowKey="index"
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
