import React, { PureComponent } from 'react';
import { Form, Card, Spin, message, Button } from 'antd';
import { connect } from 'dva';
import { MonitorTextArea } from 'components/input';
import Coupon from '../../../PromotionList/components/Coupon';

const FormItem = Form.Item;
@connect(({ marketing, loading }) => ({
  marketing,
  loading: loading.models.marketing,
  submit: loading.models['marketing/couponSaveList'],
}))

@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    couponArr: [],
    number: {
      value: '',
    },
    defaultSelectedRows: [],
  };

  couponChange = (row, couponRows) => {
    // console.log(row, rowObjs);
    // console.log('couponChange', row, couponRows, this.couponRef);
    // if (this.couponRef) {
    //   this.couponRef.state = {
    //     ...this.couponRef.state,
    //     defaultSelectedRows: couponRows,
    //     selectedRowKeys: couponRows.map(c => c.couponId),
    //   };
    //   console.log(this.couponRef.state);
    // }
    this.setState({
      couponArr: row,
      defaultSelectedRows: couponRows,
    });
  }

  checkPhone = (num) => {
    // const reg = /^1[3578][0-9]{9}(,1[3578][0-9]{9})*$/;
    const reg = /^1[0-9][0-9]{9}(,1[0-9][0-9]{9})*$/;

    if (num && num.length > 11999) {
      return {
        validateStatus: 'error',
        errorMsg: '每次派发用户不允许超过1000',
      };
    } else if (!reg.test(num)) {
      return {
        validateStatus: 'error',
        errorMsg: '请输入正确格式手机号码',
      };
    }
    return {
      validateStatus: 'success',
      errorMsg: null,
    };
  }

  handleCheckPhone = (e) => {
    const num = e.target.value;
    this.setState({
      number: {
        ...this.checkPhone(num),
        value: num,
      },
    });
  }
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, values) => {
      const params = {
        ...values,
      };
      const coupons = [];
      this.state.couponArr.forEach((v) => { coupons.push(v.value); });
      [params.couponId] = coupons;

      if (!error) {
        dispatch({
          type: 'marketing/couponSaveList',
          payload: params,
        }).then(() => {
          const result = this.props?.marketing?.couponSaveList;
          if (result !== null) {
            message.success('派发成功!');
            form.resetFields();
            this.setState({
              couponArr: [],
            });
          } else {
            message.error('派发失败!');
          }
        });
      }
    });
  }
  render() {
    const { form, submit, loading } = this.props;
    const { couponArr, number, defaultSelectedRows } = this.state;
    const { handleSubmit, couponChange, handleCheckPhone } = this;
    const rowData = [];
    couponArr.forEach((v) => {
      rowData.push(v.label);
    });
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
      <Card title="" bordered={false}>
        <Spin spinning={!!loading}>
          <Form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="关联优惠券:">
              {rowData.length > 0 ? <div>{rowData.join(',')}</div> : ''}
              {form.getFieldDecorator('couponId', {
                rules: [{
                  required: true, message: '请选择优惠券',
                }],
              })(
                <Coupon
                  batchOperate
                  defaultSelectedRows={defaultSelectedRows}
                  ref={(ref) => { this.couponRef = ref; }}
                  onChange={(row, rowObjs) => { couponChange(row, rowObjs); }}
                />
              )}
            </FormItem>
            <FormItem validateStatus={number.validateStatus} help={number.errorMsg} {...formItemLayout} label="用户手机号码:" >
              {form.getFieldDecorator('phones', {
                rules: [{
                  required: true, message: '请输入用户手机号码',
                }],
              })(
                <MonitorTextArea
                  datakey="phones"
                  style={{ marginTop: 10 }}
                  autosize={{ minRows: 10, maxRows: 20 }}
                  // maxLength={59}
                  onChange={handleCheckPhone}
                  form={form}
                />
              )}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 16, offset: 8 },
              }}
            >
              <Button type="primary" onClick={handleSubmit} loading={!!submit} >提交</Button>
            </FormItem>
          </Form>
        </Spin>
      </Card>
    );
  }
}
