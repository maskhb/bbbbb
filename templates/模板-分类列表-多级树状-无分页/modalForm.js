import React, { Component } from 'react';
import { InputNumber, Form, Modal } from 'antd';
import { MonitorInput } from 'components/input';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ xxxCategory, loading }) => ({
  xxxCategory,
  loading: loading.models.xxxCategory,
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
          onOk({ categoryId: data.categoryId, parentId: data.parentId, ...values });
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
          {Number(data?.parentId) ? (
            <FormItem {...formItemLayout} label="上级分类">
              <div>{data?.parents}</div>
            </FormItem>
          ) : ''}
          <FormItem {...formItemLayout} label="分类名称">
            {form.getFieldDecorator('categoryName', {
              rules: [{
                required: true, message: '分类名称不能为空',
              }],
              initialValue: data?.categoryName,
            })(
              <MonitorInput maxLength={50} simple="true" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="排序">
            {form.getFieldDecorator('orderNum', {
              rules: [{
                required: true, message: '排序不能为空',
              }],
              initialValue: data?.orderNum || 100,
            })(
              <InputNumber min={0} max={9999} precision={0} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
