import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Form, TreeSelect, Input } from 'antd';
import SelectRegion from 'components/SelectRegion/business';
import { MonitorTextArea } from 'components/input';
import { organizeTypeOptions } from 'utils/attr/baseSetting';
import Common from './../common/common';

@Form.create()
@connect(({ baseSetting }) => ({
  baseSetting,
}))
class OrganizeModal extends PureComponent {
  state = {
    organizeTree: [],
  };

  componentWillUpdate = () => {
    const { organizeTree } = this.props;
    this.setState({
      organizeTree,
    });
  };

  render() {
    const { organizeTree } = this.state;
    const { visible, modalType, selectedNode, onCancel, onOk, form, confirmLoading } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 14 },
      },
    };
    const region = selectedNode?.regionPath?.split('_');
    const regionPath = [];
    if (region) {
      region.map((v) => {
        regionPath.push(parseInt(v, 10));
        return v;
      });
    }
    return (
      <Modal
        visible={visible}
        title={modalType === 'edit' ? '编辑组织' : '新增组织'}
        okText="确定"
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item label={`${modalType === 'add' ? '新增' : ''}组织类型`} {...formItemLayout}>
            {form.getFieldDecorator('orgType', {
              initialValue: modalType === 'edit' ? selectedNode.orgType : '',
              rules: [
                { required: true, message: '请选择组织类型' },
              ],
            })(
              Common.getSearchOptionsElm(organizeTypeOptions, false, '请选择组织类型', modalType === 'edit')
            )}
          </Form.Item>
          <Form.Item label="上级组织" {...formItemLayout}>
            {form.getFieldDecorator('parentId', {
              initialValue: modalType === 'edit' ? selectedNode.parentKey : '',
              rules: [
                { required: true, message: '请选择上级组织' },
              ],
            })(
              <TreeSelect
                showSearch
                treeNodeFilterProp="title"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择上级组织"
                allowClear
                treeDefaultExpandAll
              >
                {Common.loop(organizeTree)}
              </TreeSelect>
            )}
          </Form.Item>
          <Form.Item label={`${modalType === 'add' ? '新建' : ''}组织名称`} {...formItemLayout}>
            {form.getFieldDecorator('orgName', {
              initialValue: modalType === 'edit' ? selectedNode.orgName : '',
              rules: [
                { required: true, message: '请输入组织名称，最多20个字' },
                {
                  max: 20,
                  message: '不允许录入超过20个字',
                },
              ],
            })(
              <Input />
            )}
          </Form.Item>
          {
            form.getFieldValue('orgType') === 1 ? (
              <div>
                <Form.Item label="四级地址" {...formItemLayout}>
                  {form.getFieldDecorator('region', {
                    initialValue: modalType === 'edit' ? regionPath : [],
                    rules: [
                      { required: true, message: '请选择省/市/区/街道' },
                      {
                        validator(rule, value, callback) {
                          if (value.value && value.value.length === 4) {
                            callback();
                          } else {
                            callback('四级地址请选择到街道！');
                          }
                        },
                      },
                    ],
                  })(
                    <SelectRegion depth={4} placeholder="请选择省/市/区/街道" />
                  )}
                </Form.Item>
                <Form.Item label="详细地址" {...formItemLayout}>
                  {form.getFieldDecorator('address', {
                    initialValue: modalType === 'edit' ? selectedNode.address : '',
                    rules: [
                      { required: true, message: '请输入详细地址信息，如道路等' },
                      {
                        max: 50,
                        message: '不允许录入超过50个字',
                      },
                    ],
                  })(
                    <MonitorTextArea placeholder="请输入详细地址信息，如道路等" datakey="address" rows={4} maxLength={50} form={form} />
                  )}
                </Form.Item>
                <Form.Item label="经度" {...formItemLayout}>
                  {form.getFieldDecorator('lng', {
                    initialValue: modalType === 'edit' ? selectedNode.lng : '',
                    rules: [
                      { required: true, message: '请输入所在经度' },
                      {
                        max: 25,
                        transform: (value) => {
                          return value.toString();
                        },
                        message: '不允许录入超过25个字符',
                      },
                      {
                        validator(rule, value, callback) {
                          const val = parseFloat(value);
                          if (val > 0 && val < 180) {
                            callback();
                          } else {
                            callback('格式不正确，请重新输入');
                          }
                        },
                      },
                    ],
                  })(
                    <Input type="text" />
                  )}
                </Form.Item>
                <Form.Item label="纬度" {...formItemLayout}>
                  {form.getFieldDecorator('lat', {
                    initialValue: modalType === 'edit' ? selectedNode.lat : '',
                    rules: [
                      { required: true, message: '请输入所在纬度' },
                      {
                        max: 25,
                        transform: (value) => {
                          return value.toString();
                        },
                        message: '不允许录入超过25个字符',
                      },
                      {
                        validator(rule, value, callback) {
                          const val = parseFloat(value);
                          if (val > 0 && val < 90) {
                            callback();
                          } else {
                            callback('格式不正确，请重新输入');
                          }
                        },
                      },
                    ],
                  })(
                    <Input type="text" />
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

export default OrganizeModal;
