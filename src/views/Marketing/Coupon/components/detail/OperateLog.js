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
    const { dispatch, id } = this.props;

    await dispatch({
      type: 'marketing/couponLogList',
      payload: {
        businessType: 'ht-mj-promotion',
        passiveOperator: id.toString(),
        orderField: 'l.created_time',
        orderType: 'desc',
        currPage: pageInfo.currPage,
        pageSize: pageInfo.pageSize,
      },
    });
  }


  render() {
    const { loading, marketing } = this.props;
    const { couponLogList } = marketing || {};

    return (
      <Card>
        <Table
          columns={getColumns(this).logList}
          loading={loading}
          dataSource={couponLogList?.list}
          pagination={couponLogList?.pagination}
          onChange={this.onPageChange}
        />
      </Card>
    );
  }
}
