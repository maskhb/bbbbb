import Authorized from 'utils/Authorized';
import AsyncSelect from 'components/AsyncSelect';
import { Link } from 'dva/router';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { goTo } from 'utils/utils';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Select, Button, Icon, Modal, message } from 'antd';
import getColumns from './columns';
import styles from './view.less';

const { Option } = Select;
@connect(({ cashier, loading, user, login }) => ({
  cashier,
  user,
  login,
  loading: loading.effects['cashier/queryList'],
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {};

  componentDidMount() {
    this.init('new');
  }
  init = async (time) => {
    if (time === 'old') {
      const params = this.search.props.stateOfSearch;
      return this.handleSearch(params);
    }
    return this.handleSearch();
  }
  handleSearch = async (values = { pageSize: 10 }) => {
    const { orgId } = values;
    const { dispatch } = this.props;
    if (Array.isArray(orgId)) {
      values.orgId = (!orgId.length ? undefined : orgId[orgId.length - 1]); //eslint-disable-line
    }
    await dispatch({
      type: 'cashier/queryListByPage',
      payload: values,
    });
  }

  handleOperation(currentData, type) {
    const { rateCodeId, status } = currentData;
    let typeName = '';
    switch (type) {
      case 2:
        typeName = '启用';
        break;
      case 3:
        typeName = '禁用';
        break;
      case 4:
        typeName = '删除';
        break;
      default:
        break;
    }
    const params = (type === 4 ? { rateCodeId } : {
      rateCodeId,
      status: status === 1 ? 2 : 1,
    });

    Modal.confirm({
      title: '提示',
      content: `确定要${typeName}该价格代码吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const res = await this.props.dispatch({
          type: `cashier/${type === 4 ? 'rateCodeDelete' : 'updateStatus'}`,
          payload: {
            ...params,
          },
        });
        if (res) {
          message.success('操作成功!');
          this.init('old');
        }
      },
    });
  }

  handleJumpEdit=(data) => {
    const { rateCodeId } = data;
    const path = `/channel/price/edit/${rateCodeId}`;
    this.props.dispatch({
      type: 'cashier/savePageInfo',
      payload: { ...data },
    });
    goTo(path);
  }

  render() {
    const { loading, cashier } = this.props;
    return (
      <PageHeaderLayout>
        <Card
          title="价格代码管理 "
          className={styles.card}
          extra={(
            <Authorized authority="PMS_CHANNEL_PRICECODE_ADD" >
              <Link to="/channel/price/add/0">
                <Button
                  type="gray"
                >
                  <Icon type="plus" />
                  添加价格代码
                </Button>
              </Link>
            </Authorized >
          )}
        >
          <PanelList>
            <Search
              onSearch={this.handleSearch}
              ref={(inst) => { this.search = inst; }}
            >
              <Search.Item label="代码名称 " simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('rateCodeName', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="业务来源 " simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('sourceId', {
                    })(
                      <AsyncSelect />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('status', {
                    })(
                      <Select >
                        <Option value="0">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="2">禁用</Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
            </Search>
            <Batch />
            <Table
              loading={loading}
              columns={getColumns(this)}
              dataSource={cashier?.ListData?.list}
              pagination={cashier?.ListData?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
