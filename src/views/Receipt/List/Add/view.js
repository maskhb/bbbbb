import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Col, Row, Table, Button, Checkbox, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { MonitorInput } from 'components/input';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import { goTo } from 'utils/utils';
import fieldLabels from './fieldLabels';
import { STATUS_ENTRY, STATUS_PAY } from '../attr';
import { fenToYuan } from '../../../../utils/money/index';

const columns = (self) => {
  return [{
    title: '订单编号',
    width: '40%',
    align: 'center',
    dataIndex: 'orderSn',
  }, {
    title: '支付状态',
    width: '15%',
    align: 'center',
    dataIndex: 'payStatus',
    render: (val) => {
      return STATUS_PAY[val];
    },
  }, {
    title: '实付金额',
    width: '15%',
    align: 'center',
    dataIndex: 'payAmount',
    render: (val) => {
      return fenToYuan(val, false);
    },
  }, {
    title: '录入状态',
    width: '15%',
    align: 'center',
    dataIndex: 'entryStatus',
    render: (val) => {
      return STATUS_ENTRY[val];
    },
  }, {
    title: '选择',
    width: '15%',
    render: (record) => {
      // return record.entryStatus !== 2 ? <a onClick={() => self.selectRecord(record)}>选择</a> : '';
      return record.entryStatus === 0 ? (
        <Checkbox
          checked={self.state.selectOrder?.orderId === record.orderId}
          onChange={() => self.selectRecord(record)}
        />) : '';
    },
  }];
};

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

@connect(({ receipt, loading }) => ({
  receipt,
  loading: loading.effects['receipt/queryPrintList'],
  submitting: loading.effects['receipt/saveReceipt'],
}))
@Form.create()
export default class View extends Component {
  state = {
    pattern: 'detail',
    selectOrder: {},
  };

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    this.setState({
      pattern: Number(id) === 0 ? 'add' : 'detail',
    });
  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }

  selectRecord = (record) => {
    if (record.orderSn !== this.state.selectOrder?.orderSn) {
      this.setState({ selectOrder: record });
      this.props.form.setFieldsValue({
        collectionAmount: fenToYuan(record.payAmount, false),
        consigneeName: record.payUserName,
        // consigneeMobile: this.props.form.getFieldValue('receiverPhoneSearch'),
        consigneeMobile: record.consigneeMobile,
      });
    }
  }

  handleSubmit = async () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;
    const $this = this;

    validateFieldsAndScroll(async (error, values) => {
      // 对参数进行处理
      const params = {
        ...values,
        collectionAmount: this.state.selectOrder.payAmount,
        orderId: this.state.selectOrder.orderId,
        orderSn: this.state.selectOrder.orderSn,
        collectionDays: (new Date()).valueOf(),
        payeeMethod: 1,
      };
      delete params.receiverPhoneSearch;

      await dispatch({
        type: 'receipt/saveReceipt',
        payload: params,
      });
      if ($this.props.receipt.saveReceipt && !isNaN($this.props.receipt.saveReceipt)) {
        message.success('保存成功');
        goTo(`/print/receipt/${$this.props.receipt.saveReceipt}`);
      }
    });
  }

  handleSearch = () => {
    const { dispatch, form } = this.props;
    const consigneeMobile = form.getFieldValue('receiverPhoneSearch');
    dispatch({
      type: 'receipt/queryPrintList',
      payload: {
        consigneeMobile,
        pageInfo: {
          currPage: 1,
          pageSize: 0,
        },
      },
    });
  }

  render() {
    const { receipt, form, submitting, loading } = this.props;
    const searchList = receipt?.queryPrintList?.dataList;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form>
            <FormItem {...formItemLayout} label="收货人手机号">
              {form.getFieldDecorator('receiverPhoneSearch', {
                rules: [{
                }],
              })(
                <MonitorInput simple="true" style={{ width: 200 }} />
              )}
              <Button type="primary" style={{ marginLeft: 15 }} onClick={this.handleSearch}>搜索</Button>
            </FormItem>
          </Form>
          <Row style={{ marginRight: '8%', marginBottom: '15px' }}>
            <Col span={12} offset={6}>
              <Table
                columns={columns(this)}
                rowKey="orderId"
                dataSource={searchList || []}
                pagination={false}
                bordered
                scroll={{ y: 300 }}
                loading={loading}
              />
            </Col>
          </Row>

          <Form>
            <FormItem {...formItemLayout} label="收款日期">
              {form.getFieldDecorator('collectionDays', {
                rules: [{
                  required: true, message: '收款日期不能为空',
                }],
                initialValue: moment().format('L'),
              })(
                <MonitorInput disabled="true" simple="true" style={{ width: 150 }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="交款用户">
              {form.getFieldDecorator('consigneeName', {
                rules: [{
                  required: true, message: '交款用户不能为空',
                }],
              })(
                <MonitorInput disabled="true" simple="true" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="收货人手机号码">
              {form.getFieldDecorator('consigneeMobile', {
                rules: [{
                  required: true, message: '收货人手机号码不能为空',
                }],
              })(
                <MonitorInput disabled="true" simple="true" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="商品内容" extra="最多可输入20个字，默认为密蜜家居平台商品">
              {form.getFieldDecorator('goodsContent', {
                rules: [{
                  required: true, message: '商品内容不能为空',
                }],
                initialValue: '密蜜家居平台商品',
              })(
                <MonitorInput maxLength={20} simple="true" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="收款方式">
              {form.getFieldDecorator('payeeMethod', {
                rules: [{
                  required: true, message: '收款方式不能为空',
                }],
                initialValue: 'POS机刷卡支付',
              })(
                <MonitorInput disabled="true" simple="true" style={{ width: 200 }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="收款金额" extra="收款金额=拉卡拉POS机刷卡支付（PC）+T-拉卡拉POS机刷卡支付（移动端）">
              {form.getFieldDecorator('collectionAmount', {
                rules: [{
                  required: true, message: '收款金额不能为空',
                }],
              })(
                <MonitorInput disabled="true" simple="true" style={{ width: 200 }} />
              )} 元
            </FormItem>
            <FormItem {...formItemLayout} label="收款单位">
              {form.getFieldDecorator('payeeUnitName', {
                rules: [{
                  required: true, message: '收款单位不能为空',
                }],
                initialValue: '深圳市恒腾网络有限公司',
              })(
                <MonitorInput disabled="true" simple="true" />
              )}
            </FormItem>
          </Form>
        </Card>

        <DetailFooterToolbar
          form={form}
          fieldLabels={fieldLabels}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          submitBtnTitle="保存并预览"
          handlePatternChange={this.handlePatternChange}
        />
      </PageHeaderLayout>
    );
  }
}
