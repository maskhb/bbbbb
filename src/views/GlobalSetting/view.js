import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, InputNumber, Card, Message, Modal } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { MonitorTextArea } from '../../components/input';
// import ImageUpload from '../../../../components/Upload/Image/ImageUpload';
import DetailFooterToolbar from '../../components/DetailFooterToolbar';
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
    this.handleSearch();
  }
  handleSearch() {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/globalSettingDetail',
      payload: { },
    }).then(() => {
      const { globalSettingDetail } = this.props.global;
      this.props.form.setFieldsValue({
        maxSku: globalSettingDetail?.maxSku?.value,
        minPrePayAccount: globalSettingDetail?.minPrePayAccount?.value,
        orderCancelTime: globalSettingDetail?.orderCancelTime?.value,
        projectItemTitle: globalSettingDetail?.projectItemTitle?.value,
        shoppingCartTitle: globalSettingDetail?.shoppingCartTitle?.value,
        casherTitle: globalSettingDetail?.casherTitle?.value,
        productDetailTitle: globalSettingDetail?.productDetailTitle?.value,
        automaticSign: globalSettingDetail.automaticSign?.value,
      });
    });
  }
  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const that = this;
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((error, values) => {
      // 对参数进行处理
      if (!error) {
        Modal.confirm({
          title: '确认更改？',
          content: '保存后将立即生效，其中关于订单的规则，只对新产生的订单有效。',
          okText: '确认',
          cancelText: '取消',
          onOk() {
            dispatch({
              type: 'global/globalSettingAdd',
              payload: { globalSettingList: values },
            }).then(() => {
              const { globalSettingAdd } = that.props.global;
              if (globalSettingAdd && typeof globalSettingAdd === 'number') {
                Message.success('提交成功。', 1, () => {
                  that.setState({
                    pattern: 'detail',
                  });
                  that.handleSearch();
                });
              } else {
                Message.error('提交失败！');
              }
            });
          },
        });
      }
    });
  };
  handlePatternChange = () => {
    const { pattern } = this.state;
    if (pattern === 'edit') {
      this.handleSearch();
    }
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  };
  render() {
    const that = this;
    const { form, submitting } = that.props;
    const { pattern } = that.state;
    const disabled = pattern === 'detail';

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
    const { globalSettingDetail: detail } = this.props.global;

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} extra={detail?.maxSku?.desc} label="每个SKU最大可购买数量">
              {form.getFieldDecorator('maxSku', {
                rules: [{
                  required: true, message: '请输入每个SKU最大可购买数量',
                }, {
                  pattern: /^[1-9]\d*$/, message: '请输入一个正整数',
                }],
              })(
                <Input style={{ width: '100%' }} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} extra={detail?.minPrePayAccount?.desc} label="用户每次支付最低金额">
              {form.getFieldDecorator('minPrePayAccount', {
                rules: [{
                  required: true, message: '请输入用户每次支付最低金额',
                }, {
                  validator: (rule, value, callback) => {
                    const errors = [];
                    if (Number(value) <= 0 || (value.split('.')[1] && value.split('.')[1].length > 2)) {
                      errors.push(new Error(
                        '请输入正确的金额格式，且金额必须大于0',
                        rule.field));
                    } else {
                      let result = true;
                      result = !isNaN(value);
                      if (value === '' || value == null) {
                        result = false;
                      }
                      if (!result) {
                        errors.push(new Error(
                          '请输入正确的金额格式，且金额必须大于0',
                          rule.field));
                      }
                    }
                    callback(errors);
                  },
                }],
              })(
                <Input
                  style={{ width: '100%' }}
                  disabled={disabled}
                  prefix="￥ "
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} extra={detail?.orderCancelTime?.desc} label="订单未支付自动取消时间">
              {form.getFieldDecorator('orderCancelTime', {
                rules: [{
                  required: true, message: '请输入订单未支付自动取消时间',
                }, {
                  validator: (rule, value, callback) => {
                    const errors = [];
                    if (Number(value) <= 0 || (value.split('.')[1] && value.split('.')[1].length > 1)) {
                      errors.push(new Error(
                        '请输入一个正数，最多保留一位小数',
                        rule.field));
                    } else {
                      let result = true;
                      result = !isNaN(value);
                      if (value === '' || value == null) {
                        result = false;
                      }
                      if (!result) {
                        errors.push(new Error(
                          '请输入一个正数，最多保留一位小数',
                          rule.field));
                      }
                    }
                    callback(errors);
                  },
                }],
              })(
                <Input style={{ width: '100%' }} suffix=" 小时" disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} extra={detail?.projectItemTitle?.desc} label="选择项目页页头文案">
              {form.getFieldDecorator('projectItemTitle', {
                rules: [{
                  required: true, message: '请输入选择项目页页头文案',
                }],
              })(
                <MonitorTextArea
                  disabled={disabled}
                  datakey="projectItemTitle"
                  rows={3}
                  maxLength={50}
                  form={form}
                  placeholder="必填，最多50个字"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} extra={detail?.shoppingCartTitle?.desc} label="购物车页头文案">
              {form.getFieldDecorator('shoppingCartTitle', {
                rules: [{
                  required: true, message: '请输入购物车页头文案',
                }],
              })(
                <MonitorTextArea
                  disabled={disabled}
                  datakey="shoppingCartTitle"
                  rows={3}
                  maxLength={50}
                  form={form}
                  placeholder="必填，最多50个字"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} extra={detail?.casherTitle?.desc} label="收银台页头文案">
              {form.getFieldDecorator('casherTitle', {
                rules: [{
                  required: true, message: '请输入收银台页头文案',
                }],
              })(
                <MonitorTextArea
                  disabled={disabled}
                  datakey="casherTitle"
                  rows={3}
                  maxLength={50}
                  form={form}
                  placeholder="必填，最多50个字"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} extra={detail?.productDetailTitle?.desc} label="商品详情页，商品介绍页头">
              {form.getFieldDecorator('productDetailTitle', {
                rules: [],
              })(
                <MonitorTextArea
                  disabled={disabled}
                  datakey="productDetailTitle"
                  rows={5}
                  maxLength={1000}
                  form={form}
                  placeholder="选填，最多1000个字"
                />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={detail?.automaticSign?.title}
              extra={detail?.automaticSign?.desc}
            >
              {form.getFieldDecorator('automaticSign', {
                rules: [{
                  required: true, message: '请输入自动确认签收天数',
                }],
              })(
                <InputNumber style={{ width: '100%' }} placeholder={detail?.automaticSign?.editDesc} suffix="天" disabled={disabled} />
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
