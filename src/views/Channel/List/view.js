import React, { PureComponent } from 'react';
import { orgId } from 'utils/getParams';
import { connect } from 'dva';
import { Card, Modal, message, Button, Input } from 'antd';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import EditModal from './modal';
import getColumns from './columns';
import Authorized from 'utils/Authorized';

@connect(({ channel, loading }) => ({
  channel,
  loading: loading.models.channel,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: { },
  }
  state = {
  }

  componentDidMount() {
    this.search.handleSearch();
  }
  handleSearch = async (val = {}) => {
    await this.props.dispatch({
      type: 'channel/queryListByPage',
      payload: { ChannelPageQueryVO: { ...val, orgId: orgId() } },
    });
  }

  handleChangeStatue=(data) => {
    Modal.confirm({
      title: '提示',
      content: `确定${data.status === 1 ? '禁用' : '启用'}该渠道吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: 'channel/updateData',
          payload: {
            ...data,
            status: (data.status === 1 ? 2 : 1),
            orgId: orgId(),
          },
        });
        if (res) {
          message.success('操作成功!');
          this.handleSearch();
        }
      },
    });
  }

  handleDeleteItem=(data) => {
    // if (data?.sourceName?.length) return message.error('存在关联的业务来源，不可删除');
    Modal.confirm({
      title: '确定要删除该渠道？',
      content: '删除后该渠道将无法找回',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: 'channel/deleteChannel',
          payload: { channelVO: { ...data } },
        });
        if (res) {
          message.success('删除成功');
          this.handleSearch();
        }
      },
    });
  }

  render() {
    const { loading, searchDefault, channel } = this.props;
    return (
      <PageHeaderLayout>
        <Card
          title="渠道列表"
          extra={
            <Authorized authority={['PMS_CHANNEL_CHANNELLIST_ADD']} >
              <EditModal type="add" />
            </Authorized >
          }
        >
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={this.searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item label="渠道名称" simple>
                {({ form }) => (form.getFieldDecorator('channelName', {
                  })(<Input />))}
              </Search.Item>
            </Search>
            <Batch />
            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={channel?.ListData?.list}
              pagination={channel?.ListData?.pagination}
              disableRowSelection
            />
          </PanelList>

        </Card>
      </PageHeaderLayout>
    );
  }
}
