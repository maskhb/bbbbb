import DetailFooterToolbar from 'components/DetailFooterToolbar';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, message } from 'antd';
import { MonitorInput } from 'components/input';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
// import { MonitorInput, MonitorTextArea, rules } from 'components/input';
import styles from './Detail.less';


@connect(({ business, businessAccount, loading }) => ({
  business,
  businessAccount,
  loading: loading.models.businessAccount,
}))

@Form.create()
export default class AccountDetail extends Component {
  static defaultProps = {
  };

  state = {

  };

  componentWillMount() {
    console.log(this.props) //eslint-disable-line
    const { dispatch, match: { path, params: { accountId } } } = this.props;
    const pattern = path.split('/')[path.split('/').length - 2].toLowerCase();
    this.setState({ pattern });
    console.log({accountId}) //eslint-disable-line
    if (pattern === 'editaccount') {
      dispatch({
        type: 'businessAccount/queryDetail',
        payload: { merchantAccountId: accountId },
      }).then(() => {
        const { queryDetailRes } = this.props.businessAccount;
        this.setState({ queryDetailRes });
      });
    }
  }


  onChange=() => {
  }

  handleSubmit = () => {
    const { dispatch, form, match: { params: { merchantId } } } = this.props;
    const { queryDetailRes, pattern } = this.state;

    form.validateFields((errors, values) => {
      if (errors) {
        return; console.log('Errors in form!!!');//eslint-disable-line
      }
      if (pattern === 'addaccount') {
        dispatch({
          type: 'businessAccount/saveAccount',
          payload: { merchantAccountVo: { ...values, merchantId } },
        }).then(() => {
          const { saveRes } = this.props.businessAccount;
          if (saveRes) {
            message.success('提交成功。', 1, () => {
              history.back();
            });
          }
        });
      } else if (pattern === 'editaccount') {
        dispatch({
          type: 'businessAccount/updateAccount',
          payload: { merchantAccountVo: { ...queryDetailRes, ...values } },
        }).then(() => {
          const { updateRes } = this.props.businessAccount;
          console.log(updateRes) //eslint-disable-line
          if (updateRes) {
            message.success('提交成功。', 1, () => {
              history.back();
            });
          }
        });
      }
    });
  }


  handleCategoryChange = () => {

  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'editaccount' ? 'addaccount' : 'editaccount',
    });
  }

  render() {
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
    const { form, submitting } = this.props;
    const { queryDetailRes: data, pattern } = this.state;
    return (
      <PageHeaderLayout >
        <Card bordered={false} >
          <Form
            onSubmit={this.handleSubmit}
            className={styles.form}
          >
            <Form.Item
              label="账号名："
              {...formItemLayout}
            >
              {form.getFieldDecorator('accountName', {
              rules: [{
                required: true, message: '请输入账号名',
              }],
              initialValue: data?.accountName,
            })(
              <MonitorInput maxLength={30} disabled={pattern === 'editaccount'} simple="true" />
            )}
            </Form.Item>
            <Form.Item
              label="姓名："
              {...formItemLayout}
            >
              {form.getFieldDecorator('accountFullName', {
              rules: [{
                required: true, message: '请输入姓名',
              }],
              initialValue: data?.accountFullName,
            })(
              <MonitorInput maxLength={30} simple="true" />
            )}
            </Form.Item>
            <Form.Item
              label="手机号："
              {...formItemLayout}
            >
              {form.getFieldDecorator('accountPhoneNumber', {
              rules: [{
                required: true, len: 11, pattern: /^[0-9]{11}$/, message: '请输入正确的手机号',
              }],
              initialValue: data?.accountPhoneNumber,
            })(
              <MonitorInput maxLength={11} simple="true" />
            )}
            </Form.Item>
          </Form>
        </Card>

        <DetailFooterToolbar
          form={form}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          pattern={pattern}
          handlePatternChange={this.handlePatternChange}
        />
      </PageHeaderLayout>
    );
  }
}
