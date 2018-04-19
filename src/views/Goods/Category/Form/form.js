import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, InputNumber, message, Radio, Checkbox, Row, Col } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { MonitorInput, MonitorTextArea } from 'components/input';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import DetailFooterToolbar from 'components/DetailFooterToolbar';

const FormItem = Form.Item;

@connect(({ goodsCategory, loading }) => ({
  goodsCategory,
  submitting: loading.effects['goodsCategory/add'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    pattern: 'detail',
    fileList: [],
  };

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    this.setState({
      pattern: !Number(id) ? 'add' : 'edit',
    });
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (Number(id) !== 0) {
      dispatch({
        type: 'goodsBrand/detail',
        payload: { id, brandId: id },
      });
    }
  }

  handleImageChange = (fileList) => {
    this.setState({
      fileList,
    });
  }

  handleSubmit = () => {
    const { form, dispatch, goodsBrand, match: { params: { id } } } = this.props;
    const { validateFieldsAndScroll } = form;
    const data = goodsBrand?.[`detail${id}`];

    validateFieldsAndScroll((error, values) => {
      console.log('values:', values);
      // 对参数进行处理
      if (!error) {
        dispatch({
          type: 'goodsBrand/add',
          payload: {
            brand: {
              brandId: data?.brandId,
              ...values,
              supplierList: data?.supplierList,
              brandDocList: [],
              logo: values.logo?.[0],
            },
          },
        }).then(() => {
          const { add } = this.props.goodsBrand;
          if (add.msgCode === 200 && add.data) {
            message.success('提交成功。', 1, () => {
              history.back();
            });
          } else {
            message.error(`提交失败！${add.message}`);
          }
        });
      }
    });
  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }

  render() {
    const { form, submitting, goodsBrand, match: { params: { id } } } = this.props;
    const { pattern, fileList } = this.state;
    const disabled = pattern === 'detail';
    const data = goodsBrand?.[`detail${id}`];

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

    const options = [
      { label: '是', value: 1 },
      { label: '否', value: 0 },
    ];
    return (
      <PageHeaderLayout>
        <Card title="基本信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="上级分类">
              <div>abc / ddd /ccc</div>
            </FormItem>
            <FormItem {...formItemLayout} label="分类名称">
              {form.getFieldDecorator('categoryName', {
                rules: [{
                  required: true, message: '分类名称不能为空',
                }],
                initialValue: data?.categoryName,
              })(
                <MonitorInput maxLength={50} disabled={disabled} simple="true" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="别名">
              {form.getFieldDecorator('categoryAliasName', {
                rules: [],
                initialValue: data?.categoryAliasName,
              })(
                <MonitorInput maxLength={50} disabled={disabled} simple="true" />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="排序">
              {form.getFieldDecorator('orderNum', {
                rules: [{
                  required: true, message: '排序不能为空',
                }],
                initialValue: data?.orderNum || 100,
              })(
                <InputNumber min={0} max={9999} precision={0} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="到货天数">
              {form.getFieldDecorator('arrivalTime', {
                rules: [{
                  required: true, message: '到货天数不能为空',
                }],
                initialValue: data?.arrivalTime || 0,
              })(
                <InputNumber min={0} max={9999} precision={0} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="是否允许使用家居券及预存款">
              {form.getFieldDecorator('isAllowUseDiscount', {
                rules: [],
                initialValue: data?.isAllowUseDiscount || 0,
              })(
                <Radio.Group options={options} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="是否支持全国配送">
              {form.getFieldDecorator('isArrivalAll', {
                rules: [],
                initialValue: data?.isArrivalAll || 0,
              })(
                <Radio.Group options={options} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="分类图片">
              {form.getFieldDecorator('categoryUrl', {
                rules: [],
                initialValue: [data?.categoryUrl],
              })(
                <ImageUpload
                  exclude={['gif']}
                  maxSize={5120}
                  maxLength={1}
                  fileList={fileList}
                  listType="picture-card"
                  disabled={disabled}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {form.getFieldDecorator('brandDesc', {
                rules: [],
                initialValue: data?.brandDesc || '',
              })(
                <MonitorTextArea datakey="description" rows={5} maxLength={200} form={form} disabled={disabled} />
              )}
            </FormItem>

          </Form>
        </Card>
        <Card title="关联属性组" style={{ marginTop: '15px' }} bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="基本属性组">
              {form.getFieldDecorator('basePropertyGroupId', {
                rules: [{
                  required: true, message: '请选择基本属性组',
                }],
                initialValue: data?.name,
              })(
                <a>请选择</a>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="规格属性组">
              {form.getFieldDecorator('propertyGroupId', {
                rules: [{
                  required: true, message: '请选择规格属性组',
                }],
                initialValue: data?.name,
              })(
                <a>请选择</a>
              )}
            </FormItem>
          </Form>
        </Card>
        <Card title="" style={{ marginTop: '15px' }} bordered>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            <div>
              <Row>
                <Col span={8} offset={10}>
                  {form.getFieldDecorator('status', {
                    initialValue: false,
                  })(
                    <Checkbox>保存后立即启用</Checkbox>
                  )}
                </Col>
              </Row>
            </div>
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
