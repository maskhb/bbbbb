import React, { PureComponent } from 'react';
import { Form, Radio, Modal } from 'antd';
import MonitorTextArea from 'components/input/MonitorTextArea';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
    md: { span: 12 },
  },
};
@Form.create()
export default class extends PureComponent {
  handleOk = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, val) => {
      if (err) {
        return;
      }
      onOk(val);
      form.resetFields();
    });
  }
  handleCancel = () => {
    const { onCancel, form } = this.props;
    onCancel();
    form.resetFields();
  }
  render() {
    const { form, onOk, onCancel, ...other } = this.props;
    return (
      <Modal
        title="审核退款申请"
        {...other}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form >
          <Form.Item {...formItemLayout} label="审核结果">
            {form.getFieldDecorator('approveState', {
              rules: [
                { required: true, message: '请选择审核结果' },
              ],
            })(
              <Radio.Group>
                <Radio value={1}>通过</Radio>
                <Radio value={2}>不通过</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="审批意见" help="不超出200个字符">
            {form.getFieldDecorator('reason', {
            })(
              <MonitorTextArea maxLength={200} form={form} datakey="reason" rows={4} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
