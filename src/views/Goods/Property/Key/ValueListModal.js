import React, { Component } from 'react';
import { Table, Modal, Form, Input, InputNumber, Button } from 'antd';
import EditableCell from './EditableCell';
import columns from '../columns';
import styles from './styles.less';

class ValueListModal extends Component {
  state = {
    editableIds: [],
    tmps: {},
  }
  componentWillReceiveProps(nextProps) {
    const { propertyId } = nextProps;
    if (propertyId && propertyId !== this.props.propertyId) {
      this.setState({
        editableIds: [],
      });
    }
  }

  handleChange = (key, index, value) => {
    const { tmps } = this.state;
    const { list } = this.props.propertyValue;
    const property = list[index];
    if (!tmps[property.propertyId]) {
      tmps[property.propertyId] = {};
    }
    if (property.propertyValue === value) {
      delete tmps[property.propertyId][key];
    } else {
      tmps[property.propertyId][key] = value;
    }
    this.setState({ tmps });
  }

  handleSubmitAdd = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.props.handleAddValue) {
          this.props.handleAddValue(values);
        }
      }
    });
  }

  edit(index) {
    const { list } = this.props.propertyValue;
    const { editableIds } = this.state;
    editableIds.push(list[index].propertyId);
    this.setState({
      editableIds,
    });
  }
  editDone = (index, status) => {
    const { propertyValue: { list }, dispatch } = this.props;
    const property = list[index];
    const { tmps } = this.state;
    if (status === 'save') {
      const propertyValue = tmps[property.propertyId] || {};
      if (Object.keys(propertyValue).length > 0) {
        for (const key of Object.keys(propertyValue)) {
          if (!propertyValue[key]) {
            return;
          }
        }
        dispatch({
          type: 'propertyValue/edit',
          payload: propertyValue,
        }).then(() => {
          this.setState({
            editableIds: this.state.editableIds.filter(id => id !== list[index].propertyId),
          });
          this.setState({ tmps });
        });
      } else {
        this.setState({
          editableIds: this.state.editableIds.filter(id => id !== list[index].propertyId),
        });
        this.setState({ tmps });
      }
    } else {
      delete tmps[property.propertyId];
      this.setState({
        editableIds: this.state.editableIds.filter(id => id !== list[index].propertyId),
      });
      this.setState({ tmps });
    }
  }

  renderColumns = (index, key, text) => {
    const { list } = this.props.propertyValue;
    const { propertyId } = list[index];
    const { editableIds } = this.state;

    if (!editableIds.includes(propertyId)) {
      return text;
    }
    return (
      <EditableCell
        editable
        value={text}
        onChange={value => this.handleChange(key, index, value)}
      />
    );
  }

  render() {
    const { loading, visible, onCancel, propertyValue } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Modal footer={null} visible={visible} onCancel={onCancel} width="600px">
        <Form className={styles.add_form} layout="inline" onSubmit={this.handleSubmitAdd}>
          <Form.Item label="属性值">
            {
              getFieldDecorator('propertyValue', {
                rules: [
                  { required: true, message: '属性值不允许为空!' },
                ],
              })(
                <Input placeholder="输入属性值" />
              )
            }
          </Form.Item>
          <Form.Item label="排序">
            { getFieldDecorator('orderNum', {
                initialValue: 0,
                rules: [
                  { required: true, message: '排序值不允许为空!' },
                ],
              })(
                <InputNumber min="0" placeholder="输入排序" />
            )}
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">添加</Button>
          </Form.Item>
        </Form>
        <Table
          bordered
          dataSource={propertyValue.list}
          columns={columns.value(this)}
          loading={loading}
        />;
      </Modal>
    );
  }
}

export default Form.create()(ValueListModal);
