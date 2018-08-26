import React, { Component } from 'react';
import { Form, Select, Modal } from 'antd';
import { MonitorInput, MonitorTextArea } from 'components/input';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ adPos, loading }) => ({
  adPos,
  loading: loading.models.adPos,
}))
@Form.create()
export default class ModalForm extends Component {
  static defaultProps = {
  };
  state = {
  };
  onChange=(value) => {
    return value;
  }
  handleOk = () => {
    const { onOk, data = {}, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (onOk) {
          onOk({ posId: data.posId, ...values });
        }
      }
    });
  }
  render() {
    const { form, data, formTitle, visible, onCancel } = this.props;

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

    return (
      <Modal
        title={formTitle}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        okText="保存"
        width="60%"
        destroyOnClose="true"
      >
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="广告位名称">
            {form.getFieldDecorator('posName', {
            rules: [{
              required: true, message: '广告位名称不能为空',
            }],
            initialValue: data?.posName,
          })(
            <MonitorInput maxLength={50} simple="true" />
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="展现形式">
            {form.getFieldDecorator('showStyle', {
            rules: [{
              required: true, message: '展现形式必须选择',
            }],
            initialValue: data?.showStyle || 1,
          })(
            <Select style={{ width: 120 }}>
              <Select.Option value={1}>图片链接</Select.Option>
            </Select>
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否轮播">
            {form.getFieldDecorator('isScrooling', {
            rules: [{
              required: true, message: '是否轮播必须选择',
            }],
            initialValue: data?.isScrooling || 1,
          })(
            <Select style={{ width: 120 }}>
              <Select.Option value={1} key={1}>是</Select.Option>
              <Select.Option value={2} key={2}>否</Select.Option>
            </Select>
          )}
          </FormItem>
          <FormItem {...formItemLayout} label="说明">
            {form.getFieldDecorator('posDesc', {
            rules: [{
              required: true, message: '说明不能为空',
            }],
            initialValue: data?.posDesc,
          })(
            <MonitorTextArea datakey="posDesc" rows={5} maxLength={200} form={form} />
          )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
