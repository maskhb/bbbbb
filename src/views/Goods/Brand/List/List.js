import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { rules } from 'components/input';
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
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'goodsBrand/list',
      payload: {
        pageInfo: {
          currPage: 0,
          pageSize: 10,
        },
        ...values,
      },
    });
  }

  render() {
    const { loading, goodsBrand, searchDefault } = this.props;

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item label="名称" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('brandName', {
                      rules: rules([{
                        max: 20,
                      }]),
                    })(
                      <Input maxLength="20" />
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <a href="#/goods/brand/list/add/0">
                <Button icon="plus" type="primary">新建</Button>
              </a>
            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={goodsBrand?.list?.list}
              pagination={goodsBrand?.list?.pagination}
              disableRowSelection
              rowKey="brandId"
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
