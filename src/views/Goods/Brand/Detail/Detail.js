import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Cascader, InputNumber, message, Spin } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { MonitorInput, MonitorTextArea } from 'components/input';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import DetailFooterToolbar from 'components/DetailFooterToolbar';

const FormItem = Form.Item;

@connect(({ goodsBrand, loading }) => ({
  goodsBrand,
  loading: loading.effects['goodsBrand/detail'],
  submitting: loading.effects['goodsBrand/add'] || loading.effects['goodsBrand/edit'],
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
      pattern: Number(id) === 0 ? 'add' : 'detail',
    });
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } } } = this.props;
    if (Number(id) !== 0) {
      dispatch({
        type: 'goodsBrand/detail',
        payload: { brandId: Number(id) },
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
    const { goodsBrand, loading, submitting, form, match: { params: { id } } } = this.props;
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

    return (
      <PageHeaderLayout>
        <Card loading={!data && loading}>
          <Spin spinning={!!(data && loading)}>
            {
              pattern !== 'edit' || (pattern === 'edit' && data)
                ? (
                  <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                    <FormItem {...formItemLayout} label="名称">
                      {form.getFieldDecorator('brandName', {
                        rules: [{
                          required: true, message: '请输入名称',
                        }],
                        initialValue: data?.brandName,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.brandName}</span>
                          : <MonitorInput maxLength={100} disabled={disabled} simple="true" />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="分类">
                      {form.getFieldDecorator('brandCategoryId', {
                        initialValue: data?.brandCategoryId,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.brandCategoryId}</span>
                          : <Cascader placeholder="" disabled={disabled} />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="网址">
                      {form.getFieldDecorator('brandHomeUrl', {
                        rules: [],
                        initialValue: data?.brandHomeUrl,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.brandHomeUrl}</span>
                          : <MonitorInput maxLength={200} disabled={disabled} simple="true" />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="排序">
                      {form.getFieldDecorator('orderNum', {
                        rules: [{
                          required: true, message: '请输入排序',
                        }],
                        initialValue: data?.orderNum,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.orderNum}</span>
                          : <InputNumber min={0} max={9999} precision={0} disabled={disabled} />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Logo">
                      {form.getFieldDecorator('brandUrl', {
                        initialValue: [data?.brandUrl],
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
                        initialValue: data?.brandDesc,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.brandDesc}</span>
                          : <MonitorTextArea datakey="description" rows={5} maxLength={200} form={form} disabled={disabled} />
                      )}
                    </FormItem>
                    <DetailFooterToolbar
                      form={form}
                      fieldLabels={{
                        name: '名称',
                        category: '分类',
                        orderNum: '排序',
                        url: '网址',
                        logo: 'logo',
                        brandDesc: '描述',
                      }}
                      submitting={submitting}
                      handleSubmit={this.handleSubmit}
                      pattern={pattern}
                      handlePatternChange={this.handlePatternChange}
                    />
                  </Form>
                )
                : ''
            }
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
