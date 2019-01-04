/*
 * @Author: wuhao
 * @Date: 2018-09-20 11:17:22
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-10-18 21:30:38
 *
 * 基础设置 - 收款方式设置 - 编辑弹框
 */
import React, { PureComponent } from 'react';

import {
  Form,
  Modal,
  message,
  Input,
  Radio,
  InputNumber,
  Spin,
} from 'antd';

import { stateAvailableOrUnavailable } from 'utils/attr/public';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

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
      type: 'paymentMethod/detailsByPaymentMethodOrgId',
      payload: {
        paymentMethodOrgId: record?.paymentMethodOrgId,
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
      type: 'paymentMethod/update',
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
    const { form, paymentMethod } = this.props;
    const { getFieldDecorator } = form || {};
    const detail = paymentMethod?.detailsByPaymentMethodOrgId || {};

    getFieldDecorator('paymentMethodOrgId', { initialValue: detail?.paymentMethodOrgId });

    return [
      <a onClick={this.handleShowModalClick} key="payment_method_modal_edit_btn">编辑</a>,
      <Modal
        key="payment_method_modal_edit_view"
        title="编辑收款方式"
        width="600px"
        visible={showModal}
        destroyOnClose
        confirmLoading={loading}
        onCancel={this.handleHideModalClick}
        onOk={this.handleSubmit}
      >
        <Spin spinning={loading}>
          <Form>
            <FormItem {...formItemLayout} label="收款方式">
              <span>{detail?.paymentMethodName}</span>
            </FormItem>
            <FormItem {...formItemLayout} label="优先级">
              {
                getFieldDecorator('sort', {
                  rules: [
                    { type: 'number', required: true, min: 0, max: 100, message: '必填,0-100之间的整数' },
                  ],
                  initialValue: detail?.sort,
                })(
                  <InputNumber placeholder="请输入优先级" precision={0} style={{ width: '100%' }} />
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label="自定义名称">
              {
                getFieldDecorator('paymentMethodOtherName', {
                  rules: [
                    { max: 10, message: '非必填，最多10个字' },
                  ],
                  initialValue: detail?.paymentMethodOtherName,
                })(
                  <Input placeholder="请输入自定义名称" />
                )
              }
            </FormItem>
            <FormItem {...formItemLayout} label="状态">
              {
                getFieldDecorator('status', {
                  rules: [
                    { required: true, message: '必选' },
                  ],
                  initialValue: detail?.status,
                })(
                  <RadioGroup>
                    {
                      stateAvailableOrUnavailable?.map(item => (
                        <Radio value={item?.value} key={`payment_method_modal_edit_radio_${item?.value}`}>{item?.label}</Radio>
                      ))
                    }
                  </RadioGroup>
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
