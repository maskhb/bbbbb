import { MonitorInput } from 'components/input';
import React, { PureComponent } from 'react';
import { /* Input, */ InputNumber, Select, Modal, Form, Radio } from 'antd';
import { inputTypes, TYPE_SELECT_MULTI, PROPERTY_BASIC_TYPE } from '../const';

const RadioGroup = Radio.Group;

class KeyFormModal extends PureComponent {
  formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
  };

  handleOk = () => {
    const { onOk, form, item } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (onOk) {
          onOk({
            ...item,
            ...values,
            propertyName: values.propertyName.replace(/,|，/g, ''),
          });
        }
      }
    });
  }
  renderTitle() {
    const { item, type } = this.props;
    const title = `${(item ? '编辑' : '添加')}${
      type === PROPERTY_BASIC_TYPE ? '基本属性' : '规格属性'
    }`;
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
          {getFieldDecorator('propertyName', {
            initialValue: item ? item.propertyName : '',
            rules: [
              { required: true, message: '属性组名称不允许为空!' },
              { max: 50, message: '属性组名称不允许超过50个字符!' },
            ],
          })(
            <MonitorInput maxLength={50} simple="true" />
          )}
        </Form.Item>
        <Form.Item
          label="录入形式"
          {...this.formItemLayout}
        >
          {getFieldDecorator('inputType', {
            initialValue: item ? item.inputType : null,
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
                  <Select.Option key={k} value={parseInt(k, 10)}>{inputTypes[k]}</Select.Option>
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
            initialValue: item ? item.isRequired : (type === PROPERTY_BASIC_TYPE ? 2 : 1),
            rules: [
              { required: true },
            ],
          })(
            <RadioGroup>
              <Radio value={1}>是</Radio>
              { type === PROPERTY_BASIC_TYPE && (<Radio value={2}>否</Radio>) }
            </RadioGroup>
          )}
        </Form.Item>
        <Form.Item
          label="是否筛选"
          {...this.formItemLayout}
        >
          {getFieldDecorator('isFilter', {
            initialValue: item ? item.isFilter : 2,
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
        {
          type !== PROPERTY_BASIC_TYPE && (
            <Form.Item
              label="是否支持自定义值"
              {...this.formItemLayout}
            >
              {getFieldDecorator('isCustmer', {
                initialValue: item ? item.isCustmer : 2,
                rules: [
                  { required: true, message: '是否支持自定义值不允许为空!' },
                ],
              })(
                <RadioGroup>
                  <Radio value={1}>是</Radio>
                  <Radio value={2}>否</Radio>
                </RadioGroup>
              )}
            </Form.Item>
          )
        }
        <Form.Item
          label="排序"
          {...this.formItemLayout}
        >
          {getFieldDecorator('orderNum', {
            initialValue: item ? item.orderNum : 100,
            rules: [
              { required: true, message: '属性名称排序不允许为空!' },
            ],
          })(
            <InputNumber min={1} max={9999} />
          )}
        </Form.Item>
      </Modal>
    );
  }
}
export default Form.create()(KeyFormModal);
