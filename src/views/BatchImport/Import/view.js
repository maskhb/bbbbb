import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import qs from 'qs';
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
  handleSearch = () => {
    const { dispatch } = this.props;
    const currentTime = new Date();
    let businessTypeList = ['MERCHANT_IMPORT', 'MERCHANT_ACCOUNT_IMPORT', 'IMPORT_MEMBERS', 'GOODS_BATCH_UPDATE'];
    const param = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    if (param.businessType) {
      businessTypeList = [param.businessType];
    }
    return dispatch({
      type: 'batchImport/list',
      payload: {
        importLogPageVo: {
          businessTypeList,
          createEndTime: View.handleTimeStr(currentTime.getTime(), 2),
          createStartTime: View.handleTimeStr(currentTime.setDate(currentTime.getDate() - 7), 1),
          pageInfo: {
            pageSize: 10000,
            currPage: 1,
          },
        },
      },
    });
  };
  render() {
    const { batchImport, loading, searchDefault } = this.props;
    const importList = batchImport?.list;
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Batch />
            <Table
              loading={loading}
              scroll={{ y: 550 }}
              rowKey={(record, index) => `${record.logId}${index}`}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={importList?.dataList || []}
              pagination={false}
              totalCount={importList?.totalCount}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
