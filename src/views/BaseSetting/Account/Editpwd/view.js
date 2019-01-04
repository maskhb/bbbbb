import React from 'react';
import { connect } from 'dva';
import { Card, Form, Modal, Input, Button, Row, Col } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

@Form.create()
@connect(({ accountInfo, user, loading }) => ({
  accountInfo, user, loading: loading.effects['accountInfo/updatePassword'],
}))
export default class View extends React.PureComponent {
  state = {
    confirmDirty: false,
  }
  handleConfirmBlur = (e) => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }

  handleUpdate = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, value) => {
      if (!err) {
        this.props.dispatch({
          type: 'accountInfo/updatePassword',
          payload: value,
        }).then((rs) => {
          if (rs) {
            // message.success('密码修改成功！');
            Modal.confirm({
              title: '密码修改成功',
              content: '请重新登录',
              onOk: () => {
                this.props.dispatch({
                  type: 'login/logout',
                  payload: {
                    path: '/',
                  },
                });
              },
            });
            // form.resetFields();
          }
        });
      }
    });
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassWord')) {
      callback('密码不一致！');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmPass'], { force: true });
    }
    callback();
  }

  render() {
    const { form: {
      getFieldDecorator,
      resetFields,
    },
    user: { current },
    loading,
    } = this.props;
    return (
      <PageHeaderLayout>
        <Card title="修改密码" >
          <Form >
            <Form.Item
              {...formItemLayout}
              label="登录账号"
            >
              {getFieldDecorator('loginName', {
              initialValue: current.loginName,
            })(<Input readOnly />)}
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="旧密码"
            >
              {getFieldDecorator('oldPassWord', {
                rules: [
                  { required: true, message: '必填' },
                  { min: 2, message: '最小不可少于2个字符' },
                  { max: 18, message: '最大不可大于18个字符' },
                ],
            })(<Input />)}
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="新密码"
            >
              {getFieldDecorator('newPassWord', {
                rules: [{
                  required: true,
                  message: '新密码必填',
                },
                  { min: 2, message: '最小不可少于2个字符' },
                  { max: 18, message: '最大不可大于18个字符' },
                {
                  validator: this.validateToNextPassword,
                }],
            })(<Input type="password" />)}
            </Form.Item>

            <Form.Item
              {...formItemLayout}
              label="确认新密码"
            >
              {getFieldDecorator('confirmPass', {
                rules: [{
                  required: true, message: '确认密码必填',
                },
                {
                  validator: this.compareToFirstPassword,
                }],
            })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
            </Form.Item>
            <Row>
              <Col offset={3}>
                <Button style={{ marginRight: 30 }} onClick={() => resetFields()}>取消保存</Button>
                <Button loading={!!loading} onClick={this.handleUpdate} type="primary">确认修改</Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
