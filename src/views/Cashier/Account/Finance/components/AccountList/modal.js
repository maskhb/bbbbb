import Authorized from 'utils/Authorized';
import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, InputNumber } from 'antd';
import { MonitorInput, MonitorTextArea } from 'components/input';
import { fenToYuan } from 'utils/money';

@Form.create()
export default class EditModal extends Component {
  state = {
    editModalVisible: false,
  };

  editModalShow = () => {
    console.log(1234);

    this.setState({ editModalVisible: true });
  }
  editModalCancel = () => {
    this.setState({ editModalVisible: false });
  }
  editModalOk = () => {
    this.handleSubmit();
  }
  handleSubmit = () => {
    const { form, dispatch, sourseData, me } = this.props;
    form.validateFields((errors, values) => {
      if (errors) {
        return console.log('Errors in form!!!');//eslint-disable-line
      } else {
        let { amount } = values;
        amount *= 100;

        return dispatch({
          type: 'cashier/addReconciliation',
          payload: { ...sourseData, ...values, amount },
        }).then((res) => {
          if (res) {
            message.success('操作成功');
            this.editModalCancel();
            me.search.handleSearch();
          }
        });
      }
    });
  }


  render() {
    const { sourseData: data, form } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <div style={{ display: 'inline' }}>

        {this.state.editModalVisible ? (
          <Modal
            title="账务调账"
            visible={this.state.editModalVisible}
            onOk={this.editModalOk}
            onCancel={this.editModalCancel}
            width="45%"
          >
            <Form
              onSubmit={this.handleSubmit}
            >
              <Form.Item
                label="账务类型："
                {...formItemLayout}
              >
                {data.accountTypeName}
              </Form.Item>
              <Form.Item
                label=" 原始金额："
                {...formItemLayout}
              >
                {fenToYuan(data.amount)}
              </Form.Item>
              <Form.Item
                label="调整后金额："
                {...formItemLayout}
              >
                {form.getFieldDecorator('amount', {
                  rules: [{
                    required: true, message: '请输入调整后金额',
                  }],

                })(
                  <InputNumber
                    min={0}
                    max={99999999.99}
                    width={500}
                  />
                )}
              </Form.Item>
              <Form.Item
                label="备注："
                {...formItemLayout}
              >
                {form.getFieldDecorator('remark', {
                })(
                  <MonitorTextArea
                    datakey="remark"
                    rows={5}
                    maxLength={200}
                    form={form}
                    simple
                  />
                )}
              </Form.Item>
            </Form>
          </Modal>
        ) : ''}
        <Authorized authority="PMS_ACCOUNT_ACCOUNTRECEIVABLE_ACCOUNTADJUSTMENT">
          {this.props.me.props.noShow ? '' : <a onClick={this.editModalShow}>调账</a>}
        </Authorized>

      </div>

    );
  }
}
