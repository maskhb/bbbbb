import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Select, Tabs, Form, Modal, DatePicker, InputNumber, message } from 'antd';
// import _ from 'lodash';
import Input from 'components/input/DecorateInput';
import { MonitorInput, rules, MonitorTextArea } from 'components/input';
import { handleOperate } from 'components/Handle';
import PanelList, { Search, Table, Batch } from 'components/PanelList';
import RangeInput from 'components/RangeInput';
import ModalExportBusiness from 'components/ModalExport/business';
import Authorized from 'utils/Authorized';
import checkPermission from 'components/Authorized/CheckPermissions';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { mul } from '../../../utils/number';
import getColumns, { detailcolumns } from './columns';


@connect(({ wallet, loading }) => ({
  wallet,
  loading: loading.models.wallet,
}))

@Form.create()

export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: { currPage: 1, pageSize: 10 },
  };

  state = {
    activeKey: '1',
    searchparam: {},
    dealparam: {},
    modalChargeVisible: false,
    wallet: null,
    dealwallet: null,
    currentItem: null, // 当前操作的对象
  };

  componentDidMount() {
    this.search?.handleSearch();
  }

  onTabChange = (activeKey) => {
    this.state.activeKey = activeKey;
    const that = this;
    switch (activeKey) {
      case '1':
        that.search.handleSearch();
        break;
      case '2':
        that.search.handleSearch();
        break;
      default:
        break;
    }
  }

  charge = (record) => {
    this.modalChargeShow(record);
  }

  modalChargeShow = (record) => {
    this.setState({ modalChargeVisible: true });
    this.state.currentItem = record;
    this.props.form.setFieldsValue({
      accountMobile: record?.accountMobile,
      amount: '',
      remarks: '',
    });
  }

  modalChargeCancel = () => {
    this.setState({ modalChargeVisible: false });
  }

  modalChargeOk = () => {
    // 这里写接口
    const { form } = this.props;
    if (!this.state.currentItem) { // 输入手机号码
      form.validateFields(['accountMobile', 'amount', 'remarks'], (err, values) => {
        if (!err) {
          const reg = new RegExp(/^1\d{10}$/);
          if (!reg.test(values?.accountMobile)) {
            Modal.error({
              title: '充值失败',
              content: '请输入有效的手机号',
            });
            return;
          }
          if (values?.amount <= 0) {
            Modal.error({
              title: '充值失败',
              content: '充值金额需大于0',
            });
            return;
          }
          const chargeinfo = { accountMobile: values?.accountMobile,
            amount: mul(values?.amount, 100),
            remarks: values?.remarks };
          handleOperate.call(this, chargeinfo, 'wallet', 'rechargewallet', '充值', this.search.handleSearch);
        }
      });
    } else { // 给指定的手机好充值
      form.validateFields(['amount', 'remarks'], (err, values) => {
        if (!err) {
          if (values?.amount <= 0) {
            Modal.error({
              title: '充值失败',
              content: '充值金额需大于0',
            });
            return;
          }
          const chargeinfo = { accountMobile: this.state.currentItem?.accountMobile,
            amount: mul(values?.amount, 100),
            remarks: values?.remarks };
          handleOperate.call(this, chargeinfo, 'wallet', 'rechargewallet', '充值', this.search.handleSearch);
        }
      });
    }
  }

  handleSearch = (values = {}) => {
    if (this.state.activeKey === '1') {
      this.fetchList(values);
    } else if (this.state.activeKey === '2') {
      this.fetchDeals(values);
    }
  }

  fetchList = (values) => {
    this.modalChargeCancel();
    const { dispatch, searchDefault } = this.props;
    const param = Object.assign({}, searchDefault);
    if (values?.balance?.min) {
      param.balanceStart = mul(values?.balance?.min, 100);
      if (param.balanceStart % 1 !== 0 || values?.balance?.min === 0) {
        message.error('最多支持两位小数');
        return;
      }
    } else {
      param.balanceStart = -1;
    }
    if (values?.balance?.max || values?.balance?.max === 0) {
      param.balanceEnd = mul(values?.balance?.max, 100);
      if (param.balanceEnd % 1 !== 0) {
        message.error('最多支持两位小数');
        return;
      }
    } else {
      param.balanceEnd = -1;
    }
    // 手机号码校验
    const reg = new RegExp(/^1\d{10}$/);
    if (reg.test(values?.keywords)) {
      param.accountMobile = values?.keywords || '';
    } else {
      param.oldLoginName = values?.keywords || '';
    }
    param.pageSize = values?.pageInfo?.pageSize || 10;
    param.currPage = values?.pageInfo?.currPage || 1;
    this.state.searchparam = param;
    return dispatch({
      type: 'wallet/wallet',
      payload: { walletParamVo: param },
    }).then(() => {
      const { wallet } = this.props;
      this.setState({
        wallet: wallet?.wallet,
      });
    });
  }

  fetchDeals = (values) => {
    const { dispatch, searchDefault } = this.props;
    const param = Object.assign({}, searchDefault);
    param.orderId = values?.orderId || '';
    param.accountMobile = values?.accountMobile || '';
    if (values?.createdTime instanceof Array) {
      param.createdTimeStart = new Date(values?.createdTime[0]).getTime();
      param.createdTimeEnd = new Date(values?.createdTime[1]).getTime();
    }
    param.ruleCode = values?.ruleCode || '';
    param.pageSize = values?.pageInfo?.pageSize || 10;
    param.currPage = values?.pageInfo?.currPage || 1;
    this.state.dealparam = param;
    return dispatch({
      type: 'wallet/dealwallet',
      payload: { dealParamVo: param },
    }).then(() => {
      const { wallet } = this.props;
      this.setState({
        dealwallet: wallet?.dealwallet,
      });
    });
  }

  convertExportParam = (exportFileName) => {
    const { searchparam, wallet } = this.state;
    const { currPage, pageSize, ...otherSearch } = searchparam;
    return {
      prefix: '803003',
      fileName: exportFileName,
      param: { param: { prefix: 803003, ...otherSearch } },
      totalCount: wallet?.pagination?.total,
      dataUrl: '/ht-mj-account-server/exportwallet',
    };
  }

  convertExportParamdeal= (exportFileName) => {
    const { dealparam, dealwallet } = this.state;
    const { currPage, pageSize, ...otherSearch } = dealparam;
    return {
      param: { param: { prefix: 803004, ...otherSearch } },
      totalCount: dealwallet?.pagination?.total,
      fileName: exportFileName,
      dataUrl: '/ht-mj-account-server/exportdealwallet',
      prefix: '803004',
    };
  }

  renderList() {
    const { loading, searchDefault } = this.props;
    const { modalChargeVisible, wallet, currentItem } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 28 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 20 },
      },
    };
    return (
      <Card>
        <PanelList>
          <Search
            ref={(inst) => { this.search = inst; }}
            searchDefault={searchDefault}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          >
            <Search.Item label="关键字" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('keywords', {
                  })(
                    <Input placeholder="请输入手机号码或者登录ID" />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="余额" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('balance', {
                    initialValue: { min: null, max: null },
                  })(
                    <RangeInput placeholders={['大于等于', '小于等于']} />
                  )
                )
              }
            </Search.Item>
          </Search>
          <Batch>
            <div>
              <Authorized authority="OPERPORT_JIAJU_WALLETLIST_RECHARGE"><Button icon="plus" type="primary" onClick={() => { this.charge(); }}>充值钱包</Button></Authorized>
              <Authorized authority="OPERPORT_JIAJU_WALLETLIST_EXPORT">
                <ModalExportBusiness
                  {...this.props}
                  btnTitle="导出钱包"
                  convertParam={this.convertExportParam}
                  exportModalType={0}
                />
              </Authorized>
            </div>
          </Batch>

          <Table
            loading={loading}
            searchDefault={searchDefault}
            columns={getColumns(this, searchDefault)}
            dataSource={wallet?.list}
            pagination={wallet?.pagination}
            rowKey="acctId"
            disableRowSelection
          />
        </PanelList>
        <Modal
          title="钱包充值"
          visible={modalChargeVisible}
          onOk={this.modalChargeOk}
          onCancel={this.modalChargeCancel}
          confirmLoading={loading}
          okText="保存"
          width="50%"
        >
          <Form>
            <Form.Item label="手机号码" {...formItemLayout}>
              {this.props.form.getFieldDecorator('accountMobile', {
                initialValue: currentItem?.accountMobile,
                rules: rules([{
                  required: true, message: '请输入充值手机号',
                }]),
              })(
                currentItem ? <span>{currentItem?.accountMobile}</span> : <MonitorInput />
              )}
            </Form.Item>
            <Form.Item label="充值金额" {...formItemLayout}>
              {this.props.form.getFieldDecorator('amount', {
                // initialValue: modifyItem.thirdPartTransactionId,
                rules: rules([{
                  required: true, message: '请输入充值金额',
                }]),
              })(
                <InputNumber style={{ width: '100%' }} maxLength={10} />
              )}
            </Form.Item>
            <Form.Item label="备注" {...formItemLayout}>
              {this.props.form.getFieldDecorator('remarks', {
                rules: rules([{
                  required: true, message: '请输入备注',
                }, {
                  max: 200,
                }]),
              })(
                <MonitorTextArea rows={6} maxLength={200} form={this.props.form} datakey="remarks" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    );
  }

  renderdealList() {
    const { loading, searchDefault } = this.props;
    const { dealwallet } = this.state;
    const dealTypeMap = [
      { key: '005', value: '下单支付' },
      { key: '006', value: '售后退款' },
      { key: '007', value: '订单取消退款' },
      { key: '008', value: '后台充值' },
      { key: '011', value: '后台充值(旧) ' },
      { key: '012', value: '会员购物(旧)' },
      // { key: '013', value: '预存款(旧)' },
      // { key: '014', value: '蜜家钱包(旧)' },
      { key: '014', value: '售后退回(旧)' },
    ];
    return (
      <Card>
        <PanelList>
          <Search
            ref={(inst) => { this.search = inst; }}
            searchDefault={searchDefault}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          >
            <Search.Item label="订单编号" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('orderId', {
                  })(
                    <Input placeholder="请输入订单编号" />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="手机号码" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('accountMobile', {
                  })(
                    <Input placeholder="请输入" />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="交易时间" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('createdTime', {
                  })(
                    <DatePicker.RangePicker
                      style={{ width: '100%' }}
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  )
                )
              }
            </Search.Item>
            <Search.Item label="交易类型" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('ruleCode', {
                    initialValue: '',
                  })(
                    <Select placeholder="请选择" >
                      <Select.Option value="" key="">请选择</Select.Option>
                      {
                        dealTypeMap?.map(item => (
                          <Select.Option value={item.key} key={item.key}>
                            {item.value}
                          </Select.Option>
                      ))
                    }
                    </Select>
                  )
                )
              }
            </Search.Item>
          </Search>

          <Batch>
            <Authorized authority="OPERPORT_JIAJU_WALLETTRADELIST_EXPORT">
              <ModalExportBusiness
                {...this.props}
                btnTitle="导出"
                convertParam={this.convertExportParamdeal}
                exportModalType={0}
              />
            </Authorized>
          </Batch>

          <Table
            loading={loading}
            searchDefault={searchDefault}
            columns={detailcolumns}
            dataSource={dealwallet?.list}
            pagination={dealwallet?.pagination}
            disableRowSelection
          />
        </PanelList>
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout>
        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
          {checkPermission('OPERPORT_JIAJU_WALLETLIST_LIST') && <Tabs.TabPane tab="钱包列表" key="1">{this.renderList()}</Tabs.TabPane>}
          {checkPermission('OPERPORT_JIAJU_WALLETTRADELIST_LIST') && <Tabs.TabPane tab="交易明细" key="2">{this.renderdealList()}</Tabs.TabPane>}
        </Tabs>
      </PageHeaderLayout>
    );
  }
}
