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
  };

  state = {};

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const param = {
      condition: {
        phone: values?.phone,
        platformType: values?.platformType,
        triggerCondition: values?.triggerCondition,
        targetType: values?.targetType,
        sendStartTime: values?.operateTime?.[0] ? new Date(values.operateTime[0]).getTime() : null,
        sendEndTime: values?.operateTime?.[1] ? new Date(values.operateTime[1]).getTime() : null,
      },
      pageSize: values?.pageInfo?.pageSize || 10,
      page: values?.pageInfo?.currPage || 1,
    };
    return dispatch({
      type: 'messagePush/recordList',
      payload: param,
    });
  };

  render() {
    const { messagePush, loading, searchDefault } = this.props;
    const recordResult = messagePush?.recordList;
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
                    form.getFieldDecorator('phone', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="业务类型" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('platformType', {
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
                    form.getFieldDecorator('triggerCondition', {
                    })(
                      <Select>
                        <Select.Option key="-1" value={null}>全部</Select.Option>
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
                    form.getFieldDecorator('operateTime', {
                    })(
                      <DatePicker.RangePicker />
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Table
              loading={loading}
              rowKey={(record, index) => `${record.phone}${index}`}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={recordResult?.dataList}
              pagination={{
                current: recordResult?.currPage || 1,
                pageSize: recordResult?.pageSize || 10,
                total: recordResult?.totalCount || 0,
              }}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
