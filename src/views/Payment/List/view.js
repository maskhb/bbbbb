import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Modal, DatePicker, Select, Form, Table } from 'antd';
import moment from 'moment';
// import _ from 'lodash';
import { MonitorInput, rules, MonitorTextArea } from 'components/input';
import { handleOperate } from 'components/Handle';
import SearchTable from 'components/TableStandard';
import ModalExportBusiness from 'components/ModalExport/business';
import Authorized from 'utils/Authorized';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PanelList, { Search, Batch } from '../../../components/PanelList';
import CheckboxCascade from '../../../components/CheckBoxCascade';
import getColumns, { payTypeArr, logcolumns } from './columns';
import { mul } from '../../../utils/number';
import { fenToYuan } from '../../../utils/money';

@connect(({ payment, loading }) => ({
  payment,
  loading: loading.models.payment,
}))

@Form.create()

export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: { currentPage: 1, pageSize: 10, condition: { systemType: 1, modelCode: 1007 } },
  };

  state = {
    modalEditVisible: false,
    modalLogVisible: false,
    modifyItem: null,
    searchparam: {},
    searchResult: {},
    logResult: [],
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  convertExportParam = () => {
    const { searchparam, searchResult } = this.state;
    return {
      param: { param: { ...searchparam?.condition } },
      totalCount: searchResult?.totalCount,
      dataUrl: '/pay/paybehind/exportPayOrderHis/asynExportMJPayBills',
      oldServiceUrl: 'payment-api',
      prefix: 280011,
    };
  }

  handleSearch = (values = {}) => {
    this.modalEditCancel();
    const { dispatch, searchDefault } = this.props;
    const searchparam = Object.assign({}, searchDefault);
    searchparam.condition.payTypeKey = values?.payTypeKey;
    searchparam.condition.payState = values.payState;

    if (values?.createTime && values?.createTime instanceof Array) {
      searchparam.condition.startTime = new Date(values?.createTime[0]).getTime();
      searchparam.condition.endTime = new Date(values?.createTime[1]).getTime();
    } else {
      delete searchparam.condition.startTime;
      delete searchparam.condition.endTime;
    }

    if (!values?.condition?.url || values?.condition?.url !== this.state.searchparam.url) {
      delete searchparam.condition.payOrderId;
      delete searchparam.condition.outOrderId;
      delete searchparam.condition.thirdPartTransactionId;
    }
    switch (values?.condition?.url) {
      case 1:
        searchparam.condition.payOrderId = values?.condition?.payOrderId;
        break;
      case 2:
        searchparam.condition.outOrderId = values?.condition?.outOrderId;
        break;
      case 3:
        searchparam.condition.thirdPartTransactionId = values?.condition?.thirdPartTransactionId;
        break;
      default:
        break;
    }
    searchparam.pageSize = values?.pageInfo?.pageSize || 10;
    searchparam.currentPage = values?.pageInfo?.currPage || 1;
    this.state.searchparam = searchparam;
    return dispatch({
      type: 'payment/hislist',
      payload: searchparam,
    }).then(() => {
      const { payment } = this.props;
      this.setState({
        searchResult: payment.hislist,
      });
    });
  }

  showrefreshconfirm = () => {
    const that = this;
    Modal.confirm({
      title: '提示',
      content: '正在更新，时长约1分钟，请稍后刷新页面查看结果！',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        that.search.handleSearch();
      },
    });
  }

  log = (record) => {
    this.modalLogShow(record);
  }

  edit = (record) => {
    this.modalEditShow(record);
  }

  modalEditShow = (record) => {
    this.setState({ modalEditVisible: true });
    this.setState({
      modifyItem: record,
    });
    this.props.form.setFieldsValue({
      thirdPartTransactionId: '',
      payTime: moment(new Date(), 'HH:mm:ss'),
      remark: '',
    });
  }

  modalEditCancel = () => {
    this.setState({ modalEditVisible: false });
  }
  modalEditOk = () => {
    // 这里写接口
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const manualTransaction = Object.assign({}, values);
        manualTransaction.payOrderNo = this.state.modifyItem.payOrder;
        manualTransaction.outTradeNo = this.state.modifyItem.outOrderId;
        manualTransaction.payTypeKey = this.state.modifyItem.payTypeKey;
        manualTransaction.transactionId = this.state.modifyItem.transactionId;
        manualTransaction.totalAmount = mul(this.state.modifyItem.totalFee, 100);
        manualTransaction.payTime = new Date(values.payTime).getTime();
        handleOperate.call(this, { manualTransaction }, 'payment', 'saveManualTransaction', '日志修改', this.showrefreshconfirm);
      }
    });
  }

  modalLogShow = (record) => {
    this.setState({ modalLogVisible: true });
    const { dispatch } = this.props;
    return dispatch({
      type: 'payment/searchTransactionManualLogList',
      payload: { transactionId: record.transactionId },
    }).then(() => {
      const { payment } = this.props;
      this.setState({
        modifyItem: {},
      });
      this.setState({
        logResult: payment?.searchTransactionManualLogList,
      });
    });
  }

  modalLogCancel = () => {
    this.setState({ modalLogVisible: false, logResult: [] });
  }

  render() {
    const { loading, searchDefault } = this.props;
    const { modalEditVisible, modalLogVisible, modifyItem, searchResult, logResult } = this.state;
    const selectOptions = { // CheckboxCascade组件的入参集合
      url: [
        { value: 1, label: '支付单号', key: 1, childrenType: 1, childrenName: 'payOrderId', childrenProps: { placeholder: '请输入' } },
        { value: 2, label: '订单编号', key: 2, childrenType: 1, childrenName: 'outOrderId', childrenProps: { placeholder: '请输入' } },
        { value: 3, label: '第三方交易流水号', key: 3, childrenType: 1, childrenName: 'thirdPartTransactionId', childrenProps: { placeholder: '请输入' } },
      ],
    };
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

    for (const v of payTypeArr) {
      if (v.key === modifyItem?.payTypeKey) {
        modifyItem.payType = v.value;
      }
    }

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
              onReset={this.handleReset}
            >
              <Search.Item label="" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('condition', {
                      initialValue: 1,
                    })(
                      <CheckboxCascade
                        name="url"
                        selectOptions={selectOptions.url}
                      />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="支付方式" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('payTypeKey', {
                      initialValue: '',
                    })(
                      <Select >
                        <Select.Option key="" value="">全部</Select.Option>
                        {payTypeArr.map(v =>
                          <Select.Option key={v.key} value={v.key}>{v.value}</Select.Option>
                        )}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="支付状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('payState', {
                      initialValue: '',
                    })(
                      <Select>
                        <Select.Option key="" value="">全部</Select.Option>
                        <Select.Option key="0" value="0">未支付</Select.Option>
                        <Select.Option key="1" value="1">已支付</Select.Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="支付时间" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('createTime', {
                    })(
                      <DatePicker.RangePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" />
                    )
                  )
                }
              </Search.Item>
            </Search>
            <Batch>
              <Authorized authority="OPERPORT_JIAJU_PAYRECORDLIST_EXPORT">
                <ModalExportBusiness
                  {...this.props}
                  convertParam={this.convertExportParam}
                  exportModalType={0}
                />
              </Authorized>
            </Batch>
            <SearchTable
              loading={loading}
              columns={getColumns(this)}
              searchDefault={searchDefault}
              disableRowSelection
              dataSource={searchResult?.dataList}
              rowKey="payOrder"
              pagination={{
                current: searchResult?.currPage || 1,
                pageSize: searchResult?.pageSize || 10,
                total: searchResult?.totalCount || 0,
              }}
            />
          </PanelList>
          <Modal
            title="修改支付记录"
            visible={modalEditVisible}
            onOk={this.modalEditOk}
            confirmLoading={loading}
            onCancel={this.modalEditCancel}
            okText="保存"
            width="50%"
          >
            <Form>
              <Form.Item label="支付单号" {...formItemLayout}>
                {this.props.form.getFieldDecorator('payOrder', {
              })(
                <span>{modifyItem?.payOrder}</span>
              )}
              </Form.Item>
              <Form.Item label="支付方式" {...formItemLayout}>
                {this.props.form.getFieldDecorator('payType', {
              })(
                <span>{modifyItem?.payType}</span>
              )}
              </Form.Item>
              <Form.Item label="支付金额" {...formItemLayout}>
                {this.props.form.getFieldDecorator('totalAmount', {
                  initialValue: modifyItem?.totalFee,
              })(
                <span>{`￥${fenToYuan(mul(parseFloat(modifyItem?.totalFee), 100))}`}</span>
              )}
              </Form.Item>
              <Form.Item label="支付状态" {...formItemLayout}>
                {this.props.form.getFieldDecorator('status', {
                  initialValue: '1',
                  rules: rules([{
                    required: true,
                  }]),
                })(
                  <Select >
                    <Select.Option key="1" value="1">已支付</Select.Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="支付流水号" {...formItemLayout}>
                {this.props.form.getFieldDecorator('thirdPartTransactionId', {
                  initialValue: modifyItem?.thirdPartTransactionId,
                  rules: rules([{
                    required: true, message: '请输入支付流水号',
                  }]),
                })(
                  <MonitorInput maxLength={100} />
                )}
              </Form.Item>
              <Form.Item label="支付时间" {...formItemLayout}>
                {this.props.form.getFieldDecorator('payTime', {
                  rules: rules([{
                    required: true, message: '请输入支付时间',
                  }]),
                })(
                  <DatePicker
                    style={{ width: '60%' }}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择时间"
                  />
                )}
              </Form.Item>
              <Form.Item label="备注" {...formItemLayout}>
                {this.props.form.getFieldDecorator('remark', {
                  initialValue: modifyItem?.remark,
                  rules: rules([{
                    required: true, message: '请输入备注',
                  }]),
                })(
                  <MonitorTextArea rows={6} maxLength={200} form={this.props.form} datakey="remark" />)}
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="查看修改日志"
            visible={modalLogVisible}
            onOk={this.modalLogCancel}
            onCancel={this.modalLogCancel}
            width="80%"
          >
            <Table
              columns={logcolumns()}
              disableRowSelection
              dataSource={logResult}
              loading={loading}
              rowKey="transactionId"
              pagination={false}
            />
          </Modal>

        </Card>
      </PageHeaderLayout>
    );
  }
}
