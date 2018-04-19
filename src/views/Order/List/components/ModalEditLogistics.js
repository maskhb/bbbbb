/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:26:55
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-16 11:14:46
 *
 * 修改物流信息弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal, Form, Input, Select, Radio } from 'antd';

import { expressCompanyListOptions } from 'components/Const';
import { getOptionLabelForValue, LogisticsTypeOptions } from '../attr';

const FormItem = Form.Item;
const { Option } = Select;
const { Group: RadioGroup, Button: RadioButton } = Radio;

class ModalEditLogistics extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
    isHideLogistics: false,
    isMorePackage: true,
  }

  handlePackageNumChange = (e) => {
    const { value } = e.target;

    this.props.form.setFieldsValue({
      logisticsNumber: value,
    });
  }

  handleRadioChange = (e) => {
    const { value } = e.target;

    this.setState({
      isHideLogistics: getOptionLabelForValue(LogisticsTypeOptions)(value) === '无需物流',
    });
  }

  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
      isHideLogistics: false,
    });
  }

  // 调用onOk事件进行回调
  callbackOnOk = async (values) => {
    const { onOk, params } = this.props;
    if (onOk) {
      this.setState({
        loading: true,
      });
      await onOk({ ...params, ...values });
    }
    this.setState({
      showModal: false,
      loading: false,
      isHideLogistics: false,
    });
  }

  handleModalOk = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.callbackOnOk(values);
      }
    });
  }

  render() {
    const { hideBtn } = this.props;
    const { showModal, loading, isHideLogistics, isMorePackage } = this.state;

    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const btnElm = <Button onClick={this.handleButtonClick}>修改物流</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="修改物流"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          {
          isMorePackage ? (
            <FormItem style={{ textAlign: 'center' }}>
              {getFieldDecorator('packageNumber', {
                initialValue: '1',
                })(
                  <RadioGroup onChange={this.handlePackageNumChange}>
                    {
                      (LogisticsTypeOptions || []).map((item, index) => (
                        <RadioButton value={`${index + 1}`} >包裹 {index + 1}</RadioButton>
                      ))
                    }
                  </RadioGroup>
                )}
            </FormItem>
          ) : null
        }

          <FormItem {...formItemLayout} label="发货方式">
            {getFieldDecorator('type', {
            initialValue: '1',
            })(
              <RadioGroup onChange={this.handleRadioChange}>
                {
                  (LogisticsTypeOptions || []).map(item => (
                    <Radio value={`${item.value}`} >{item.label}</Radio>
                  ))
                }
              </RadioGroup>
            )}
          </FormItem>
          {
          isHideLogistics ? null : [
            <FormItem {...formItemLayout} label="快递公司">
              {getFieldDecorator('logisticsCompany', {
                initialValue: '',
                rules: [
                  { required: true, message: '请选择快递公司' },
                ],
                })(
                  <Select style={{ width: '100%' }}>
                    <Option value="">请选择快递公司</Option>
                    {
                      (expressCompanyListOptions || []).map(item => (
                        <Option value={`${item.value}`}>{item.label}</Option>
                      ))
                    }
                  </Select>
                )}
            </FormItem>,
            <FormItem {...formItemLayout} label="快递单号">
              {getFieldDecorator('logisticsNumber', {
                rules: [
                  { required: true, message: '请填写快递单号' },
                  { max: 20, message: '快递单号最长20位' },
                ],
                })(
                  <Input />
                )}
            </FormItem>,
          ]
        }
        </Form>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalEditLogistics);
