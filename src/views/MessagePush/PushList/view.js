import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, DatePicker, Select } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';
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

  handleRePush = () => {
    // const { dispatch } = this.props;
    // const name = '重发';

    // dispatch({
    //   type: 'goods/remove',
    //   payload: {
    //     id: rows.map(row => row.id).join(','),
    //   },
    // }).then(() => {
    //   const { messagePush } = this.props;
    //   const { remove } = messagePush;
    //   if (remove.result === 0) {
    //     message.success(`${name}成功`);
    //     this.search.handleSearch();
    //   } else if (remove.result === 1) {
    //     message.error(`${name}失败, ${remove.msg || '请稍后再试。'}`);
    //   }
    // });
  }

  popConfirmRePush = (rows) => {
    this.handleRePush(rows);
  }

  render() {
    const { messagePush, loading, searchDefault } = this.props;
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item label="操作账号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('id', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="推送进度" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('name', {
                    })(
                      <Select>
                        <Select.Option key="0" value="0">全部</Select.Option>
                        {messagePushOptions.TSJD.map(v =>
                          <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                        )}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="优先级" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('first', {
                    })(
                      <Select>
                        <Select.Option key="0" value="0">全部</Select.Option>
                        {messagePushOptions.YXJ.map(v =>
                          <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                        )}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="目标用户" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('aimed', {
                    })(
                      <Select>
                        <Select.Option key="0" value="0">全部</Select.Option>
                        {messagePushOptions.MBYH.map(v =>
                          <Select.Option key={v.key} value={v.value}>{v.label}</Select.Option>
                        )}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="推送开始时间" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('createdTime', {
                    })(
                      <DatePicker.RangePicker />
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <a href="#/messagepush/pushlist/add/0">
                <Button icon="plus" type="primary">创建短信推送任务</Button>
              </a>
            </Batch>

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
