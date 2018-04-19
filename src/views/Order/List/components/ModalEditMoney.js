/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:14:03
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-12 17:31:06
 *
 * 修改金额弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal, Form, Input } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class ModalEditMoney extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
  }

  /**
   * 应付金额 校验
   */
  validatorRemainMoney = (rule, value, callback) => {
    const { money = 0, remainMoney = 0 } = this.props.form.getFieldsValue();

    if (money < remainMoney) {
      callback('应付金额应小于等于待付金额');
    }

    callback();

    this.props.form.validateFields(['discountMoney']);
  }

  /**
   * 优惠金额 校验
   */
  validatorDiscountMoney = (rule, value, callback) => {
    const { money = 0, remainMoney = 0, discountMoney = 0 } = this.props.form.getFieldsValue();

    if (money < discountMoney) {
      callback('优惠金额应小于等于待付金额');
    } else if ((discountMoney * 100) !== (money * 100) - (remainMoney * 100)) {
      callback('优惠金额=待付金额-应付金额');
    }

    callback();
  }

  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
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
    const { showModal, loading } = this.state;

    const { getFieldDecorator } = this.props.form;


    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const formItemLayoutRemark = {
      wrapperCol: { span: 18, offset: 6 },
    };

    const btnElm = <Button type="primary" onClick={this.handleButtonClick}>修改金额</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="修改金额"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="待付金额">
            {getFieldDecorator('money', {
            })(
              <Input readOnly />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="应付金额">
            {getFieldDecorator('remainMoney', {
              rules: [
                { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额' },
                { validator: this.validatorRemainMoney },
              ],
            })(
              <Input placeholder="请输入应付金额" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠金额">
            {getFieldDecorator('discountMoney', {
              rules: [
                { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额' },
                { validator: this.validatorDiscountMoney },
              ],
            })(
              <Input placeholder="可输入优惠金额" />
            )}
          </FormItem>
          <FormItem {...formItemLayoutRemark}>
            {getFieldDecorator('orderRemark', {
              rules: [
                { max: 50, message: '最多50个字' },
              ],
            })(
              <TextArea rows={4} placeholder="选填，可输入备注信息，最多50个字" />
            )}
          </FormItem>
        </Form>
        <span style={{
          color: '#cccccc',
          marginLeft: '140px',
        }}
        >优惠金额=待付金额-应付金额，优惠金额将分摊到每个商品
        </span>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalEditMoney);
