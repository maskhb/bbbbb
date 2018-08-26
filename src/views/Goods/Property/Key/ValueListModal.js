import React, { Component } from 'react';
import { Table, Modal, Form, InputNumber, Button } from 'antd';
import { MonitorInput } from 'components/input';
import EditableCell from './EditableCell';
import columns from '../columns';
import styles from './styles.less';

class ValueListModal extends Component {
  state = {
    editableIds: [],
    tmps: {},
    pageInfo: {
      pageSize: 10,
    },
  }

  componentDidMount() {
    this.handleSearch();
  }

  handleSearch(pageInfo = null) {
    const { dispatch, propertyKeyId } = this.props;
    dispatch({
      type: 'propertyValue/list',
      payload: {
        propertyKeyId,
        pageInfo: pageInfo || this.state.pageInfo,
      },
    });
  }


  handleChange = (key, index, value) => {
    const { tmps } = this.state;
    const { list } = this.props.propertyValue;
    const property = list[index];
    if (!tmps[property.propertyValueId]) {
      tmps[property.propertyValueId] = {};
    }
    if (property.propertyValue === value) {
      delete tmps[property.propertyValueId][key];
    } else {
      tmps[property.propertyValueId][key] = value;
    }
    this.setState({ tmps });
  }

  handleSubmitAdd = (e) => {
    e.preventDefault();
    const { dispatch, propertyKeyId, form: { resetFields } } = this.props;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let { propertyValue } = values;
        propertyValue = propertyValue.replace(/,|，/g, '');
        const newValues = { ...values, propertyValue };
        dispatch({
          type: 'propertyValue/add',
          payload: {
            propertyKeyId,
            ...newValues,
          },
        }).then((res) => {
          if (res !== null) {
            resetFields();
            this.handleSearch();
          }
        });
        // if (this.props.handleAddValue) {
        //   this.props.handleAddValue(this.props.propertyKeyId, values);
        // }
      }
    });
  }

  handleRemove = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'propertyValue/remove',
      payload: {
        propertyValueId: item.propertyValueId,
      },
    }).then((res) => {
      if (res !== null) {
        this.handleSearch();
      }
    });
  }

  edit(index) {
    const { list } = this.props.propertyValue;
    const { editableIds } = this.state;
    if (!editableIds.includes(list[index].propertyValueId)) {
      editableIds.push(list[index].propertyValueId);
      this.setState({
        editableIds,
      });
    }
  }


  editDone = (index, status) => {
    const { propertyValue: { list }, dispatch } = this.props;
    const property = list[index];
    const { tmps } = this.state;
    if (status === 'save') {
      const propertyValue = tmps[property.propertyValueId] || {};
      if (Object.keys(propertyValue).length > 0) {
        for (const key of Object.keys(propertyValue)) {
          if (!propertyValue[key]) {
            return;
          }
        }
        dispatch({
          type: 'propertyValue/edit',
          payload: {
            propertyValueId: property.propertyValueId,
            propertyValue: property.propertyValue,
            orderNum: property.orderNum,
            ...propertyValue,
          },
        }).then(() => {
          this.setState({
            editableIds: this.state.editableIds.filter(id => id !== list[index].propertyValueId),
          });
          delete tmps[property.propertyValueId];
          this.setState({ tmps });
          this.handleSearch();
        });
      } else {
        this.setState({
          editableIds: this.state.editableIds.filter(id => id !== list[index].propertyValueId),
        });
        this.setState({ tmps });
      }
    } else {
      delete tmps[property.propertyValueId];
      this.setState({
        editableIds: this.state.editableIds.filter(id => id !== list[index].propertyValueId),
      });
      this.setState({ tmps });
    }
  }

  renderColumns = (index, key, text) => {
    const { list } = this.props.propertyValue;
    const { propertyValueId } = list[index];
    const { editableIds } = this.state;

    if (!editableIds.includes(propertyValueId)) {
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
      <Modal title="管理标准值" footer={null} visible={visible} onCancel={onCancel} width="600px">
        <Form className={styles.add_form} layout="inline" onSubmit={this.handleSubmitAdd}>
          <Form.Item label="属性值">
            {
              getFieldDecorator('propertyValue', {
                rules: [
                  { required: true, message: '属性值不允许为空!' },
                  // { pattern: (/\,|，/g), message: '不允许输入中英文逗号!' }, // esline-disable-line
                ],
                getValueFromEvent(e) {
                  let value;
                  if (!e || !e.target) {
                    value = e;
                  } else {
                    const { target } = e;
                    // eslint-disable-next-line
                    value =  target.type === 'checkbox' ? target.checked : target.value;
                  }
                  // eslint-disable-next-line
                  if (value.__proto__ === String.prototype) {
                    return value.replace(/,|，/g, '');
                  }
                  return value;
                },
              })(
                <MonitorInput maxLength={10} simple="true" placeholder="输入属性值" />
              )
            }
          </Form.Item>
          <Form.Item label="排序">
            { getFieldDecorator('orderNum', {
                initialValue: 1,
                rules: [
                  { required: true, message: '排序值不允许为空!' },
                ],
              })(
                <InputNumber min={1} max={9999} placeholder="输入排序" />
            )}
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">添加</Button>
          </Form.Item>
        </Form>
        <Table
          rowKey="propertyValueId"
          bordered
          dataSource={propertyValue.list}
          columns={columns.value(this)}
          loading={loading}
          pagination={propertyValue.pagination}
          onChange={(pager) => {
            const pageInfo = {
              currPage: pager.current,
              pageSize: pager.pageSize,
            };
            this.setState({
              pageInfo,
            });
            this.handleSearch(pageInfo);
          }}
        />
      </Modal>
    );
  }
}

export default Form.create()(ValueListModal);
