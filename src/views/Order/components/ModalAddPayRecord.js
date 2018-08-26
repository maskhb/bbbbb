/*
 * @Author: wuhao
 * @Date: 2018-04-23 11:01:28
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-01 11:18:57
 *
 * 增加支付记录
 */
import React, { PureComponent } from 'react';

import uuidv4 from 'uuid/v4';

import { Modal, Form, Select, InputNumber, Button, message } from 'antd';
import SelectPaymentMethod from 'components/SelectPaymentMethod/business';
import Input from 'components/input/DecorateInput';

import { sub, div as division, mul } from 'utils/number';

import {
  getOptionValueForLabel,
  payStatusOptions,
  payStatusNoDepositOptions,
  payTypeOptions,
} from '../attr';
import { transformOrderPayRecords } from '../transform';

const FormItem = Form.Item;
const { Option } = Select;

class ModalAddPayRecord extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    showPayFlowWater: false,
  }


  handleButtonClick = () => {
    const { orders, form } = this.props;
    const payList = transformOrderPayRecords(
      orders?.detail?.paymentRecordVOList,
      orders?.addOrderPayListForLocal,
      orders?.editOrderPayStatusListForLocal
    );

    for (const paymentRecord of (payList || [])) {
      if (paymentRecord?.statusFormat === '未支付') {
        message.info('有未支付的支付信息');
        return;
      }
    }

    this.setState({
      showModal: true,
      showPayFlowWater: false,
    });

    setTimeout(() => {
      form?.resetFields();
    }, 100);
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
    });
  }

  handleDefaultOk = async ({
    orderSn,
    money,
    paymentMethodCode,
    payStatus,
    transactionId = '',
  }) => {
    const { dispatch } = this.props;

    const addOrderPayListForLocal = [
      ...(this.props?.orders?.addOrderPayListForLocal || []),
    ];

    addOrderPayListForLocal.push({
      orderSn,
      money: mul(money, 100) || 0,
      paymentMethodCode,
      payStatus,
      transactionId,
      paymentRecordId: uuidv4(),
    });

    await dispatch({
      type: 'orders/addOrderPayListForLocal',
      payload: addOrderPayListForLocal,
    });

    message.success('请点击页面结尾保存按钮完成操作~');
    // message.success('添加支付成功');
  }

  // 调用onOk事件进行回调
  callbackOnOk = async (values) => {
    const { onOk, params } = this.props;
    this.setState({
      loading: true,
    });

    try {
      if (onOk) {
        await onOk({ ...params, ...values });
      } else {
        await this.handleDefaultOk({ ...params, ...values });
      }
      this.setState({
        showModal: false,
        loading: false,
      });
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  }

  changePaymentFlowNumShowOrHide = (payStatus, paymentMethodCode) => {
    if (getOptionValueForLabel(payStatusOptions)('已支付') === payStatus &&
      getOptionValueForLabel(payTypeOptions)('钱包') !== paymentMethodCode &&
      getOptionValueForLabel(payTypeOptions)('预存款') !== paymentMethodCode
    ) {
      this.setState({
        showPayFlowWater: true,
      });
    } else {
      this.setState({
        showPayFlowWater: false,
      });
    }
  }

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.callbackOnOk(values);
      }
    });
  }

  handlePayStatusChange = (payStatus) => {
    const { form } = this.props;
    const paymentMethodCode = form?.getFieldValue('paymentMethodCode');

    this.changePaymentFlowNumShowOrHide(payStatus, paymentMethodCode);
  }

  handlePaymentMethodCodeChange = (paymentMethodCode) => {
    const { form } = this.props;
    const payStatus = form?.getFieldValue('payStatus');

    this.changePaymentFlowNumShowOrHide(payStatus, paymentMethodCode);

    if (
      getOptionValueForLabel(payTypeOptions)('钱包') === paymentMethodCode ||
      getOptionValueForLabel(payTypeOptions)('预存款') === paymentMethodCode
    ) {
      form?.setFieldsValue({ payStatus: getOptionValueForLabel(payStatusOptions)('已支付') });
    }
  }

  render() {
    const { hideBtn, btnTitle = '增加支付', orders } = this.props;
    const { showModal, loading, showPayFlowWater } = this.state;

    const { getFieldDecorator } = this.props.form;

    const waitTotal = division(sub(
      orders?.detail?.orderAmountReal,
      orders?.detail?.orderAmountPaid
    ) || 0, 100);

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <Button key="c_c_mapr_btn" type="primary" onClick={this.handleButtonClick}>{btnTitle}</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mapr_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="增加支付"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="支付金额">
            {getFieldDecorator('money', {
              rules: [
                { required: true, message: '请输入支付金额' },
                { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额' },
                { validator: (rule, value, callback) => {
                  if (value < 0.01) {
                    callback('输入最小金额为0.01元');
                  } else if (value > 100000) {
                    callback('输入最大金额为10万元');
                  } else if (value > waitTotal) {
                    callback('支付金额不能大于待支付金额');
                  }
                  callback();
                } },
              ],
            })(
              <InputNumber
                min={0}
                // max={waitTotal > 100000 ? 100000 : waitTotal}
                placeholder="请输入支付金额"
                style={{
                  width: '100%',
                }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="支付方式">
            {getFieldDecorator('paymentMethodCode', {
              rules: [
                { required: true, message: '请选择支付方式' },
              ],
            })(
              <SelectPaymentMethod type={1} allowClear placeholder="请选择支付方式" onChange={this.handlePaymentMethodCodeChange} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="支付状态">
            {getFieldDecorator('payStatus', {
              rules: [
                { required: true, message: '请选择支付状态' },
              ],
            })(
              <Select placeholder="请选择支付状态" onChange={this.handlePayStatusChange}>
                {
                  payStatusNoDepositOptions.map(item => (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          {
            showPayFlowWater ? (
              <FormItem {...formItemLayout} label="支付流水号">
                {getFieldDecorator('transactionId', {
                  rules: [
                    { required: true, message: '请输入支付流水号' },
                  ],
                })(
                  <Input placeholder="请输入支付流水号" />
                )}
              </FormItem>
            ) : null
          }

        </Form>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span>订单总额：</span><span>¥{orders?.detail?.orderTotalFormat} </span>&nbsp;&nbsp;
          <span>已支付：</span><span>¥{orders?.detail?.orderAmountPaidFormat}</span>&nbsp;&nbsp;
          <span>待支付：</span><span style={{ color: '#ff6600' }}>¥{orders?.detail?.waitTotalFormat}</span>
        </div>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalAddPayRecord);
