import ImageUpload from 'components/Upload/Image/ImageUpload';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, InputNumber, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import BusinessSourseBtn from '../../components/BusinessSourceBtn';

@Form.create()

@connect(({ cashier, loading }) => ({
  cashier,
  loading: loading.models.cashier,
}))
export default class View extends PureComponent {
  state = {
    pattern: 'add',
  };

  componentDidMount() {
    this.init();
  }
  init = async () => {
    console.log(this.props);

    const { match: { path }, cashier: { detail } } = this.props;
    const isAdd = path.split('/')[path.split('/').length - 2] === 'add';
    if (!isAdd && !detail) {
      return history.back();
    }

    this.setState({ pattern: isAdd ? 'add' : 'edit', isAdd });
  }

  handleSubmit = () => {
    // eslint-disable-next-linef
    const { dispatch, form, match: { params: { id } }, cashier: { detail } } = this.props;
    let { isAdd, sourceIdList } = this.state;

    form.validateFields((errors, values) => {
      if (errors) {
        return; console.log('Errors in form!!!');//eslint-disable-line
      }
      const rateCodeId = isAdd ? 0 : detail?.rateCodeId;

      if (typeof sourceIdList === 'undefined') {
        sourceIdList = detail?.sourceIdList?.split(',');
      }

      const params = { ...values, sourceIdList, rateCodeId };
      console.log({ values }, { sourceIdList }, params);


      delete params.sourceId;
      dispatch({
        type: 'cashier/saveOrUpdate',
        payload: params,
      }).then((res) => {
        if (res) message.success('提交成功。', 1, () => { history.back(); });
      });
    });
  }

  render() {
    const { isAdd } = this.state;
    /* eslint-disable-next-line */
    let { form, loading:submitting, cashier: { detail: data = {} } } = this.props;
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
    if (isAdd) { data = {}; }
    return (
      <PageHeaderLayout>
        <Card title={`${isAdd ? '新增' : '编辑'}价格代码`}>
          <Form
            onSubmit={this.handleSubmit}
          >
            <Form.Item
              label="价格代码名称："
              {...formItemLayout}
            >
              {form.getFieldDecorator('rateCodeName', {
                rules: [{
                  required: true, message: '请输入价格代码名称',
                }],
                initialValue: data.rateCodeName,
              })(
                <Input placeholder="最多10个字" />
              )}
            </Form.Item>
            <Form.Item
              label="优先级："
              {...formItemLayout}
            >
              {form.getFieldDecorator('sort', {
                rules: [{
                  required: true, message: '请输入优先级',
                }],
                initialValue: data.sort,
              })(
                <InputNumber
                  min={0}
                  max={100}
                  placeholder="0~100之间的整数，数字越小优先级越高"
                />
              )}
            </Form.Item>
            <Form.Item
              label="关联业务来源："
              {...formItemLayout}
            >
              {form.getFieldDecorator('sourceId', {
                initialValue: String(data.sourceIdList)?.split(','),
              })(
                <div>
                  <BusinessSourseBtn
                    okCallBack={(sourceIdList, all, checkNames) => {
                      this.setState({ sourceIdList, all, checkNames });
                    }}
                    // initData={String(data.sourceIdList || ','.split(','))}
                    initData={
                      this.state.sourceIdList ? this.state.sourceIdList :
                      data.sourceIdList && data.sourceIdList?.indexOf(',') ? data.sourceIdList?.split(',')?.map(v => Number(v)) : []
                    }
                  />
                  <p>{typeof this.state.checkNames !== 'undefined' ? this.state.checkNames : data.sourceName}</p>
                </div>
              )}
            </Form.Item>

            <Form.Item
              label="图片："
              {...formItemLayout}
            >
              {form.getFieldDecorator('url', {
                initialValue: data.url,
              })(
                <ImageUpload
                  exclude={['gif']}
                  maxSize={5120}
                  maxLength={1}
                  listType="picture-card"
                  fileList={data.url}
                />
              )}
            </Form.Item>


          </Form>
        </Card>
        <DetailFooterToolbar
          form={form}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
        />
      </PageHeaderLayout>
    );
  }
}
