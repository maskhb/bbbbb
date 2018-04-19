import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { MonitorTextArea } from '../../../components/input';
// import ImageUpload from '../../../../components/Upload/Image/ImageUpload';
import DetailFooterToolbar from '../../../components/DetailFooterToolbar';
// import GoodsCategory from '../../../../components/GoodsCategory';

const FormItem = Form.Item;

@connect(({ global, loading }) => ({
  global,
  submitting: loading.effects['global/add'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    pattern: 'detail',
  };

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (Number(id) !== 0) {
      dispatch({
        type: 'global/detail',
        payload: { id, brandId: id },
      });
    }
  }
  handleSubmit = () => {
    // const { form, dispatch, goodsBrand, match: { params: { id } } } = this.props;
    const { form } = this.props;
    const { validateFieldsAndScroll } = form;
    // const data = goodsBrand?.[`detail${id}`];

    // validateFieldsAndScroll((error, values) => {
    validateFieldsAndScroll((error) => {
      // 对参数进行处理
      if (!error) {
        // dispatch({
        //   type: 'goodsBrand/add',
        //   payload: {
        //     brand: {
        //       brandId: data?.brandId,
        //       ...values,
        //       supplierList: data?.supplierList,
        //       brandDocList: [],
        //       logo: values.logo?.[0],
        //     },
        //   },
        // }).then(() => {
        //   const { add } = this.props.goodsBrand;
        //   if (add.msgCode === 200 && add.data) {
        //     message.success('提交成功。', 1, () => {
        //       history.back();
        //     });
        //   } else {
        //     message.error(`提交失败！${add.message}`);
        //   }
        // });
      }
    });
  };
  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  };
  render() {
    const that = this;
    const { form, submitting, global, match: { params: { id } } } = that.props;
    const { pattern } = that.state;
    // const disabled = pattern === 'detail';
    const data = global?.[`detail${id}`];

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
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="每个SKU最大可购买数量">
              {form.getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入每个SKU最大可购买数量',
                }, {
                  pattern: /^[1-9]\d*$/, message: '请输入一个正整数',
                }],
              })(
                <Input style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="用户每次支付最低金额">
              {form.getFieldDecorator('category', {
                rules: [{
                  required: true, message: '请输入用户每次支付最低金额',
                }, {
                  pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/, message: '请输入正确的金额格式',
                }],
                initialValue: data?.category,
              })(
                <Input
                  style={{ width: '100%' }}
                  prefix="$ "
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="订单未支付自动取消时间">
              {form.getFieldDecorator('url', {
                rules: [{
                  required: true, message: '请输入订单未支付自动取消时间',
                }, {
                  pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1})?$/, message: '请输入一个正数，最多保留一位小数',
                }],
                initialValue: data?.url,
              })(
                <Input style={{ width: '100%' }} suffix=" 小时" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择项目页页头文案">
              {form.getFieldDecorator('orderNum', {
                rules: [{
                  required: true, message: '请输入选择项目页页头文案',
                }],
                initialValue: data?.orderNum,
              })(
                <MonitorTextArea
                  datakey="orderNum"
                  rows={3}
                  maxLength={50}
                  form={form}
                  placeholder="必填，最多50个字"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="购物车页头文案">
              {form.getFieldDecorator('orderNum2', {
                rules: [{
                  required: true, message: '请输入购物车页头文案',
                }],
                initialValue: data?.orderNum2,
              })(
                <MonitorTextArea
                  datakey="orderNum2"
                  rows={3}
                  maxLength={50}
                  form={form}
                  placeholder="必填，最多50个字"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="收银台页头文案">
              {form.getFieldDecorator('orderNum3', {
                rules: [{
                  required: true, message: '请输入收银台页头文案',
                }],
                initialValue: data?.orderNum3,
              })(
                <MonitorTextArea
                  datakey="orderNum3"
                  rows={3}
                  maxLength={50}
                  form={form}
                  placeholder="必填，最多50个字"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="优先级">
              {form.getFieldDecorator('first', {
                rules: [],
                initialValue: data?.first,
              })(
                <MonitorTextArea
                  datakey="first"
                  rows={5}
                  maxLength={1000}
                  form={form}
                  placeholder="选填，最多1000个字"
                />
              )}
            </FormItem>
            <DetailFooterToolbar
              form={form}
              // fieldLabels={{}}
              submitting={submitting}
              handleSubmit={this.handleSubmit}
              pattern={pattern}
              handlePatternChange={this.handlePatternChange}
            />
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
