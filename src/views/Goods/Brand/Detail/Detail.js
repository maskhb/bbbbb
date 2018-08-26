import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Cascader, InputNumber, message, Spin, Row, Col, Checkbox } from 'antd';
import _ from 'lodash';
import { OPERPORT_JIAJU_BRANDLIST_EDIT } from 'config/permission';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { goTo } from 'utils/utils';
import flat2nested from 'components/Flat2nested';
import { MonitorInput, MonitorTextArea } from 'components/input';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import { getStatus } from 'components/EnableStatus';

const FormItem = Form.Item;

@connect(({ goodsBrand, brandCategory, loading }) => ({
  goodsBrand,
  brandCategory,
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
    initalFieldsValue: {},
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

    dispatch({
      type: 'brandCategory/list',
      payload: {},
    });
  }

  handlePatternChange = () => {
    const { form } = this.props;
    const { pattern, initalFieldsValue } = this.state;

    // 缓存详情数据
    if (!initalFieldsValue || _.isEmpty(initalFieldsValue)) {
      this.setState({
        initalFieldsValue: form.getFieldsValue(),
      });
    }

    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });

    // 重置数据
    if (pattern === 'edit') {
      form.setFieldsValue(initalFieldsValue);
    }
  }

  handleImageChange = (fileList) => {
    this.setState({
      fileList,
    });
  }

  handleSubmit = () => {
    const { form, dispatch, goodsBrand, match: { params: { id } } } = this.props;
    const { pattern } = this.state;
    const { validateFieldsAndScroll } = form;
    const data = goodsBrand?.[`detail${id}`];

    validateFieldsAndScroll((error, values) => {
      // 对参数进行处理
      const status = values.status ? 1 : 3;
      if (!error) {
        dispatch({
          type: pattern === 'add' ? 'goodsBrand/add' : 'goodsBrand/edit',
          payload: {
            brandId: data?.brandId,
            ...values,
            supplierList: data?.supplierList,
            brandUrl: values.brandUrl?.constructor.name === 'Array' ? null : values.brandUrl,
            brandCategoryId: values.brandCategoryId?.[values.brandCategoryId.length - 1],
            status: pattern === 'add' ? status : data?.status,
          },
        }).then((res) => {
          if (res) {
            message.success('提交成功。', 0.4, () => {
              goTo('/goods/brand');
            });
          }
        });
      }
    });
  }

  render() {
    const { goodsBrand, brandCategory, loading,
      submitting, form, match: { params: { id } } } = this.props;
    const { pattern, fileList } = this.state;
    const disabled = pattern === 'detail';
    const data = goodsBrand?.[`detail${id}`];
    const detail = goodsBrand?.[`detail${id}`];

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

    // 品牌分类
    const goodsBrandCascaderOptions = flat2nested(brandCategory?.list || [], { id: 'categoryId', parentId: 'parentId' });

    const goodsBrandIds = detail?.brandCategoryIdAll?.split('/').map(v => Number(v));

    return (
      <PageHeaderLayout>
        <Card loading={!data && loading}>
          <Spin spinning={!!(data && loading)}>
            {
              pattern !== 'edit' || (pattern === 'edit' && data)
                ? (
                  <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
                    <FormItem {...formItemLayout} label="品牌名称">
                      {form.getFieldDecorator('brandName', {
                        rules: [{
                          required: true, message: '请输入名称',
                        }],
                        initialValue: data?.brandName,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.brandName}</span>
                          : <MonitorInput maxLength={100} disabled={disabled} simple="true" whitespace />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="品牌分类">
                      {form.getFieldDecorator('brandCategoryId', {
                        initialValue: goodsBrandIds || null,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.brandCategoryNameAll}</span>
                          : (
                            <Cascader
                              options={goodsBrandCascaderOptions}
                              placeholder=""
                              changeOnSelect
                              disabled={disabled}
                            />
                          )
                      )}
                    </FormItem>
                    {
                      pattern !== 'add' ? (
                        <FormItem {...formItemLayout} label="状态">
                          <span>{getStatus(data?.status)}</span>
                        </FormItem>
                      ) : null
                    }
                    <FormItem {...formItemLayout} label="网址">
                      {form.getFieldDecorator('brandHomeUrl', {
                        rules: [{
                          type: 'url', message: 'url格式不正确',
                        }],
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
                        initialValue: data?.orderNum || 0,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.orderNum}</span>
                          : <InputNumber min={0} max={9999} precision={0} disabled={disabled} />
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="品牌Logo">
                      {form.getFieldDecorator('brandUrl', {
                        initialValue: data?.brandUrl ? [data?.brandUrl] : [],
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
                    <FormItem {...formItemLayout} label="品牌描述">
                      {form.getFieldDecorator('brandDesc', {
                        rules: [],
                        initialValue: data?.brandDesc,
                      })(
                        pattern === 'detail'
                          ? <span>{data?.brandDesc}</span>
                          : <MonitorTextArea datakey="brandDesc" rows={5} maxLength={200} form={form} disabled={disabled} />
                      )}
                    </FormItem>
                    {pattern === 'add' ? (
                      <div style={{ marginTop: '15px' }}>
                        <Row>
                          <Col span={8} offset={10}>
                            {form.getFieldDecorator('status', {
                              initialValue: data?.status,
                            })(
                              <Checkbox>保存后立即启用</Checkbox>
                            )}
                          </Col>
                        </Row>
                      </div>
                    ) : ''}
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
                      permission={[OPERPORT_JIAJU_BRANDLIST_EDIT]}
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
