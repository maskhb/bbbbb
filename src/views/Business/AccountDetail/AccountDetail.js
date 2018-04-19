import DetailFooterToolbar from 'components/DetailFooterToolbar';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card } from 'antd';
import { MonitorInput } from 'components/input';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
// import { MonitorInput, MonitorTextArea, rules } from 'components/input';
import styles from './Detail.less';

const FormItem = Form.Item;

@connect(({ AccountDetail, loading }) => ({
  AccountDetail,
  submitting: loading.effects['goodsBrand/add'],
}))

@Form.create()
export default class AccountDetail extends Component {
  static defaultProps = {
  };

  state = {
  };

  componentWillMount() {

  }

  componentDidMount() {
  }

  onChange=() => {
    return '';
  }

  handleSubmit = () => {
  }

  handleCategoryChange = () => {
  }
  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
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
    const { form, submitting, pattern } = this.props;
    const data = [];

    return (
      <PageHeaderLayout >
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            className={styles.form}
            refs="account"
          >
            <FormItem
              label="账号名："
              {...formItemLayout}
            >
              {form.getFieldDecorator('accountName', {
              rules: [{
                required: true, message: '请输入名称',
              }],
              initialValue: data?.accountName,
            })(
              <MonitorInput maxLength={30} disabled={false} simple="true" />
            )}
            </FormItem>
            <FormItem
              label="姓名："
              {...formItemLayout}
            >
              {form.getFieldDecorator('name', {
              rules: [{
                required: true, message: '请输入名称',
              }],
              initialValue: data?.name,
            })(
              <MonitorInput maxLength={30} disabled={false} simple="true" />
            )}
            </FormItem>
            <FormItem
              label="手机号："
              {...formItemLayout}
            >
              {form.getFieldDecorator('cellphone', {
              rules: [{
                required: true, message: '请输入手机号',
              }],
              initialValue: data?.cellphone,
            })(
              <MonitorInput maxLength={11} disabled={false} simple="true" />
            )}
            </FormItem>
          </Form>
        </Card>
        <DetailFooterToolbar
          form={form}
              // fieldLabels={{}}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          pattern={pattern}
          handlePatternChange={this.handlePatternChange}
        />
      </PageHeaderLayout>
    );
  }
}
