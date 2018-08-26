/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:14:03
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-05 17:05:16
 *
 * 修改金额弹框
 */
import React, { PureComponent } from 'react';
import { sub, mul } from 'utils/number';

import { Button, Modal, Form, Input as AntdInput, message } from 'antd';
import Input from 'components/input/DecorateInput';

const FormItem = Form.Item;
const { TextArea } = AntdInput;

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
    // const { money = 0, remainMoney = 0, discountMoney = 0 } = this.props.form.getFieldsValue();
    const { money = 0, remainMoney = 0 } = this.props.form.getFieldsValue();

    if (money < remainMoney) {
      callback('请输入正常金额');
    }

    callback();

    // this.props.form.setFieldsValue({
    //   discountMoney,
    // });
  }

  /**
   * 优惠金额 校验
   */
  validatorDiscountMoney = (rule, value, callback) => {
    // const { money = 0, remainMoney = 0, discountMoney = 0 } = this.props.form.getFieldsValue();
    const { money = 0, discountMoney = 0 } = this.props.form.getFieldsValue();

    if (money < discountMoney) {
      callback('请输入正常金额');
    }
    // else if (`${discountMoney}` !== `${sub(money, remainMoney)}`) {
    //   callback('请输入正常金额');
    // }

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

  handleDefaultOk = async ({ orderSn, discountMoney = 0, orderRemark = '', money = 0 }) => {
    const { dispatch, refresh } = this.props;
    await dispatch({
      type: 'orders/modifyMoney',
      payload: {
        orderSn,
        remainMoney: mul(money, 100),
        discountMoney: mul(discountMoney, 100),
        orderRemark,
      },
    });

    const { orders } = this.props;
    if (orders?.modifyMoney === null) {
      throw new Error();
    }

    message.success('修改金额成功');

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

  handRemainMoneyChange = (e) => {
    const { money = 0 } = this.props.form.getFieldsValue();
    const { value } = e?.target;

    const newMoney = sub(money, value);
    this.props.form.setFieldsValue({
      discountMoney: newMoney > 0 ? newMoney : 0,
    });
  }

  handDiscountMoneyChange = (e) => {
    const { money = 0 } = this.props.form.getFieldsValue();
    const { value } = e?.target;

    const newMoney = sub(money, value);
    this.props.form.setFieldsValue({
      remainMoney: newMoney > 0 ? newMoney : 0,
    });
  }

  render() {
    const { hideBtn, params = {} } = this.props;
    const { orderAmountReal = 0, orderAmountPaid = 0 } = params || {};
    const { showModal, loading } = this.state;

    const { getFieldDecorator } = this.props.form;


    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const formItemLayoutRemark = {
      wrapperCol: { span: 18, offset: 6 },
    };

    const btnElm = <Button key="c_c_mem_btn" type="primary" onClick={this.handleButtonClick}>修改金额</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mem_modal"
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
              initialValue: sub(orderAmountReal, orderAmountPaid) / 100,
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
              <Input placeholder="请输入应付金额" autoComplete="off" onChange={this.handRemainMoneyChange} />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="优惠金额">
            {getFieldDecorator('discountMoney', {
              rules: [
                { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额' },
                { validator: this.validatorDiscountMoney },
              ],
            })(
              <Input placeholder="可输入优惠金额" autoComplete="off" onChange={this.handDiscountMoneyChange} />
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
