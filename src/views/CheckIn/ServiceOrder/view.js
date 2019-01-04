import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Card, Input, DatePicker, Button, Tabs, Modal, message, Select, Spin } from 'antd';
import cookie from 'cookies-js';
import { getPrefix } from 'utils/attr/exportFile';
import { accountId } from 'utils/getParams';
import { goTo } from 'utils/utils';
import { MonitorInput } from 'components/input';
import { formatter } from './utils';

import Selector from './Selector';
import AddModal from './addModal';
import getColumns from './columns';
import './view.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
@connect(({ checkIn, exportFile, loading }) => ({
  checkIn,
  exportFile,
  loading: loading.models.checkIn,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: { },
  };

  state = {
    key: 0,
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  handleChangeTable = (a, b, c, d, params) => {
    const { pageSize, currPage, sorter, ...others } = params;
    let orderField;
    let orderType;
    if (sorter) {
      [orderField, orderType] = sorter.split('_');
      orderField = orderField.replace(/([a-z])([A-Z])/, '$1_$2').toLowerCase();
      orderType = orderType.substr(0, orderType.includes('asc') ? 3 : 4);
    }
    const newValue = { ...this.state.serviceOrderPageVO?.serviceOrderVO, pageSize, currPage, orderField, orderType, ...others };
    this.handleSearch(newValue);
    console.log(newValue);
  }


  handleSearch = (values = {}) => {
    setTimeout(async () => {
      const {
        createdTimeList,
        businessDayList,
        currPage = 1,
        pageSize = 10,
        orderField, orderType,
        ...others
      } = values;
      const { dispatch } = this.props;
      const [createdTime, createdTimeEnd] = formatter(createdTimeList);
      const [businessDay, businessDayEnd] = formatter(businessDayList);
      const pagination = { currPage, pageSize };
      const serviceOrderPageVO = {
        ...pagination,
        orderField,
        orderType,
        serviceOrderVO: {
          ...others,
          createdTime,
          createdTimeEnd,
          businessDay,
          businessDayEnd,
          parentId: this.state.key,
        },
      };

      this.setState({ serviceOrderPageVO });
      await dispatch({
        type: 'checkIn/queryServiceOrder',
        payload: { serviceOrderPageVO },
      });
    }, 0);
  };

  handleChangeTab = (key) => {
    this.setState({ key: String(key), serviceOrderPageVO: null });
    this.search.handleFormReset();
    this.search.handleSearch();
  };


  handleDelete = async (v, type = 0, deleteType = 'main', successCallBack = () => {}) => {
    const { dispatch } = this.props;
    const self = this;
    if (deleteType === 'main') {
      Modal.confirm({
        title: '确定要删除该服务单？',
        content: '',
        okText: '确认',
        cancelText: '取消',
        onOk: () => okSth(),
      });
    } else {
      okSth();
    }
    function okSth() {
      dispatch({
        type: 'checkIn/deleteServiceOrder',
        payload: { serviceOrderVO: { serviceOrderId: v.serviceOrderId } },
      }).then((res) => {
        if (res) {
          if (deleteType !== 'main') {
            // 外层删除
            self.search.handleSearch();
            return successCallBack();
          }
          message.success('删除成功');
          self.setState({ key: type === 0 ? 1 : 0 });
          self.search.handleSearch();
        }
      });
    }
  };

  handleChangeCheckbox = async (v, data) => {
    console.log('click');

    const { dispatch } = this.props;
    const { serviceOrderId, isCompleted: isCompletedOldType } = data;
    const isCompleted = [1, 0][isCompletedOldType];
    const serviceOrderVO = { serviceOrderId, isCompleted };

    const res = await dispatch({
      type: 'checkIn/updateCompleted',
      payload: { serviceOrderVO },
    });
    if (res) {
      this.initRight();
    }
  };

  initRight = () => {
    this.setState({ key: 1 });
    this.search.handleSearch();
  };
  // 导出 /serviceOrder/export
  handleExport = () => {
    const { stateOfSearch } = this.search.props;
    const { dispatch, checkIn } = this.props;
    const { serviceOrderPageVO } = this.state;
    const { currPage, pageSize, serviceOrderVO } = serviceOrderPageVO;

    const exportData = {
      userId: accountId(),
      prefix: 900005,
      currPage,
      pageSize,
      page: { pageSize: 999, totalCount: checkIn?.serviceOrder?.pagination?.total },
      loginType: 7,
      param: `param=${JSON.stringify({ ...serviceOrderVO })}`,
      dataUrl: getPrefix('ht-fc-pms-server/serviceOrder/export'),
      token: cookie.get('x-manager-token'),
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
            goTo('/export/export/900005');
          },
        });
      }
    });
  };


  render() {
    const { loading, checkIn, searchDefault } = this.props;
    const { key = 1 } = this.state;
    // console.log('Render', key, `time=${moment().valueOf()}&key=${key}`);

    return (
      <PageHeaderLayout>
        <Card title="服务单管理">
          <PanelList>
            {Number(key) === 1 ? (
              <Search
                onSearch={this.handleSearch}
                ref={(inst) => {
                  this.search = inst;
                }}
                key={`time=${moment().valueOf()}&key=${key}`}
              >
                <Search.Item label="服务项名称" simple>
                  {({ form }) =>
                    form.getFieldDecorator('serviceName', {})(
                      <MonitorInput maxLength={20} />
                    )
                  }
                </Search.Item>

                <Search.Item label="房间名称" simple>
                  {({ form }) =>
                    form.getFieldDecorator('roomName', {})(<Input />)
                  }
                </Search.Item>

                <Search.Item label="关联入住单号" simple>
                  {({ form }) =>
                    form.getFieldDecorator('gresNo', {})(
                      <MonitorInput maxLength={30} />
                    )
                  }
                </Search.Item>

                <Search.Item label="服务营业日期" simple>
                  {({ form }) =>
                    form.getFieldDecorator('businessDayList', {})(
                      <RangePicker />
                    )
                  }
                </Search.Item>

                <Search.Item label="收费类目" simple>
                  {({ form }) =>
                    form.getFieldDecorator('paymentItemIdList', {})(
                      <Selector
                        mode="multiple"
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      />
                    )
                  }
                </Search.Item>
                <Search.Item label="创建人" simple>
                  {({ form }) =>
                    form.getFieldDecorator('createdName', {})(
                      <MonitorInput maxLength={20} />
                    )
                  }
                </Search.Item>
                <Search.Item label="创建时间" simple>
                  {({ form }) =>
                    form.getFieldDecorator('createdTimeList', {})(
                      <RangePicker />
                    )
                  }
                </Search.Item>

                <Search.Item label="完成状态" simple defaultValue="-1">
                  {({ form }) =>
                    form.getFieldDecorator('isCompleted', {})(
                      <Select>
                        <Option value="-1">全部</Option>
                        <Option value="0">未完成</Option>
                        <Option value="1">已完成</Option>
                      </Select>
                    )
                  }
                </Search.Item>
              </Search>
            ) : (
              <Search
                onSearch={this.handleSearch}
                ref={(inst) => {
                  this.search = inst;
                }}
                key={`time=${moment().valueOf()}&key=${key}`}
              >
                <Search.Item label="服务项名称" simple>
                  {({ form }) =>
                    form.getFieldDecorator('serviceName', {})(
                      <MonitorInput maxLength={20} />
                    )
                  }
                </Search.Item>

                <Search.Item label="关联预订单号" simple>
                  {({ form }) =>
                    form.getFieldDecorator('gresNo', {})(
                      <MonitorInput maxLength={30} />
                    )
                  }
                </Search.Item>

                <Search.Item label="收费类目" simple>
                  {({ form }) =>
                    form.getFieldDecorator('paymentItemIdList', {})(
                      <Selector
                        mode="multiple"
                        showSearch
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      />
                    )
                  }
                </Search.Item>

                <Search.Item label="创建人" simple>
                  {({ form }) =>
                    form.getFieldDecorator('createdName', {})(
                      <MonitorInput maxLength={20} />
                    )
                  }
                </Search.Item>

                <Search.Item label="创建时间" simple>
                  {({ form }) =>
                    form.getFieldDecorator('createdTime', {})(<RangePicker />)
                  }
                </Search.Item>
              </Search>
            )}
            <Batch>
              <AddModal
                callBack={() => {
                  this.initRight();
                }}
                mainClass={this}
              />
              <Authorized authority={['PMS_CHECKIN_SERVICETICKET_EXPORT']} >
                <Button type="primary" onClick={this.handleExport}>
                导出
                </Button>
              </Authorized >

            </Batch>
            <Tabs
              activeKey={String(this.state.key)}
              onChange={this.handleChangeTab}
            >
              <TabPane tab="待分配" key="0">
                <Spin spinning={loading}>
                  <Table
                    rowKey={(record, index) => `${record.communityId}${index}`}
                    columns={getColumns(this, null, 0)}
                    dataSource={checkIn?.serviceOrder?.list}
                    pagination={checkIn?.serviceOrder?.pagination}
                    disableRowSelection
                    onChange={this.handleChangeTable}
                  />
                </Spin>
              </TabPane>

              <TabPane tab="已分配" key="1">
                <Spin spinning={loading}>
                  <Table
                    rowKey={(record, index) => `${record.communityId}${index}`}
                    columns={getColumns(this, null, 1)}
                    dataSource={checkIn?.serviceOrder?.list}
                    pagination={checkIn?.serviceOrder?.pagination}
                    disableRowSelection
                    onChange={this.handleChangeTable}
                  />
                </Spin>
              </TabPane>
            </Tabs>
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
