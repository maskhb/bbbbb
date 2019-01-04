import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, Button, InputNumber } from 'antd';
import { MonitorInput } from 'components/input';
import { connect } from 'dva';
import { div, mul } from 'utils/number';
import { orgId } from 'utils/getParams';
import TextBeyond from 'components/TextBeyond';
import { MonitorTextArea } from 'components/input';

@Form.create()
@connect(({ checkIn, loading }) => ({ checkIn, loading: loading.models.checkIn }))
export default class EditModal extends Component {
  state = {
    editModalVisible: false,
  };

  editModalShow = () => { this.setState({ editModalVisible: true }); }
  editModalCancel = () => { this.setState({ editModalVisible: false }); }
  editModalOk = () => { this.handleSubmit(); }
  handleSubmit = () => {
    const { form, dispatch, sourseData, callBack } = this.props;

    form.validateFields((errors, values) => {
      if (errors) {
        return console.log('Errors in form!!!');//eslint-disable-line
      } else {
        dispatch({
          type: 'checkIn/updateRemark',
          payload: { serviceOrderVO: { ...sourseData, ...values } },
        }).then((res) => {
          if (res) {
            message.success('编辑成功');
            this.editModalCancel();
            callBack();
          }
        });
      }
    });
  }


  render() {
    const { sourseData = {}, form } = this.props;
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
            title="编辑备注信息"
            visible={this.state.editModalVisible}
            onOk={this.editModalOk}
            onCancel={this.editModalCancel}
            width="35%"
          >
            <Form
              onSubmit={this.handleSubmit}
            >

              <Form.Item
                label="备注："
                {...formItemLayout}
              >
                {form.getFieldDecorator('remark', {
                  initialValue: sourseData?.remark,
                })(
                  <MonitorTextArea
                    rows={5}
                    form={this.props.form}
                    datakey="remark"
                    maxLength={50}
                  />
                )}
              </Form.Item>

            </Form>
          </Modal>
        ) : ''}

        <a onClick={this.editModalShow}>
          <TextBeyond
            content={sourseData?.remark || '添加备注'}
            maxLength={sourseData?.remark ? 15 : 0}
            width="300px"
            style={{ cursor: 'pointer' }}
          />
        </a>
      </div>

    );
  }
}
