import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, DatePicker, Select } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PanelList, { Search, Table } from '../../../components/PanelList';
import getColumns from './columns';
import messagePushOptions from '../attr';

@connect(({ messagePush, loading }) => ({
  messagePush,
  loading: loading.models.messagePush,
}))
export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {
      auditStatus: 1,
      onlineStatus: 0,
    },
  };

  state = {};

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'messagePush/list',
      payload: values,
    });
  }

  render() {
    const { messagePush, loading, searchDefault } = this.props;
    // console.log(messagePush);
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item label="收信人" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('id', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="业务类型" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('name', {
                    })(
                      <Select>
                        <Select.Option key="0" value="0">全部</Select.Option>
                        {messagePushOptions.YWLX.map(v =>
                          <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                        )}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="触发条件" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('first', {
                    })(
                      <Select>
                        <Select.Option key="0" value="0">全部</Select.Option>
                        {messagePushOptions.CFTJ.map(v =>
                          <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                        )}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="推送时间" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('aimed', {
                    })(
                      <DatePicker.RangePicker />
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={messagePush?.list?.list}
              pagination={messagePush?.list?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
