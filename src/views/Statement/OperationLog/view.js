import React, { PureComponent } from 'react';
import { format } from 'components/Const';
import moment from 'moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Card, Table } from 'antd';

@connect(({ statement, loading }) => ({
  statement,
  loading: loading.models.statement,
}))

export default class View extends PureComponent {
  static defaultProps = {

  };

  state = {
    pageInfo: {
      total: 10,
      pageSize: 20,
      current: 1,
    },
  };

  componentDidMount() {
    this.init();
  }

  onPageChange = (page) => {
    const { current: currPage, pageSize } = page;
    this.init({ currPage, pageSize });
  }
  init = async (
    pageInfo = {
      currPage: 1,
      pageSize: 20,
    }
  ) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'statement/queryLogList',
      payload: { pageInfo },
    });
    if (res) {
      const { currPage: current, totalCount: total, pageSize, totalPage } = res;
      this.setState({ pageInfo: {
        current,
        total,
        pageSize,
        totalPage,
      } });
    }
  }


  render() {
    const { loading } = this.props;

    return (
      <PageHeaderLayout >

        <Card>
          <Table
            columns={
              [
                {
                  title: '操作时间',
                  dataIndex: 'createdTime',
                  render: current => <span>{moment(current).format(format)}</span>,
                },
                {
                  title: '操作帐号',
                  dataIndex: 'loginName',
                },
                {
                  title: '操作行为',
                  dataIndex: 'remarks',
                },
              ]
            }
            loading={loading}
            dataSource={this.props.statement?.queryLogListRes?.dataList}
            pagination={this.state.pageInfo}
            onChange={this.onPageChange}
          />
        </Card>
      </PageHeaderLayout >

    );
  }
}
