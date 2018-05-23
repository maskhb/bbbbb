import React, { PureComponent } from 'react';
import { Modal, Form } from 'antd';
import { MonitorInput } from 'components/input';

class ModalPropertyForm extends PureComponent {
  formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  handleOk = () => {
    const { onOk, item = {}, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (onOk) {
          onOk({ propertyGroupId: item.propertyGroupId, ...values });
        }
      }
    });
  }
  renderTitle() {
    const { item } = this.props;
    const title = item ? '编辑属性组' : '添加属性组';
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
          {getFieldDecorator('propertyGroupName', {
            initialValue: item ? item.propertyGroupName : '',
            rules: [
              { required: true, message: '属性组名称不允许为空!' },
              { max: 50, message: '属性组名称不允许超过50个字符!' },
            ],
          })(
            <MonitorInput maxLength={50} simple="true" />
          )}
        </Form.Item>
      </Modal>
    );
  }
}
export default Form.create()(ModalPropertyForm);
