/*
 * @Author: wuhao
 * @Date: 2018-04-23 11:00:35
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-31 18:03:31
 *
 * 修改发票
 */
import React, { PureComponent } from 'react';

import { Modal, Form, Select, message } from 'antd';
import Input from 'components/input/DecorateInput';

import {
  getOptionValueForLabel,
  needInvoiceTypeForNameOptions,
  invoiceTypeNeedOptions,
  invoiceTypeOptions,
} from '../attr';

const FormItem = Form.Item;
const { Option } = Select;

class ModalEditInvoice extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    isNeed: true,
    isPersonal: false,
  }

  handleButtonClick = () => {
    const { params = {} } = this.props;
    const { invoiceVO = {} } = params || {};
    this.setState({
      showModal: true,
    });

    // 由于form在显示modal时隐藏表单，form验证时会验证隐藏元素，故延时100ms在进行隐藏form元素
    setTimeout(() => {
      this.handleNeedInvoiceChange(
        invoiceVO?.type === getOptionValueForLabel(invoiceTypeOptions)('不开发票') ? getOptionValueForLabel(needInvoiceTypeForNameOptions)('不需要') : getOptionValueForLabel(needInvoiceTypeForNameOptions)('需要')
      );
      this.handleInoiceTypeNeedChange(invoiceVO?.type);
    }, 100);
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
      loading: false,
      isNeed: true,
      isPersonal: false,
    });
  }

  handleDefaultOk = async ({
    orderSn,
    need,
    type,
    rise: title,
    identify: taxId,
    invoiceDesc: content,
  }) => {
    const { dispatch, refresh } = this.props;
    await dispatch({
      type: 'orders/invoiceModify',
      payload: {
        orderSn,
        invoiceVO: {
          ...(getOptionValueForLabel(needInvoiceTypeForNameOptions)('不需要') === need ? {
            type: getOptionValueForLabel(invoiceTypeOptions)('不开发票'),
          } : {
            type,
            title,
            taxId,
            content,
          }),
        },
      },
    });

    const { orders } = this.props;
    if (orders?.invoiceModify === null) {
      throw new Error();
    }

    message.success('修改发票信息成功');

    if (refresh) {
      refresh();
    }
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
        isNeed: true,
        isPersonal: false,
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

  handleNeedInvoiceChange = (value) => {
    if (getOptionValueForLabel(needInvoiceTypeForNameOptions)('需要') !== value) {
      this.setState({
        isNeed: false,
      });
    } else {
      this.setState({
        isNeed: true,
      });
    }
  }

  handleInoiceTypeNeedChange = (value) => {
    if (getOptionValueForLabel(invoiceTypeNeedOptions)('个人发票') === value) {
      this.setState({
        isPersonal: true,
      });
    } else {
      this.setState({
        isPersonal: false,
      });
    }
  };

  render() {
    const { hideBtn, btnTitle = '[修改]', params = {} } = this.props;
    const { invoiceVO = {} } = params || {};
    const { showModal, loading, isNeed, isPersonal } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <a key="c_c_mei_a" onClick={this.handleButtonClick}>{btnTitle}</a>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mei_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="添加发票"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="需要发票">
            {getFieldDecorator('need', {
              initialValue: invoiceVO?.type === getOptionValueForLabel(invoiceTypeOptions)('不开发票') ? getOptionValueForLabel(needInvoiceTypeForNameOptions)('不需要') : getOptionValueForLabel(needInvoiceTypeForNameOptions)('需要'),
              rules: [
                { required: true, message: '请选择是否需要发票' },
              ],
            })(
              <Select onChange={this.handleNeedInvoiceChange}>
                {
                  needInvoiceTypeForNameOptions.map(item => (
                    <Option key={item.value} value={item.value}>{item.label}</Option>
                  ))
                }
              </Select>
            )}
          </FormItem>
          {
            isNeed ? [
              <FormItem key="c_c_mei_fi_type" {...formItemLayout} label="发票类型">
                {getFieldDecorator('type', {
                  initialValue: invoiceVO?.type && invoiceVO?.type !== getOptionValueForLabel(invoiceTypeOptions)('不开发票') ? invoiceVO?.type : getOptionValueForLabel(invoiceTypeNeedOptions)('公司发票'),
                  rules: [
                    { required: true, message: '请选择发票类型' },
                  ],
                })(
                  <Select onChange={this.handleInoiceTypeNeedChange}>
                    {
                    invoiceTypeNeedOptions.map(item => (
                      <Option key={item.value} value={item.value}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )}
              </FormItem>,
              <FormItem key="c_c_mei_fi_rise" {...formItemLayout} label="发票抬头">
                {getFieldDecorator('rise', {
                  initialValue: invoiceVO?.title,
                  rules: [
                    { required: true, message: '请输入发票抬头' },
                    { max: 100, message: '最多输入100个字' },
                  ],
                })(
                  <Input placeholder="请输入发票抬头" />
                )}
              </FormItem>,

                !isPersonal ? (
                  <FormItem key="c_c_mei_fi_identify" {...formItemLayout} label="纳税人识别号">
                    {getFieldDecorator('identify', {
                      initialValue: invoiceVO?.taxId,
                      rules: [
                        { required: true, message: '请输入纳税人识别号' },
                        { max: 18, message: '最多输入18个字' },
                      ],
                    })(
                      <Input placeholder="请输入纳税人识别号" />
                    )}
                  </FormItem>
                ) : null,

              <FormItem key="c_c_mei_fi_invoiceDesc" {...formItemLayout} label="发票内容">
                {getFieldDecorator('invoiceDesc', {
                  initialValue: '商品明细',
                })(
                  <Input readOnly />
                )}
              </FormItem>,
            ] : null
          }

        </Form>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalEditInvoice);
