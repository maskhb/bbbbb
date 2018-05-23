import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, DatePicker, Select, Message } from 'antd';
import Authorized from 'utils/Authorized';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from '../../../components/PanelList';
import getColumns from './columns';
import messagePushOptions from '../attr';

@connect(({ messagePush, loading }) => ({
  messagePush,
  loading: loading.models.messagePush,
}))
export default class List extends PureComponent {
  static defaultProps = {};

  state = {};

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const param = {
      condition: {
        creatorName: values?.creatorName,
        status: values?.status || 4,
        priority: values?.priority,
        targetType: values?.targetType,
        startTime: values?.sendTime?.[0] ? new Date(values.sendTime[0]).getTime() : null,
        endTime: values?.sendTime?.[1] ? new Date(values.sendTime[1]).getTime() : null,
      },
      pageSize: values?.pageInfo?.pageSize || 10,
      page: values?.pageInfo?.currPage || 1,
    };
    return dispatch({
      type: 'messagePush/list',
      payload: param,
    });
  };

  handleRePush = (rows) => {
    const { dispatch } = this.props;
    const name = '重发';
    dispatch({
      type: 'messagePush/rePush',
      payload: {
        taskId: rows[0].task.taskId,
      },
    }).then(() => {
      const { messagePush } = this.props;
      const { rePush } = messagePush;
      if (rePush) {
        Message.success(`${name}成功`);
        this.search.handleSearch();
      } else {
        Message.error(`${name}失败, ${rePush?.msg || '请稍后再试。'}`);
      }
    });
  };

  popConfirmRePush = (rows) => {
    this.handleRePush(rows);
  };

  render() {
    const { messagePush, loading, searchDefault } = this.props;
    const mesResult = messagePush?.list;
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
                    form.getFieldDecorator('creatorName', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="推送进度" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('status', {
                    })(
                      <Select>
                        <Select.Option key="4" value="4">全部</Select.Option>
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
                    form.getFieldDecorator('priority', {
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
                    form.getFieldDecorator('targetType', {
                    })(
                      <Select>
                        <Select.Option key="7" value={null}>全部</Select.Option>
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
                    form.getFieldDecorator('sendTime', {
                    })(
                      <DatePicker.RangePicker />
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <Authorized authority={['OPERPORT_JIAJU_SMSPUSH_CREATE']}>
                <a href="#/messagepush/pushlist/add/0" target="_blank">
                  <Button icon="plus" type="primary">创建短信推送任务</Button>
                </a>
              </Authorized>
            </Batch>

            <Table
              loading={loading}
              rowKey={(record, index) => `${record.task.taskId}${index}`}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={mesResult?.dataList}
              pagination={{
                current: mesResult?.currPage || 1,
                pageSize: mesResult?.pageSize || 10,
                total: mesResult?.totalCount || 0,
              }}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
