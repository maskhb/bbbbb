import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Select, Tabs, Form, Modal, DatePicker, InputNumber, message } from 'antd';
import Input from 'components/input/DecorateInput';
// import _ from 'lodash';
import moment from 'moment';
import { handleOperate } from 'components/Handle';
import { MonitorInput, rules, MonitorTextArea } from 'components/input';
import PanelList, { Search, Table, Batch } from 'components/PanelList';
import RangeInput from 'components/RangeInput';
import ModalExportBusiness from 'components/ModalExport/business';
import Authorized from 'utils/Authorized';
import checkPermission from 'components/Authorized/CheckPermissions';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns, { detailcolumns, logcolumns } from './columns';
import { mul } from '../../../utils/number';


@connect(({ predeposit, loading }) => ({
  predeposit,
  loading: loading.models.predeposit,
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
    predepositList: null,
    dealpredeposit: null,
    modalPeriodVisible: false,
    modalChargeVisible: false,
    currentItem: null, // 当前操作的对象
    logResult: null,
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
      case '3':
        that.fetchLogs();
        break;
      default:
        break;
    }
  }

  setperiod = (record) => {
    this.modalPeriodShow(record);
  }

  charge = (record) => {
    this.modalChargeShow(record);
  }

  modalPeriodShow = (record) => {
    this.setState({ modalPeriodVisible: true });
    this.state.currentItem = record;
    this.props.form.setFieldsValue({
      validatePeriod: [moment(new Date(record.validityStart), 'HH:mm:ss'), moment(new Date(record.validityEnd), 'HH:mm:ss')],
    });
  }

  modalPeriodCancel = () => {
    this.setState({ modalPeriodVisible: false });
  }

  modalPeriodOk = () => {
    // 这里写接口
    const { form } = this.props;
    form.validateFields(['validatePeriod'], (err, values) => {
      if (!err) {
        const validateperiod = { accountId: this.state.currentItem.accountId,
          validityStart: new Date(values?.validatePeriod[0]).getTime(),
          validityEnd: new Date(values?.validatePeriod[1]).getTime() };
        handleOperate.call(this, validateperiod, 'predeposit', 'validpredeposit', '设置有效期');
      }
    });
  }

  modalChargeShow = (record) => {
    this.setState({ modalChargeVisible: true });
    this.setState({
      currentItem: record,
    });
    if (record) {
      this.props.form.setFieldsValue({
        accountMobile: record?.accountMobile,
        amount: '',
        remarks: '',
      });
    } else {
      this.props.form.setFieldsValue({
        accountMobile: '',
        amount: '',
        remarks: '',
      });
    }
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
          handleOperate.call(this, chargeinfo, 'predeposit', 'rechargepredeposit', '充值');
        }
      });
    } else { // 给指定的手机号充值
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
          handleOperate.call(this, chargeinfo, 'predeposit', 'rechargepredeposit', '充值');
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
    this.modalPeriodCancel();
    const { dispatch, searchDefault } = this.props;
    const param = Object.assign({}, searchDefault);
    if (values?.balance?.min || values?.balance?.min === 0) {
      param.balanceStart = mul(values?.balance?.min, 100);
      if (param.balanceStart % 1 !== 0) {
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
    param.isExpire = values?.isExpire || '';
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
      type: 'predeposit/predepositList',
      payload: { preDepositParamVo: this.state.searchparam },
    }).then(() => {
      const { predeposit } = this.props;
      this.setState({
        predepositList: predeposit?.predepositList,
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
      type: 'predeposit/dealpredeposit',
      payload: { dealParamVo: param },
    }).then(() => {
      const { predeposit } = this.props;
      this.setState({
        dealpredeposit: predeposit?.dealpredeposit,
      });
    });
  }

  fetchLogs = (pagination) => {
    const { dispatch, searchDefault } = this.props;
    const param = Object.assign({}, searchDefault);
    if (pagination) {
      param.currPage = pagination?.current;
      param.pageSize = pagination?.pageSize;
    }
    return dispatch({
      type: 'predeposit/predepositlogsbypage',
      payload: { pageInfo: param },
    }).then(() => {
      const { predeposit } = this.props;
      this.setState({
        logResult: predeposit?.predepositlogsbypage,
      });
    });
  }

  convertExportParam = (exportFileName) => {
    const { searchparam, predepositList } = this.state;
    const { currPage, pageSize, ...otherSearch } = searchparam;
    return {
      prefix: '803001',
      fileName: exportFileName,
      dataUrl: '/ht-mj-account-server/exportpredeposit',
      totalCount: predepositList?.pagination?.total,
      param: { param: { prefix: 803001, ...otherSearch } },
    };
  }

  convertExportParamdeal= (exportFileName) => {
    const { dealparam, dealpredeposit } = this.state;
    const { currPage, pageSize, ...otherSearch } = dealparam;
    return {
      param: { param: { prefix: 803002, ...otherSearch } },
      fileName: exportFileName,
      totalCount: dealpredeposit?.pagination?.total,
      dataUrl: '/ht-mj-account-server/exportdealpredeposit',
      prefix: '803002',
    };
  }

  renderList() {
    const { loading, searchDefault } = this.props;
    const { modalPeriodVisible, modalChargeVisible, predepositList, currentItem } = this.state;
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
            <Search.Item label="是否过期" simple>
              {
                ({ form }) => (
                  form.getFieldDecorator('isExpire', {
                    initialValue: 0,
                  })(
                    <Select>
                      <Select.Option key="0" value={0}>请选择</Select.Option>
                      <Select.Option key="1" value={1}>是</Select.Option>
                      <Select.Option key="2" value={2}>否</Select.Option>
                    </Select>
                  )
                )
              }
            </Search.Item>
          </Search>

          <Batch>
            <div>
              <Authorized authority="OPERPORT_JIAJU_PREDEPOSITLIST_RECHARGE"><Button icon="plus" type="primary" onClick={() => { this.charge(null); }}>充值预付款</Button></Authorized>
              <Authorized authority="OPERPORT_JIAJU_PREDEPOSITLIST_EXPORT">
                <ModalExportBusiness
                  {...this.props}
                  btnTitle="导出预存款"
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
            dataSource={predepositList?.list}
            pagination={predepositList?.pagination}
            rowKey="acctId"
            disableRowSelection
          />
        </PanelList>

        <Modal
          title="设置有效期"
          visible={modalPeriodVisible}
          onOk={this.modalPeriodOk}
          onCancel={this.modalPeriodCancel}
          confirmLoading={loading}
          okText="确定"
          width="50%"
        >
          <Form>
            <Form.Item label="有效期：" {...formItemLayout}>
              {this.props.form.getFieldDecorator('validatePeriod', {
                rules: rules([{
                  required: true, message: '请设置有效期',
                }]),
              })(
                <DatePicker.RangePicker format="YYYY-MM-DD HH:mm:ss" />
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="预存款充值"
          visible={modalChargeVisible}
          onOk={this.modalChargeOk}
          confirmLoading={loading}
          onCancel={this.modalChargeCancel}
          okText="确定"
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
    const { dealpredeposit } = this.state;
    const dealTypeMap = [
      { key: '001', value: '下单支付' },
      { key: '002', value: '售后退款' },
      { key: '003', value: '订单取消退款' },
      { key: '004', value: '后台充值' },
      { key: '009', value: '后台充值(旧)' },
      { key: '010', value: '会员购物(旧) ' },
      { key: '013', value: '售后退回(旧)' },
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
                    <Input placeholder="请输入手机号码" />
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
            <Authorized authority="OPERPORT_JIAJU_PREDEPOSITTRADELIST_EXPORT">
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
            dataSource={dealpredeposit?.list}
            pagination={dealpredeposit?.pagination}
            disableRowSelection
          />
        </PanelList>
      </Card>
    );
  }

  renderLogs() {
    const { loading } = this.props;
    const { logResult } = this.state;
    return (
      <Card>
        <Table
          loading={loading}
          columns={logcolumns}
          dataSource={logResult?.list}
          pagination={logResult?.pagination}
          onChange={this.fetchLogs}
        />
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout>
        <Tabs defaultActiveKey="1" onChange={this.onTabChange}>
          { checkPermission('OPERPORT_JIAJU_PREDEPOSITLIST_LIST') && <Tabs.TabPane tab="预存款列表" key="1">{this.renderList()}</Tabs.TabPane>}
          { checkPermission('OPERPORT_JIAJU_PREDEPOSITTRADELIST_LIST') && <Tabs.TabPane tab="交易明细" key="2">{this.renderdealList()}</Tabs.TabPane>}
          { checkPermission('OPERPORT_JIAJU_PREDEPOSITLOG_LIST') && <Tabs.TabPane tab="操作日志" key="3">{this.renderLogs()}</Tabs.TabPane>}
        </Tabs>
      </PageHeaderLayout>
    );
  }
}
