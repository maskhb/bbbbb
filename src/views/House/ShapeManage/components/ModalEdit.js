/*
 * @Author: wuhao
 * @Date: 2018-09-21 10:22:36
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-26 10:41:13
 *
 * 房源管理 - 房型管理 - 编辑房型
 */
import React, { PureComponent } from 'react';

import {
  Form,
  Modal,
  message,
  Input,
  InputNumber,
  Spin,
} from 'antd';

const { Item: FormItem } = Form;

@Form.create()
class ModalEdit extends PureComponent {
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

  getDetails = async () => {
    const { dispatch, record } = this.props;
    await dispatch({
      type: 'roomType/details',
      payload: {
        roomTypeId: record?.roomTypeId,
      },
    });
    this.setState({
      loading: false,
    });
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
      type: 'roomType/update',
      payload: values,
    });
    if (res) {
      message.success('编辑成功！');
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
      loading: true,
      showModal: true,
    });

    this.getDetails();
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
    const { form, roomType } = this.props;
    const { getFieldDecorator } = form || {};
    const detail = roomType?.details || {};

    getFieldDecorator('roomTypeId', { initialValue: detail?.roomTypeId });

    return [
      <a onClick={this.handleShowModalClick} key="shape_manage_modal_edit_btn">编辑</a>,
      <Modal
        key="shape_manage_modal_edit_view"
        title="编辑房型"
        width="600px"
        visible={showModal}
        destroyOnClose
        confirmLoading={loading}
        onCancel={this.handleHideModalClick}
        onOk={this.handleSubmit}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem {...formItemLayout} label="房型名称">
              {
                getFieldDecorator('roomTypeName', {
                  rules: [
                    { required: true, max: 10, message: '必填，最多10个字' },
                  ],
                  initialValue: detail?.roomTypeName,
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
                  initialValue: detail?.sort,
                })(
                  <InputNumber placeholder="0~100之间的整数，数字越小优先级越高" precision={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Form>
        </Spin>
      </Modal>,
    ];
  }
}


export default ModalEdit;
