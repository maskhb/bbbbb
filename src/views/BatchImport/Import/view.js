import React, { PureComponent } from 'react';
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

  state = {};
  componentDidMount() {
    this.handleSearch();
  }
  handleSearch = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'batchImport/list',
      payload: {},
    });
  };
  render() {
    const { batchImport, loading, searchDefault } = this.props;
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Batch />
            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={batchImport?.list}
              pagination={batchImport?.list?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
