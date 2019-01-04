import React, { PureComponent } from 'react';
import { orgId } from 'utils/getParams';
import { connect } from 'dva';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { Card, Modal, message, Input } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import getColumns from './columns';
import EditModal from './modal';
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
    /* pagination: {
      current: 1,
      total: 1,
      pageSize: 10,
    }, */
  }

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = async (val = {}) => {
    let { sourceName } = val;
    sourceName = sourceName?.trim();
    const params = { accountReceivableQueryVO: { ...val, sourceName, orgId: orgId() } };
    const res = await this.props.dispatch({
      type: 'channel/querySourceListByPage',
      payload: params,
    });
    console.log({ res });
  }

  handleChangeStatue=(data) => {
    Modal.confirm({
      title: '提示',
      content: `确定${data.status === 1 ? '禁用' : '启用'}该渠道吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: 'channel/updateSourceStatus',
          payload: {
            sourceId: data.sourceId,
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
    if (data?.rateCodeName?.length) return message.error('存在关联的价格代码，不可删除');
    Modal.confirm({
      title: '确定要删除该渠道？',
      content: '删除后该渠道将无法找回',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: 'channel/deleteSource',
          payload: { sourceVO: { ...data } },
        });
        if (res) {
          message.success('删除成功');
          this.handleSearch();
        }
      },
    });
  }

  /* handleTableChange = (pagination) => {
    this.setState({ pagination });
    setTimeout(() => {
      this.handleSearch();
    }, 0);
  } */

  render() {
    const { loading, searchDefault, channel } = this.props;
    return (
      <PageHeaderLayout>
        <Card
          title="业务来源列表"
          extra={
            <Authorized authority={['PMS_CHANNEL_BUSINESSSOURCES_ADD']} >
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
              <Search.Item label="业务来源" simple>
                {({ form }) => (form.getFieldDecorator('sourceName', {
                })(<Input />))}
              </Search.Item>
            </Search>
            <Batch />
            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={channel?.SourceListData?.list}
              pagination={channel?.SourceListData?.pagination}
              // onChange={this.handleTableChange}
              disableRowSelection
            />
          </PanelList>

        </Card>
      </PageHeaderLayout>
    );
  }
}
