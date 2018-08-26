/*
 * @Author: wuhao
 * @Date: 2018-04-23 11:01:56
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-11 18:33:48
 *
 * 修改支付状态
 */
import React, { PureComponent } from 'react';

import { Modal, Form, Select, InputNumber, message } from 'antd';

import { sub, div as division, mul } from 'utils/number';

import SelectPaymentMethod from 'components/SelectPaymentMethod/business';
import Input from 'components/input/DecorateInput';

import {
  getOptionValueForLabel,
  payTypeOptions,
} from '../attr';

const FormItem = Form.Item;
const { Option } = Select;

class ModalEditPayStatus extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    showPayFlowWater: true,
  }

  handlePaymentMethodCodeChange = (paymentMethodCode) => {
    if (
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

  handleButtonClick = () => {
    this.setState({
      showModal: true,
      showPayFlowWater: true,
    });
    this.handlePaymentMethodCodeChange(this.props?.params?.paymentMethodCode);
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
    transactionId,
  }) => {
    const { dispatch, params = {} } = this.props;
    const editOrderPayList = [
      ...(this.props?.orders?.editOrderPayStatusListForLocal || []),
    ];

    const newOrderPayList = editOrderPayList.filter((item) => {
      return item.paymentRecordId !== params?.paymentRecordId;
    });

    newOrderPayList.push({
      orderSn,
      paymentRecordId: params?.paymentRecordId,
      money: mul(money, 100) || 0,
      paymentMethodCode,
      payStatus,
      transactionId,
    });

    await dispatch({
      type: 'orders/editOrderPayStatusListForLocal',
      payload: newOrderPayList,
    });

    message.success('请点击页面结尾保存按钮完成操作~');
    // message.success('修改支付状态成功');
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

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.callbackOnOk(values);
      }
    });
  }

  render() {
    const { hideBtn, btnTitle = '修改支付状态', params, orders } = this.props;
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

    const btnElm = <a key="c_c_meps_a" onClick={this.handleButtonClick}>{btnTitle}</a>;
    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_meps_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="修改支付方式"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="支付单号">
            {getFieldDecorator('payOrder', {
              initialValue: params?.payOrder,
            })(
              <span>{params?.payOrder}</span>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="支付金额">
            {getFieldDecorator('money', {
              initialValue: division(params?.amount, 100) || 0,
              rules: [
                { required: true, message: '请输入支付金额' },
                { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额' },
                { validator: (rule, value, callback) => {
                  if (value > waitTotal) {
                    callback('支付金额不能大于待支付金额');
                  }
                  callback();
                } },
              ],
            })(
              <InputNumber
                min={0}
                // max={waitTotal || 0}
                placeholder="请输入支付金额"
                style={{
                  width: '100%',
                }}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="支付方式">
            {getFieldDecorator('paymentMethodCode', {
              initialValue: params?.paymentMethodCode,
              rules: [
                { required: true, message: '请选择支付方式' },
              ],
            })(
              <SelectPaymentMethod type={1} allowClear placeholder="请选择支付方式" onChange={this.handlePaymentMethodCodeChange} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="支付状态">
            {getFieldDecorator('payStatus', {
              initialValue: 2,
              rules: [
                { required: true, message: '请选择支付状态' },
              ],
            })(
              <Select placeholder="请选择支付状态">
                <Option value={2}>已支付</Option>
              </Select>
            )}
          </FormItem>
          {
            showPayFlowWater && (
            <FormItem {...formItemLayout} label="支付流水号">
              {getFieldDecorator('transactionId', {
              initialValue: params?.transactionId || null,
              rules: [
                { required: true, message: '请输入支付流水号' },
              ],
            })(
              <Input placeholder="请输入支付流水号" />
            )}
            </FormItem>
          )}

        </Form>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <span style={{ color: 'red' }}>修改已支付状态前，确认已收到用户付款金额！</span>
        </div>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalEditPayStatus);
