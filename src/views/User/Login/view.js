import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, message, Spin, Form, Button, Input, Icon } from 'antd';
import styles from './view.less';
// import permission from '../../../services/permission';
const FormItem = Form.Item;

@Form.create()

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'] || loading.effects['permission/current'],
}))
export default class LoginPage extends Component {
  state = {
    logined: false,
    // remember: true, //  记住账号
    // inputType: 'text',
  };

  // componentDidMount() {
  //   const { form } = this.props;
  //   const rememberAccount = localStorage.account;
  //   if (rememberAccount) {
  //     form.setFieldsValue({
  //       username: rememberAccount,
  //       password: '',
  //     });
  //   } else {
  //     form.setFieldsValue({
  //       username: '',
  //       password: '',
  //     });
  //   }
  // }
  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    // const { remember } = this.state;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'login/login',
          payload: {
            ...values,
          },
        }).then((res) => {
          if (res) {
            this.setState({
              logined: true,
            });
            // if (remember) {
            //   localStorage.account = values.username;
            // } else if (localStorage.account) {
            //   localStorage.removeItem('account');
            // }
            message.success('登录成功!');
            // return this.props.dispatch({
            //   type: 'permission/current',
            // }).then(() => {
            //   window.location.reload();
            // });
            const data = res?.data?.result;
            if (data) {
              dispatch({
                type: 'login/getAccountAuthsByOrgId',
                payload: { accountId: data.accountId, orgId: data.orgIdSelected },
              }).then((result) => {
                if (result && result.length > 0) {
                  localStorage.permission = JSON.stringify(result.map(v => v.authCode));
                  localStorage.permissionName = JSON.stringify(result);
                }
                setTimeout(() => {
                  window.location.reload();
                }, 0);
              });
            }
          }
        });
      }
    });
  };

  // changeInputType() {
  //   const { form } = this.props;
  //   const { inputType } = this.state;
  //   if (inputType === 'text') {
  //     this.setState({
  //       inputType: 'password',
  //     });
  //     form.setFieldsValue({
  //       password: '',
  //     });
  //   }
  // }

  // handleRememberAccount() {
  //   this.setState({
  //     remember: !this.state.remember,
  //   });
  // }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  };

  render() {
    const { form, submitting } = this.props;
    // const { remember, inputType } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <Spin spinning={!!submitting || this.state.logined}>
          <div
            style={{
              fontSize: '15px',
              padding: '30px 0 20px 0',
            }}
          >
            <span>欢迎您，请登录：</span>
          </div>
          <Form
            autoComplete="off"
            onSubmit={this.handleSubmit}
            className="login-form"
          >
            <FormItem>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: '请输入登录账号!' }],
              })(
                <Input
                  className={styles.input}
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入登录账号"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入登录密码!' }],
              })(
                <Input
                  className={styles.input}
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  // type={inputType}
                  type="password"
                  placeholder="请输入登录密码"
                  // autoComplete="new-password"
                  // onFocus={this.changeInputType.bind(this)}
                />
              )}
            </FormItem>
            {/* <Checkbox */}
            {/* onChange={this.handleRememberAccount.bind(this)} */}
            {/* checked={remember} */}
            {/* >记住账号 */}
            {/* </Checkbox> */}
            <Button type="primary" htmlType="submit" className={styles.loginButton}>
              登录
            </Button>
          </Form>
        </Spin>
      </div>
    );
  }
}
