/*
 * @Author: wuhao
 * @Date: 2018-09-21 10:14:19
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-10-11 09:13:00
 *
 * 房源管理 - 房型管理 - 新增房型
 */
import React, { PureComponent } from 'react';

import {
  Form,
  Modal,
  message,
  Input,
  InputNumber,
  Button,
} from 'antd';

const { Item: FormItem } = Form;

@Form.create()
class ModalAdd extends PureComponent {
  static defaultProps = {};

  state = {
    loading: false,
    showModal: false,
    formItemLayout: {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        xl: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        xl: { span: 18 },
      },
    },
  }

  refreshPropTable = () => {
    const { refreshTable } = this.props;

    if (refreshTable) {
      refreshTable();
    }
  }

  reqOk = async (values) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'roomType/saveRoomType',
      payload: values,
    });
    if (res) {
      message.success('新增成功！');
      this.clearModalFun();
      this.refreshPropTable();
      return true;
    }

    return false;
  }

  clearModalFun = () => {
    this.setState({
      loading: false,
      showModal: false,
    });
  }

  handleShowModalClick = () => {
    this.setState({
      loading: false,
      showModal: true,
    });
  }

  handleHideModalClick = () => {
    this.clearModalFun();
  }

  handleSubmit = () => {
    const { form } = this.props;
    const { validateFields } = form || {};
    validateFields?.((err, values) => {
      if (err) {
        return;
      }
      this.reqOk(values);
    });
  }

  render() {
    const { loading, showModal, formItemLayout } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form || {};

    return [
      <Button type="gray" icon="plus" onClick={this.handleShowModalClick} key="shape_manage_modal_add_btn" style={{ marginTop: -10, marginBottom: -10, marginRight: -14 }}>新增房型</Button>,
      <Modal
        key="shape_manage_modal_add_view"
        title="新增房型"
        width="600px"
        visible={showModal}
        destroyOnClose
        confirmLoading={loading}
        onCancel={this.handleHideModalClick}
        onOk={this.handleSubmit}
      >
        <div>
          <Form>
            <FormItem {...formItemLayout} label="房型名称">
              {
                getFieldDecorator('roomTypeName', {
                  rules: [
                    { required: true, max: 10, message: '必填，最多10个字' },
                  ],
                })(
                  <Input placeholder="最多10个字" />
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label="优先级">
              {
                getFieldDecorator('sort', {
                  rules: [
                    { type: 'number', required: true, min: 0, max: 100, message: '必填,0-100之间的整数' },
                  ],
                })(
                  <InputNumber placeholder="0~100之间的整数，数字越小优先级越高" precision={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Form>
        </div>
      </Modal>,
    ];
  }
}

export default ModalAdd;
