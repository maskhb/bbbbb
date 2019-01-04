import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, TreeSelect, Input } from 'antd';
// import { roleListOptions } from 'utils/attr/baseSetting';
import Common from './../common/common';


@Form.create()
@connect(({ baseSetting }) => ({
  baseSetting,
}))
class DepartmentModal extends PureComponent {
  state = {
    roleListOptions: [],
  };

  componentWillMount = () => {
    this.getRolelist();
  };

  getRolelist = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseSetting/searchRoleList',
      payload: {},
    }).then((suc) => {
      if (suc && suc.dataList) {
        const roleListOptions = [];
        suc.dataList.map((v) => {
          roleListOptions.push({ value: v.roleId, label: v.roleName });
          return v;
        });
        this.setState({
          roleListOptions,
        });
      }
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
    const nextKeys = keys.concat(keys[keys.length - 1] + 1);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };


  render() {
    const { roleListOptions } = this.state;
    const {
      visible, modalType, selectedNode, onCancel, onOk, form, confirmLoading, organizeTree,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    const orgsRelated = [];
    const rolesRelated = [];
    if (selectedNode.orgsRelated && modalType === 'edit') {
      selectedNode.orgsRelated.map((v) => {
        orgsRelated.push({ label: v.orgName, value: v.orgId });
        return v;
      });
    }
    if (selectedNode.rolesRelated && modalType === 'edit') {
      selectedNode.rolesRelated.map((v) => {
        rolesRelated.push(v.roleId);
        return v;
      });
    }

    console.log({orgsRelated});

    return (
      <Modal
        visible={visible}
        title={modalType === 'edit' ? '编辑角色组' : '新增角色组'}
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item
            {...formItemLayout}
            label={`${modalType === 'add' ? '新增' : ''}角色组名称`}
          >
            {form.getFieldDecorator('roleGroupName', {
              initialValue: modalType === 'edit' ? selectedNode.roleGroupName : '',
              rules: [{
                required: true,
                message: '输入角色组名称，最多20个字',
              }, {
                max: 20,
                message: '不允许录入超过20个字',
              }],
            })(
              <Input placeholder="输入角色组名称，最多20个字" />
            )}
          </Form.Item>
          <Form.Item label="选择关联组织" {...formItemLayout}>
            {form.getFieldDecorator('orgsRelated', {
              initialValue: modalType === 'edit' ? orgsRelated : [],
              rules: [
                { required: true, message: '请选择关联组织' },
              ],
            })(
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
                {Common.specialLoop(organizeTree, orgsRelated)}
              </TreeSelect>
            )}
          </Form.Item>
          <Form.Item label="选择关联角色" {...formItemLayout}>
            {form.getFieldDecorator('rolesRelated', {
              initialValue: modalType === 'edit' ? rolesRelated : [],
              rules: [
                { required: true, message: '请选择关联角色' },
              ],
            })(
              Common.getSearchOptionsElm(roleListOptions, true, '请选择关联角色')
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default DepartmentModal;
