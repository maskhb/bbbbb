import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Button, Tabs } from 'antd';
import moment from 'moment/moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import getColumns from './columns';
import styles from '../../index.less';

@connect(({ nightCheck, loading }) => ({
  nightCheck,
  loading: loading.models.nightCheck,
}))
export default class List extends PureComponent {
  static defaultProps = {};

  state = {
    currentTab: '1',
  };
  componentDidMount() {
    this.search.handleSearch();
  }
  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const { currentTab } = this.state;
    const param = {
      type: Number(currentTab),
      orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
      currentPage: values?.pageInfo?.currPage || 1,
      pageSize: values?.pageInfo?.pageSize || 10,
    };
    return dispatch({
      type: 'nightCheck/checkList',
      payload: param,
    });
  };
  tabChange(currentTab) {
    const { dispatch } = this.props;
    dispatch({
      type: 'nightCheck/checkList',
      payload: {
        type: Number(currentTab),
        orgId: Number(JSON.parse(localStorage.user).orgIdSelected),
        currentPage: 1,
        pageSize: 10,
      },
    }).then(() => {
      this.setState({
        currentTab,
      });
    });
  }
  renderTab() {
    const { nightCheck, loading, searchDefault } = this.props;
    const mesResult = nightCheck?.checkList;
    const that = this;
    return (
      <Table
        loading={loading}
        rowKey={(record, index) => `${record.gresId}${index}`}
        searchDefault={searchDefault}
        columns={getColumns(this, searchDefault)}
        dataSource={mesResult?.pageQuery?.dataList}
        onChange={(pagination) => {
          that.handleSearch({
            pageInfo: {
              currPage: pagination.current,
              pageSize: pagination.pageSize,
            },
          });
        }}
        pagination={{
          current: mesResult?.pageQuery?.currPage || 1,
          pageSize: mesResult?.pageQuery?.pageSize || 10,
          total: mesResult?.pageQuery?.totalCount || 0,
        }}
        disableRowSelection
      />
    );
  }
  render() {
    const { nightCheck, searchDefault } = this.props;
    const { currentTab } = this.state;
    const mesResult = nightCheck?.checkList;
    return (
      <PageHeaderLayout>
        <Card>
          <div className={styles.title}>
            <div className={styles.titleName}>执行夜审_价格核对</div>
            <div className={styles.time}>当前营业日：{moment(new Date(mesResult?.businessTime)).format('YYYY-MM-DD')}</div>
            <Link to="/nightcheck/check/confirm"><Button className={styles.nextButton} type="primary">下一步</Button></Link>
          </div>
          <PanelList>
            {/* 搜索条件 */}
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            />
            <Batch />
            <Tabs type="card" onChange={this.tabChange.bind(this)} activeKey={currentTab}>
              <Tabs.TabPane tab={`非标准房价入住的房间(${mesResult?.realPriceCount || 0})`} key="1">{this.renderTab()}</Tabs.TabPane>
              <Tabs.TabPane tab={`标准房价入住的房间(${mesResult?.stdPriceCount || 0})`} key="2">{this.renderTab()}</Tabs.TabPane>
            </Tabs>
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
