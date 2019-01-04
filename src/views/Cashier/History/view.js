import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import AsyncCascader from 'components/AsyncCascader';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { Card, Input, Select, DatePicker, Button, Modal } from 'antd';
import { goTo } from 'utils/utils';
import React, { PureComponent } from 'react';
import cookie from 'cookies-js';
import { getPrefix } from 'utils/attr/exportFile';
import moment from 'moment';
import { connect } from 'dva';
import getColumns from './columns';
import './view.less';

const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ cashier, loading, exportFile }) => ({
  cashier,
  exportFile,
  loading: loading.models.cashier,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {};

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = async (values = {}) => {
    const { dispatch } = this.props;
    const { ArrayTime, rate } = values;
    let accountDateStart;
    let accountDateEnd;
    if (ArrayTime && Array.isArray(ArrayTime)) {
      if (ArrayTime.length) {
        [accountDateStart, accountDateEnd] = ArrayTime;
        accountDateStart = String(moment(accountDateStart).unix()).padEnd(13, 0);
        accountDateEnd = String(moment(accountDateEnd).unix()).padEnd(13, 0);
      }
    }
    const newRate = Math.round(rate * 100);
    const newValues = { ...values, rate: newRate, accountDateStart, accountDateEnd };
    delete newValues.ArrayTime;
    const res = await dispatch({
      type: 'cashier/queryHisAccount',
      payload: newValues,
    });
    if (res) this.setState({ total: res.pagination.total, newValues });
  }
  // 导出 /gres/account/export
  handleExport = () => {
    const { newValues: stateOfSearch, total: totalCount } = this.state;
    const { dispatch } = this.props;

    const exportData = {
      prefix: 900003,
      page: {
        pageSize: 500,
        totalCount,
      },
      param: `param=${JSON.stringify(stateOfSearch)}`,
      dataUrl: getPrefix('ht-fc-pms-server/gres/account/export'),
      token: cookie.get('x-manager-token'),
      loginType: 7,
    };

    dispatch({
      type: 'exportFile/startExportFileByToken',
      payload: exportData,
    }).then((suc) => {
      if (suc) {
        Modal.success({
          title: '导出',
          content: '发起导出成功，请点击按钮查看',
          okText: '前往查看',
          maskClosable: true,
          onOk() {
            goTo('/export/export/900003');
          },
        });
      }
    });
  }

  render() {
    const { loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card title="历史账务查询">
          <PanelList>
            <Search
              onSearch={this.handleSearch}
              ref={(inst) => { this.search = inst; }}
            >
              <Search.Item label="账务类别" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('accType', {
                    })(
                      <Select>
                        <Option value="1">费用</Option>
                        <Option value="2">收款</Option>
                        <Option value="3">退款</Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="付款方式" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('paymenMethodId', {
                    })(
                      <AsyncCascader
                        placeholder="全部"
                        asyncType="paymentMethod"
                        param={{ pageSize: 200 }}
                        labelParam={
                          {
                            label: 'paymentMethodName',
                            value: 'paymentMethodId',
                          }
                        }
                        queryPageType
                        filter={res => res.status === 1}
                      />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="金额" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('rate', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="单据号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('accountNo', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="入住人" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('guestName', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="房号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('roomNo', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="发生日期" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('ArrayTime', {
                    })(
                      <RangePicker />
                    )
                  )
                }
              </Search.Item>
            </Search>
            <Batch>
              <Authorized authority="PMS_ACCOUNT_HISTORICALACCOUNT_EXPORT">
                <Button
                  type="primary"
                  onClick={this.handleExport}
                >
                    导出
                </Button>
              </Authorized>
            </Batch>
            <Table
              loading={loading}
              columns={getColumns(this)}
              dataSource={this.props?.cashier?.HisAccountListData?.list}
              pagination={this.props?.cashier?.HisAccountListData?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
