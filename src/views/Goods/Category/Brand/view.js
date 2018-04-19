import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Batch, Table } from 'components/PanelList';
import getColumns from './columns';

@connect(({ goodsBrand, loading }) => ({
  goodsBrand,
  loading: loading.models.goodsBrand,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
      status: 1,
    },
  };

  state = {
  };

  componentDidMount() {
    // this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'goodsBrand/list',
      payload: {
        currentPage: 1,
        pageSize: 20,
        ...values,
      },
    });
  }

  popConfirm = (val, record, confirmText) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'goodsBrand/status',
      payload: {
        id: record.id,
        status: val,
      },
    }).then(() => {
      const { status } = this.props.goodsBrand;
      if (status.msgCode === 200 && status.data) {
        message.success(`${confirmText}成功`);
        this.search.handleSearch();
      } else {
        message.error(`${confirmText}失败, ${status.message || '请稍后再试。'}`);
      }
    });
  }

  render() {
    const { loading, goodsBrand, searchDefault } = this.props;

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Batch>
              <a href="#/goods/brand/list/add/0">
                <Button icon="plus" type="primary">添加绑定品牌</Button>
              </a>
            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={goodsBrand.list}
              pagination={goodsBrand.pagination}
              disableRowSelection
              rowKey="id"
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
