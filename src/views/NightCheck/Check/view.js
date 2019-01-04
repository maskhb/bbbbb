import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Button } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import Authorized from 'utils/Authorized';
import getColumns from './columns';

@connect(({ nightCheck, loading }) => ({
  nightCheck,
  loading: loading.models.nightCheck,
}))
export default class List extends PureComponent {
  static defaultProps = {};

  state = {};

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const param = {
      nightAuditRecordPageVO: {
        nightAuditRecordVO: {
          orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
        },
        currPage: values?.currPage || 1,
        pageSize: values?.pageSize || 10,
      },
    };
    return dispatch({
      type: 'nightCheck/list',
      payload: param,
    });
  };

  render() {
    const { nightCheck, loading, searchDefault } = this.props;
    const mesResult = nightCheck?.list;
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            {/* 搜索条件 */}
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            />
            <Batch>
              <Authorized authority={['PMS_NIGHTTRIAL_NIGHTTRIAL_IMPLEMENT']}>
                <Link to="/nightcheck/check/introduce"><Button type="primary">执行夜审</Button></Link>
              </Authorized>
            </Batch>
            {/* 列表部分 */}
            <Table
              loading={loading}
              rowKey={(record, index) => `${record.recordId}${index}`}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={mesResult?.dataList}
              pagination={{
                current: mesResult?.currPage || 1,
                pageSize: mesResult?.pageSize || 10,
                total: mesResult?.totalCount || 0,
              }}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
