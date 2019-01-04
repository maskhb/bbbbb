import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, Button, InputNumber } from 'antd';
import { MonitorInput } from 'components/input';
import { connect } from 'dva';
import { div, mul } from 'utils/number';
import { orgId } from 'utils/getParams';

@Form.create()
@connect(({ user, channel, loading }) => ({ user, channel, loading: loading.models.channel }))
export default class EditModal extends Component {
  state = {
    editModalVisible: false,
  };

  editModalShow = () => { this.setState({ editModalVisible: true }); }
  editModalCancel = () => { this.setState({ editModalVisible: false }); }
  editModalOk = () => { this.handleSubmit(); }
  handleSubmit = () => {
    const { form, dispatch, sourseData, type = 'edit' } = this.props;

    form.validateFields((errors, values) => {
      if (errors) {
        return console.log('Errors in form!!!');//eslint-disable-line
      } else if (type === 'edit') {
        dispatch({
          type: 'channel/updateChannel',
          payload: { channelVO: { ...sourseData, ...values } },
        }).then((res) => {
          if (res) {
            message.success(`${type === 'edit' ? '编辑' : '新增'}成功`);
            this.editModalCancel();
            this.props.dispatch({
              type: 'channel/queryListByPage',
              payload: { ...{ currPage: 1, pageSize: 10 }, orgId: orgId() },
            });
          }
        });
      } else {
        dispatch({
          type: 'channel/addChannel',
          payload: { channelVO: { ...values } },
        }).then((res) => {
          if (res) {
            message.success(`${type === 'edit' ? '编辑' : '新增'}成功`);
            this.editModalCancel();
            this.props.dispatch({
              type: 'channel/queryListByPage',
              payload: { ...{ currPage: 1, pageSize: 10 }, orgId: orgId() },
            });
          }
        });
      }
    });
  }


  render() {
    const { sourseData: data = {}, form, type = 'edit' } = this.props;
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
            title={`${type === 'edit' ? '编辑' : '新增'}渠道`}
            visible={this.state.editModalVisible}
            onOk={this.editModalOk}
            onCancel={this.editModalCancel}
            width="35%"
          >
            <Form
              onSubmit={this.handleSubmit}
            >

              <Form.Item
                label="渠道名称："
                {...formItemLayout}
              >
                {form.getFieldDecorator('channelName', {
                  rules: [{
                    required: true, message: '请输入渠道名称',
                  }],
                  initialValue: data.channelName,
                })(
                  <MonitorInput maxLength={20} simple="true" />
                )}
              </Form.Item>

            </Form>
          </Modal>
        ) : ''}
        {
          type === 'edit' ?
            <a onClick={this.editModalShow}>编辑</a>
            : (
              <Button
                onClick={this.editModalShow}
              >
                + 新增渠道
              </Button>
            )}
      </div>

    );
  }
}
