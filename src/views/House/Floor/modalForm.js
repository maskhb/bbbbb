import React, { Component } from 'react';
import { Form, Modal, InputNumber, Input } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ building, loading }) => ({
  building,
  loading: loading.models.building,
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
          onOk({ floorId: data?.floorId, ...values });
        }
      }
    });
  }
  render() {
    const { form, data, title, visible, onCancel } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        xl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        xl: { span: 18 },
      },
    };

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
        okText="确定"
        width="600px"
        destroyOnClose="true"
      >
        <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="楼层名">
            {
              form.getFieldDecorator('floorName', {
                rules: [
                  { required: true, max: 10, message: '必填，最多10个字' },
                ],
                initialValue: data?.floorName || '',
              })(
                <Input placeholder="最多10个字" />
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="优先级">
            {
              form.getFieldDecorator('sort', {
                rules: [
                  { type: 'number', required: true, min: 0, max: 100, message: '必填,0-100之间的整数' },
                ],
                initialValue: data?.sort,
              })(
                <InputNumber placeholder="0~100之间的整数，数字越小优先级越高" precision={0} style={{ width: '100%' }} />
              )
            }
          </FormItem>

        </Form>
      </Modal>
    );
  }
}
