import React, { PureComponent } from 'react';
import { Input, Select, Modal, Form, Radio } from 'antd';
import { inputTypes, TYPE_SELECT_MULTI, PROPERTY_BASIC_TYPE } from '../const';

const RadioGroup = Radio.Group;

class KeyFormModal extends PureComponent {
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
    const { item, visible, onCancel, type } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal
        title={this.renderTitle()}
        visible={visible}
        onOk={this.handleOk}
        onCancel={onCancel}
      >
        <Form.Item
          label="属性名称"
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
        <Form.Item
          label="录入形式"
          {...this.formItemLayout}
        >
          {getFieldDecorator('inputType', {
            initialValue: item ? item.inputTypes : null,
            rules: [
              { required: true, message: '录入形式不允许为空!' },
            ],
          })(
            <Select style={{ display: 'block' }} placeholder="请选择">
              { Object.keys(inputTypes).filter((k) => {
                if (type === PROPERTY_BASIC_TYPE) {
                  return true;
                } else if (parseInt(k, 10) === TYPE_SELECT_MULTI) {
                  return true;
                }
                return false;
              }).map((k) => {
                return (
                  <Select.Option key={k} value={k}>{inputTypes[k]}</Select.Option>
                );
              }) }
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="是否必填"
          {...this.formItemLayout}
        >
          {getFieldDecorator('isRequired', {
            initialValue: 2, // item ? item.name : '',
            rules: [
              { required: true },
            ],
          })(
            <RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item
          label="是否筛选"
          {...this.formItemLayout}
        >
          {getFieldDecorator('isFilter', {
            initialValue: 1, // item ? item.name : '',
            rules: [
              { required: true, message: '属性组名称不允许为空!' },
            ],
          })(
            <RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item
          label="排序"
          {...this.formItemLayout}
        >
          {getFieldDecorator('orderNum', {
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
export default Form.create()(KeyFormModal);
