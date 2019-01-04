import React, { PureComponent } from 'react';
import { Modal, Form, Input } from 'antd';

import ChooseRoleGroupModal from './ChooseRoleGroupModal';
import './styles.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@Form.create()
export default class ModalForm extends PureComponent {
  handleOk = () => {
    const { onOk, form, data } = this.props;
    // const values = form.getFieldsValue();
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      onOk({ roleVO: {
        ...data,
        roleName: values.roleName,
      },
      roleGroupIds: values.roleGroupIds }, () => {
        form.resetFields();
      });
    });
  }
  handleCancel = () => {
    const { onCancel, form } = this.props;
    onCancel();
    form.resetFields();
  }
  render() {
    const {
      visible = true,
      cancelText = '取消保存', form: {
        setFieldsValue,
        getFieldDecorator,
      },
      data = {},
    } = this.props;

    const isEdit = !!data.roleId;

    return (
      <Modal
        title={isEdit ? '编辑角色' : '新增角色'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={isEdit ? '保存更改' : '保存新建'}
        cancelText={cancelText}
        styleName="form-modal"
        // width={600}
      >
        <Form >
          <Form.Item
            {...formItemLayout}
            label={isEdit ? '编辑角色名称' : '新建角色名称'}
          >
            {getFieldDecorator('roleName', {
              initialValue: data.roleName,
              rules: [
                { required: true, message: '角色名称不能为空' },
              ],
            })(<Input />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="选择关联角色组"
          >
            {getFieldDecorator('roleGroupName', {
              rules: [
                {
                  required: true, message: '关联角色组不能为空',
                },
              ],
              initialValue: data.roleGroupsRelated?.map(g => g.roleGroupName).join(', ') || '',
            })(<Input readOnly />)}
            &nbsp;&nbsp;&nbsp;&nbsp;
            {getFieldDecorator('roleGroupIds', {
              initialValue: data?.roleGroupsRelated?.map(r => r.roleGroupId) || [],
            })(
              <ChooseRoleGroupModal
                dispatch={this.props.dispatch}
                role={this.props.role}
                onOpen={() => {
                }}
                onCancel={() => {
                }}
                onOk={(groups) => {
                  setFieldsValue({
                    roleGroupName: groups.map(g => g.roleGroupName).join(', '),
                  });
              }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
