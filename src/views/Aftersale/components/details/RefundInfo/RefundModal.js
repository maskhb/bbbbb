import React from 'react';
import { Modal, Form, InputNumber } from 'antd';
import { MonitorInput } from 'components/input';
import { connect } from 'dva';
import { fenToYuan } from 'utils/money';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10 },
  },
};

@connect(({ user }) => ({
  user,
}))
@Form.create()
export default class RefundModal extends React.PureComponent {
  handleOk = () => {
    this.props.form.validateFields((err, vals) => {
      if (this.props.onOk && !err) {
        // eslint-disable-next-line
        vals.intentRefundAmount *= 100;
        this.props.form.resetFields();
        this.props.onOk(vals);
      }
    });
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    this.props.form.resetFields();
    if (onCancel) {
      onCancel();
    }
  }

  render() {
    const { form, onOk, onCancel, user: { current: user }, maxAmount, ...other } = this.props;
    form.getFieldDecorator('paymentMethodCode', {
      initialValue: 'pre_deposit',
    });
    form.getFieldDecorator('paymentMethodName', {
      initialValue: '预存款支付',
    });
    return (
      <Modal
        title="添加退款信息"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        {...other}
      >
        <Form>
          <Form.Item {...formItemLayout} label="退款方式">
            预存款支付
          </Form.Item>
          <Form.Item {...formItemLayout} label="意向金额" help={`最大可输入 ${fenToYuan(maxAmount)}`}>
            {form.getFieldDecorator('intentRefundAmount', {
              rules: [
                { required: true, message: '请输入正确的意向金额' },
              ],
            })(
              <InputNumber precision={2} style={{ width: '100%' }} min={0.01} max={maxAmount / 100} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="交易流水号">
            {form.getFieldDecorator('transactionId', {
              rules: [
                { required: true, message: '请输入交易流水号' },
              ],
            })(
              <MonitorInput maxLength={30} simple />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="操作人">
            {user.name}
          </Form.Item>
          <Form.Item {...formItemLayout} label="操作人账号">
            {user.loginName}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
