import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch } from 'components/PanelList';
import React, { PureComponent } from 'react';
import cookie from 'cookies-js';
import { goTo } from 'utils/utils';
import { formatDate } from 'utils/getParams';
import { fenToYuan } from 'utils/money';
import { getExportParams, getPrefix } from 'utils/attr/exportFile';
import { connect } from 'dva';
import { Card, Input, DatePicker, Tabs, Button, message, Modal, Table } from 'antd';
// import getColumns from './columns';
import AccountList from './components/AccountList';
import styles from './view.less';
import { isTemplateSpan } from 'typescript';
import Download from 'components/Download';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
@connect(({ cashier, exportFile, loading }) => ({
  cashier,
  exportFile,
  loading: loading.models.cashier,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
    BtnShow: true,
    settlementStatus: 2, // 结算状态1 结算 2 未结算
  };
  componentDidMount=async () => {
    const { dispatch, match: { params: { accountId } } } = this.props;
    /* 根据id查一下详情 */
    await dispatch({
      type: 'cashier/queryCreditAccountDetails',
      payload: { accountId },
    });
    this.search.handleSearch();
  }

  handleSearch = async (values = {}) => {
    const { settlementStatus } = this.state;
    const { dispatch, match: { params: { accountId } } } = this.props;
    const { businessDate, checkInDate, checkOutDate } = values;
    const { businessDateStart, businessDateEnd } = formatDate(businessDate, 'businessDateStart', 'businessDateEnd');
    const { checkInDateStart, checkInDateEnd } = formatDate(checkInDate, 'checkInDateStart', 'checkInDateEnd');
    const { checkOutDateStart, checkOutDateEnd } = formatDate(checkOutDate, 'checkOutDateStart', 'checkOutDateEnd');


    const newValue = {
      ...values,
      ...{ businessDateStart, businessDateEnd },
      ...{ checkInDateStart, checkInDateEnd },
      ...{ checkOutDateStart, checkOutDateEnd },
      settlementStatus,
      accountId,
    };
    const currPage = newValue.currPage || 1;
    const pageSize = newValue.pageSize || 10;
    delete newValue.businessDate;
    delete newValue.checkInDate;
    delete newValue.checkOutDate;
    delete newValue.currPage;
    delete newValue.pageSize;
    const searchDefault = {
      ...{ currPage, pageSize },
      creditAccountDetailsQueryVO: {
        ...newValue,
      },
    };
    this.setState({ searchDefault });

    await dispatch({
      type: 'cashier/queryCreditAccountDetailsByPage',
      payload: searchDefault,
    });
  }

  handleCalc= async () => {
    const { dispatch, cashier } = this.props;
    /* eslint-disable-next-line */
    const selectRowKeyMap = cashier?.Selected?.selectRowKeyMap;
    // 数组扁平化
    function flatten(arr) {
      return arr.reduce((prev, item) => {
        return prev.concat(Array.isArray(item) ? flatten(item) : item);
      }, []);
    }
    const idList = flatten(selectRowKeyMap ? Object.values(selectRowKeyMap) : []);
    if (!idList.length) {
      return message.error('请先勾选需要结算的项目');
    }

    function okCallBack() {
      dispatch({
        type: 'cashier/addSettlement',
        payload: { idList },
      }).then((res) => {
        if (res) {
          message.success('结算成功');
        }
      });
    }
    this.showModal(idList, okCallBack);
  }
  showModal = (idList, okCallBack) => {
    const dataSource = [];
    const { cashier: { CreditAccountDetails: { list }, Selected: { selectRowKeyMap } } } = this.props;
    // 筛选
    list.forEach((item) => {
      item.creditAccountDetailsList.forEach((i) => {
        if (idList.includes(i.creditAccountId)) {
          dataSource.push({ ...i });
        }
      });
    });
    // 合并
    const results = {};
    dataSource.forEach((item) => {
      if (!results[item.accountTypeName]) {
        results[item.accountTypeName] = {
          // list: [],
          accountType: item.accountType,
          accountTypeName: item.accountTypeName,
          amount: 0,
        };
      }
      results[item.accountTypeName].amount += item.amount; // list.push(item)
    });

    let totalAmount = 0;

    // accountType 1 正  2 负 3 正
    Object.values(results).forEach((i) => {
      if ([1, 3].includes(Number(i.accountType))) {
        totalAmount += i.amount;
      } else if (Number(i.accountType) === 2) {
        totalAmount -= i.amount;
      }
    });
    const finalDataSource = Object.values(results);
    const sortBy = field => (a, b) => a[field] - b[field];

    finalDataSource.sort(sortBy('accountType'));
    console.log(finalDataSource);

    const columns = [{
      key: 1,
      title: '账务类型',
      dataIndex: 'accountTypeName',
    },
    {
      key: 2,
      title: '金额',
      render: i => fenToYuan(i.amount || 0),
    }];


    Modal.confirm({
      title: '账务结算',
      content: (
        <div>
          <h3>本次结算账务类型汇总如下</h3>
          <br />
          <br />
          <Table
            columns={columns}
            dataSource={finalDataSource}
            pagination={false}
            scroll={{ y: 270 }}
          />
          <br />
          <br />
          <h3>
            {`应${totalAmount >= 0 ? '收' : '退'}款: ¥${fenToYuan(Math.abs(totalAmount))}`}
          </h3>
        </div>
      ),
      okText: '确定结算',
      cancelText: '取消',
      onOk: okCallBack,
    });
  }

  handleTabsChange = (key) => {
    this.setState({ BtnShow: Number(key) === 2, settlementStatus: Number(key) });
    setTimeout(() => { this.search.handleSearch(); }, 0);
  }


  render() {
    const { /* loading , */cashier } = this.props;
    const { searchDefault } = this.state;
    const { creditAccountDetailsQueryVO } = searchDefault || {};
    return (
      <PageHeaderLayout>
        <Card title={`账务详情_${cashier?.currentDetail?.accountName}`}>
          <PanelList>
            <Search
              onSearch={this.handleSearch}
              ref={(inst) => { this.search = inst; }}
            >
              <Search.Item label="入住日期 " simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('checkInDate', {
                    })(
                      <RangePicker />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="离店日期" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('checkOutDate', {
                    })(
                      <RangePicker />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="营业日期" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('businessDate', {
                    })(
                      <RangePicker />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="登记单号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('regNo', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
            </Search>
            <Batch >
              <Authorized authority="PMS_ACCOUNT_ACCOUNTRECEIVABLE_ACCOUNTSEXPORT">
                <Download
                  baseUrl="/ht-fc-pms-server/creditAccountDetails/export"
                  query={{ ...creditAccountDetailsQueryVO }}
                >
                  <Button type="primary" >导出 </Button>
                </Download>
              </Authorized>

            </Batch >

            <div className={styles.TabsContainer}>
              {this.state.BtnShow ? (
                <Authorized authority="PMS_ACCOUNT_ACCOUNTRECEIVABLE_SETTLEMENT">
                  <Button
                    type="primary"
                    onClick={this.handleCalc}
                  >
                  结算
                  </Button>
                </Authorized>

              ) : ''}
              <Tabs type="card" onChange={this.handleTabsChange}>
                <TabPane tab="未结账务" key="2">
                  <AccountList title="未结账务" {...this.props} sourseData={cashier.CreditAccountDetails} />
                </TabPane>
                <TabPane tab="已结账务" key="1">
                  <AccountList title="已结账务" {...this.props} sourseData={cashier.CreditAccountDetails} noShow />
                </TabPane>
              </Tabs>
            </div>

          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
