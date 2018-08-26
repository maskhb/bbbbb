import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import Table from 'components/TableStandard';
import getColumns from '../../../columns';


@connect(({ marketing, loading }) => ({
  marketing,
  loading: loading.models.marketing,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {

    },
  };

  state = {};

  componentDidMount() {
    this.initLog();
  }

  onPageChange = (page) => {
    const { current: currPage, pageSize } = page;
    this.initLog({ currPage, pageSize });
  }

  initLog = async (
    pageInfo = {
      currPage: 1,
      pageSize: 10,
    }
  ) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'marketing/couponBatchLogList',
      payload: {
        businessTypeList: ['COUPON_BATCH_OUT'],
        pageInfo,
      },
    });
  }


  render() {
    const { loading, marketing } = this.props;
    const { couponBatchLogList } = marketing || {};

    return (
      <Card>
        <Table
          columns={getColumns(this).batchDistributeLog}
          loading={loading}
          dataSource={couponBatchLogList?.list}
          pagination={couponBatchLogList?.pagination}
          onChange={this.onPageChange}
        />
      </Card>
    );
  }
}
