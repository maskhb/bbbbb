import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { Link } from 'dva/router';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button } from 'antd';
import { Table } from 'components/PanelList';
import getColumns from './columns';
// import res from '../../mockData';/* 本地数据 */

@connect(({ business, loading }) => ({
  /* redux传入 @:装饰器 */
  business,
  loading: loading.models.business,
}))
export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
  };
  componentWillMount() {
    // console.log(this.props);
  }

  render() {
    const { name } = this.props.match.params;
    const { loading, searchDefault, business } = this.props;
    return (
      <PageHeaderLayout>
        <h1>{`经销商名称：${name}`}</h1>
        <Card title="经销商账号管理">
          <Link to="/business/List/AddAccount/0">
            <Button type="primary" >
            新增帐号
            </Button>
          </Link>

          <Table
            loading={loading}
            searchDefault={searchDefault}

            columns={getColumns(this, searchDefault)}
            dataSource={business?.list?.list}
            pagination={business?.list?.pagination}
          />

        </Card>
      </PageHeaderLayout>
    );
  }
}
