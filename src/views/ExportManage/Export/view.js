import React, { PureComponent } from 'react';
import { parse } from 'qs';
import { connect } from 'dva';
import { Card } from 'antd';
import PanelList, { Batch, Table } from '../../../components/PanelList';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';

@connect(({ batchImport, loading }) => ({
  batchImport,
  loading: loading.models.batchImport,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };
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
    this.handleSearch();
  }
  handleSearch = (values = {}) => {
    const { dispatch, location: { search } } = this.props;
    const { prefix } = parse(search?.substring(1));
    const currentTime = new Date();
    const param = {
      condition: {
        platformType: 2,
        createdTimeEnd: View.handleTimeStr(currentTime.getTime(), 2),
        createdTimeStart: View.handleTimeStr(currentTime.setDate(currentTime.getDate() - 7), 1),
      },
      page: {
        pageSize: values.pageSize || 10,
        currentPage: values.current || 1,
      },
    };
    if (prefix) {
      param.condition.prefixList = [prefix];
    }
    return dispatch({
      type: 'batchImport/exportList',
      payload: param,
    });
  };
  render() {
    const { batchImport, loading, searchDefault } = this.props;
    const expResult = batchImport?.exportList;
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Batch />
            <Table
              loading={loading}
              rowKey={(record, index) => `${record.exportId}${index}`}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={expResult?.dataList || []}
              scroll={{ y: 550 }}
              pagination={{
                current: expResult?.currPage || 1,
                pageSize: expResult?.pageSize || 10,
                total: expResult?.totalCount || 0,
              }}
              disableRowSelection
              onChange={this.handleSearch}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
