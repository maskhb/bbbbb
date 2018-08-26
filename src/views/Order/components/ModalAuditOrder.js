/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:30:44
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-31 18:02:12
 *
 * 审核订单弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal, Form, Input as AntdInput, message } from 'antd';
import Input from 'components/input/DecorateInput';

import { mul } from 'utils/number';

const FormItem = Form.Item;
const { TextArea } = AntdInput;

class ModalAuditOrder extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
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

  handleDefaultOk = async ({ orderSn, remainAmount, sellerRemark = '' }) => {
    const { dispatch, refresh } = this.props;
    await dispatch({
      type: 'orders/audit',
      payload: {
        orderSn,
        remainAmount: mul(remainAmount, 100),
        sellerRemark,
      },
    });

    const { orders } = this.props;
    if (orders?.audit === null) {
      throw new Error();
    }

    message.success('审核订单成功');

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

    const btnElm = <Button key="c_c_mao_btn" type="primary" onClick={this.handleButtonClick}>审核订单</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mao_modal"
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="审核订单"
        okText="提交"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Form>
          <FormItem {...formItemLayout} label="尾款金额">
            {getFieldDecorator('remainAmount', {
              initialValue: '',
              rules: [
                { required: true, message: '请输入尾款金额' },
                { pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '请输入正确的金额' },
                { validator: (rule, value, callback) => {
                  if (value > 9999999999.99) {
                    callback('尾款金额最大为9999999999.99');
                  }
                  callback();
                } },
              ],
            })(
              <Input placeholder="请输入尾款金额" />
            )}
          </FormItem>
          <FormItem {...formItemLayoutRemark}>
            {getFieldDecorator('sellerRemark', {
              rules: [
                { max: 50, message: '最多50个字' },
              ],
            })(
              <TextArea rows={4} placeholder="选填，想对买家说点儿什么，限50个字" />
            )}
          </FormItem>
        </Form>
      </Modal>,
    ];
  }
}

export default Form.create()(ModalAuditOrder);
