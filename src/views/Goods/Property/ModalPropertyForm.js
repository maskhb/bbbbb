import React, { PureComponent } from 'react';
import { Input, Modal, Form } from 'antd';

class ModalPropertyForm extends PureComponent {
  formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  handleOk = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (onOk) {
          onOk(values);
        }
      }
    });
  }
  renderTitle() {
    const { item } = this.props;
    const title = item ? '添加属性组' : '编辑属性组';
    return title;
  }
  render() {
    const { item, visible, onCancel } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={this.renderTitle()}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
      >
        <Form.Item
          label="属性组名称"
          {...this.formItemLayout}
        >
          {getFieldDecorator('name', {
            initialValue: item ? item.name : '',
            rules: [
              { required: true, message: '属性组名称不允许为空!' },
              { max: 50, message: '属性组名称不允许超过50个字符!' },
            ],
          })(
            <Input />
          )}
        </Form.Item>
      </Modal>
    );
  }
}
export default Form.create()(ModalPropertyForm);
