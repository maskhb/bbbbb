// import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
// import AsyncCascader from 'components/AsyncCascader';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Card, Input, DatePicker } from 'antd';
import getColumns from './columns';
import './view.less';

const { RangePicker } = DatePicker;

@connect(({ cashier, loading }) => ({
  cashier,
  loading: loading.effects['cashier/queryList'],
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
    console.log(values) //eslint-disable-line
    const { owner, paymentDate, roomNo, ...pageInfo } = values;

    const { dispatch } = this.props;

    // 更改数据符合接口定义
    let regTimeStart;
    let regTimeEnd;
    if (paymentDate && Array.isArray(paymentDate)) {
      if (paymentDate.length) {
        [regTimeStart, regTimeEnd] = paymentDate;
        regTimeStart = new Date(moment(regTimeStart)).getTime();
        regTimeEnd = new Date(moment(regTimeEnd)).getTime();
      }
    }
    const params = {
      ...pageInfo,
      tempAccountRegQueryVO: { regTimeStart, regTimeEnd, owner, roomNo },
    };

    await dispatch({
      type: 'cashier/queryTempAccountReg',
      payload: params,
    });
  }

  render() {
    const { loading, cashier } = this.props;

    return (
      <PageHeaderLayout>
        <Card title="临时挂账登记单列表">
          <PanelList>
            <Search
              onSearch={this.handleSearch}
              ref={(inst) => { this.search = inst; }}
            >
              <Search.Item label="房间号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('roomNo', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="入住人" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('owner', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="挂账日期" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('paymentDate', {
                    })(
                      <RangePicker />
                    )
                  )
                }
              </Search.Item>
            </Search>
            <Batch />
            <Table
              rowKey={(record, index) => `${record.communityId}${index}`}
              loading={loading}
              columns={getColumns(this)}
              dataSource={cashier?.TempAccountListData?.list}
              pagination={cashier?.TempAccountListData?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
