import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';
import { toFullPath } from 'utils/request/utils';
import getColumns from './columns';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';


@connect(({ pagetable, loading }) => ({
  pagetable,
  loading: loading.models.pagetable,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    list: [
      { index: 1, page: '底部导航-移动端' },
      { index: 2, page: '首页-移动端' },
      { index: 3, page: '商城页-移动端' },
      { index: 4, page: '公共导航-PC端' }],
  };

  edit = (key) => {
    switch (key) {
      case 1:
        window.open(toFullPath('/#/pagetable/list/tabbar'));
        break;
      case 2:
        window.open(toFullPath('/#/pagetable/list/homepage'));
        break;
      case 3:
        window.open(toFullPath('/#/pagetable/list/mallhome'));
        break;
      case 4:
        window.open(toFullPath('/#/pagetable/list/navItem'));
        break;
      default:
        break;
    }
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
