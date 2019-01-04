import React, { PureComponent } from 'react';
import { Modal, Form, TreeSelect, Input } from 'antd';

import Common from './../../common/common';
// import OrgTreeModal from './OrgTreeModal';
// import './styles.less';

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


const formKeyMap = {
  orgNameSelected: 'orgNameSelected',
  orgIds: 'orgIds',
  loginName: 'loginName',
  password: 'passWord',
  usedName: 'userName',
  usedPhone: 'mobile',
};

@Form.create()
export default class AddModal extends PureComponent {
  state = {}
  handleOk = () => {
    const { onOk, form, data } = this.props;
    // const values = form.getFieldsValue();

    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      onOk({ ...data, ...values, orgIds: values.orgIds.map(l => l.value) }, () => {
        setTimeout(() => {
          form.resetFields();
        }, 100);
      });
    });
  }

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    setTimeout(() => {
      this.props.form.resetFields();
    }, 200);
  }
  render() {
    const {
      visible = true,
      cancelText = '取消保存', form: {
        // setFieldsValue,
        getFieldDecorator,
      },
      data = {},
      // AccountOrgsInTree,
      organizeTree,
    } = this.props;

    const isEdit = !!data.accountId;

    getFieldDecorator(formKeyMap.orgIds, {
      initialValue: data[formKeyMap.orgIds],
    });

    return (
      <Modal
        title={isEdit ? '编辑账号' : '新建账号'}
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        okText={isEdit ? '保存更改' : '保存新建'}
        cancelText={cancelText}
        // styleName="form-modal"
        // width={600}
      >
        <Form >
          <Form.Item
            {...formItemLayout}
            label="账号关联组织"
          >
            {getFieldDecorator(formKeyMap.orgIds, {
              rules: [{ required: true, message: '组织必须选择' }],
              initialValue: data.orgVOs?.map(l => ({ label: l.orgName, value: l.orgId })) || [],
            })(
              // <OrgTreeModal
              //   data={AccountOrgsInTree}
              //   onOk={(values) => {
              //   setFieldsValue({
              //     orgIds: values.map(v => v.orgId),
              //     orgNameSelected: values.map(v => v.orgName).join(', '),
              //   });
              // }}
              // />
              <TreeSelect
                showSearch
                treeCheckable
                treeCheckStrictly
                treeNodeFilterProp="title"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择关联组织"
                allowClear
                treeDefaultExpandAll
              >
                {Common.loop(organizeTree)}
              </TreeSelect>
            )}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="登录账号名"
          >
            {getFieldDecorator(formKeyMap.loginName, {
              rules: [
                {
                  required: true, min: 2, max: 16, message: '登录账号必须是2～16个字母或数字组合',
                },
              ],
              initialValue: data[formKeyMap.loginName],
            })(<Input placeholder="必填，2～18个字母或数字组合" />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="登录密码"
          >
            {getFieldDecorator(formKeyMap.password, {
              rules: [
                {
                  required: !isEdit, min: 2, max: 16, message: '密码必须是2～18个字母或数字组合',
                },
              ],
              initialValue: data[formKeyMap.password],
            })(<Input placeholder={`${isEdit ? '' : '必填，'}2～18个字母或数字组合`} />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="使用人姓名"
          >
            {getFieldDecorator(formKeyMap.usedName, {
              rules: [
                {
                  required: true, message: '使用人姓名必填',
                },
              ],
              initialValue: data[formKeyMap.usedName],
            })(<Input placeholder="必填" />)}
          </Form.Item>
          <Form.Item
            {...formItemLayout}
            label="使用人手机"
          >
            {getFieldDecorator(formKeyMap.usedPhone, {
              rules: [
                {
                  required: true, message: '使用人手机必填',
                },
              ],
              initialValue: data[formKeyMap.usedPhone],
            })(<Input placeholder="必填" />)}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}
