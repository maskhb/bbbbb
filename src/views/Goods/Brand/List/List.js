import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { rules } from 'components/input';
import ENABLEALLSTATUS from 'components/EnableStatus/ENABLEALLSTATUS';
import getColumns from './columns';
import { optionsToHtml } from '../../../../components/DataTransfer';

const statusOptions = optionsToHtml(Object.keys(ENABLEALLSTATUS).map((key) => {
  return {
    label: ENABLEALLSTATUS[key].text,
    value: ENABLEALLSTATUS[key].value,
  };
}));

@connect(({ goodsBrand, loading }) => ({
  goodsBrand,
  loading: loading.models.goodsBrand,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
      status: ENABLEALLSTATUS.ALL.value,
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
              <Search.Item label="品牌名称" simple>
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
              <Search.Item label="开启状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('status', {
                      initialValue: 0,
                    })(
                      <Select placeholder="请选择">
                        {statusOptions}
                      </Select>
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <a href="#/goods/brand/list/add/0">
                <Button icon="plus" type="primary">添加品牌</Button>
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
