import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, TreeSelect, Input, Icon, Message } from 'antd';
// import { departmentTree } from 'utils/attr/baseSetting';
import Common from './../common/common';

@Form.create()
@connect(({ baseSetting }) => ({
  baseSetting,
}))
class DepartmentModal extends PureComponent {
  state = {
    departmentTree: [],
  };

  componentWillUpdate = () => {
    const { departmentTree } = this.props;
    this.setState({
      departmentTree,
    });
  };

  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');

    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length < 10) {
      const nextKeys = keys.concat(keys[keys.length - 1] + 1);
      form.setFieldsValue({
        keys: nextKeys,
      });
    } else {
      Message.error('最多可增加至10行');
    }
  };


  render() {
    const { departmentTree } = this.state;
    const { visible, modalType, selectedNode, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 16 },
      },
    };
    let keys = [];
    if (modalType === 'add') {
      getFieldDecorator('keys', { initialValue: [0] });
      keys = getFieldValue('keys');
    }

    return (
      <Modal
        visible={visible}
        title={modalType === 'edit' ? '编辑部门' : '新增部门'}
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form>
          {
            modalType === 'add' ? (
              <div>
                {
                  keys.map((k, index) => {
                    return (
                      <Form.Item
                        {...formItemLayout1}
                        label={index === 0 ? '新增部门名称' : ' '}
                        key={k}
                      >
                        {form.getFieldDecorator(`depNames[${index}]`, {
                          validateTrigger: ['onChange', 'onBlur'],
                          rules: [{
                            required: true,
                            message: '输入部门名称，最多20个字',
                          }, {
                            max: 20,
                            message: '不允许录入超过20个字',
                          }],
                        })(
                          <Input placeholder="输入部门名称，最多20个字" style={{ width: 275, marginRight: 8 }} />
                        )}
                        {index > 0 ? (
                          <Icon
                            type="minus-circle-o"
                            onClick={() => this.remove(k)}
                          />
                        ) : (
                          <Icon
                            type="plus-circle-o"
                            onClick={() => this.add()}
                          />
                        )}
                      </Form.Item>
                    );
                  })
                }
                <Form.Item label="上级部门" {...formItemLayout}>
                  {form.getFieldDecorator('parentId', {
                    rules: [
                      { message: '请选择上级部门' },
                    ],
                  })(
                    <TreeSelect
                      showSearch
                      treeNodeFilterProp="title"
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择上级部门"
                      allowClear
                      treeDefaultExpandAll
                    >
                      {Common.loop(departmentTree)}
                    </TreeSelect>
                  )}
                </Form.Item>
              </div>
            ) : ''
          }
          {
            modalType === 'edit' ? (
              <div>
                <Form.Item label="部门名称" {...formItemLayout}>
                  {form.getFieldDecorator('depName', {
                    initialValue: modalType === 'edit' ? selectedNode.depName : '',
                    rules: [
                      { required: true, message: '请输入部门名称，最多20个字' },
                      {
                        max: 20,
                        message: '不允许录入超过20个字',
                      },
                    ],
                  })(
                    <Input />
                  )}
                </Form.Item>
              </div>
            ) : ''
          }
          <Form.Item label="备注" {...formItemLayout}>
            {form.getFieldDecorator('memo', {
              initialValue: modalType === 'edit' ? selectedNode.memo : '',
              rules: [
                { message: '请输入备注' },
                {
                  max: 50,
                  message: '不允许录入超过50个字',
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default DepartmentModal;
