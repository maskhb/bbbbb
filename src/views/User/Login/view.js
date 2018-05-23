import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, message, Spin } from 'antd';
import Login from '../../../components/Login';
import styles from './view.less';
// import permission from '../../../services/permission';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'] || loading.effects['permission/current'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    logined: false,
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  handleSubmit = (err, values) => {
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      }).then((res) => {
        if (res) {
          this.setState({
            logined: true,
          });
          message.success('登录成功!');
          return this.props.dispatch({
            type: 'permission/current',
          }).then(() => {
            window.location.reload();
          });
        }
      });
    }
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;

    return (
      <div className={styles.main}>
        <Spin spinning={!!submitting || this.state.logined}>
          <Login
            defaultActiveKey={type}
            onTabChange={this.onTabChange}
            onSubmit={this.handleSubmit}
          >
            <Tab key="account" tab="账户密码登录">
              {
                login.status === 'error' &&
                login.type === 'account' &&
                !login.submitting &&
                this.renderMessage('账户或密码错误')
              }
              <UserName name="username" placeholder="" />
              <Password name="password" placeholder="" />
            </Tab>
            <Submit loading={submitting}>登录</Submit>
          </Login>
        </Spin>
      </div>
    );
  }
}
