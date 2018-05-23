import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, InputNumber, message, Radio, Checkbox, Row, Col } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { MonitorInput, MonitorTextArea } from 'components/input';
import ImageUpload from 'components/Upload/Image/ImageUpload';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import AssociatedButton from './AssociatedButton';

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
    parents: '',
  };

  componentWillMount() {
    // const { match: { params: { id } } } = this.props;
    const { dispatch, match: { params: { id, pid } } } = this.props;
    if (Number(id)) {
      dispatch({
        type: 'goodsCategory/detail',
        payload: { categoryId: Number(id) },
      }).then(() => {
        const { parentId } = this.props.goodsCategory?.[`detail${id}`] || {};
        this.getParents(parentId).then((parents) => {
          this.setState({ parents: parents.join(' / ') });
        });
      });
    }
    this.setState({
      pattern: !Number(id) ? 'add' : 'edit',
    });

    if (Number(pid)) {
      this.getParents(pid).then((parents) => {
        this.setState({ parents: parents.join(' / ') });
      });
    }
  }

  componentDidMount() {

  }

  getParents(parentId, resultArr = []) {
    const { dispatch } = this.props;
    const that = this;
    // if (!parentId) {
    //   return [];
    // }
    // const parent = goodsCategory?.[`detail${parentId}`];

    return new Promise(((resolve) => {
      if (!parentId) {
        resolve([]);
        return;
      }
      dispatch({
        type: 'goodsCategory/detail',
        payload: { categoryId: Number(parentId) },
      }).then(() => {
        const result = this.props.goodsCategory?.[`detail${parentId}`];
        // console.log('result', result);
        if (result) {
          if (result.parentId) {
            that.getParents(
              result.parentId,
              [result.categoryName, ...resultArr]
            ).then((parents) => {
              resolve(parents);
            });
          } else {
            resolve([result.categoryName, ...resultArr]);
          }
        } else {
          resolve([]);
        }
      });
    }));

    // if (parent) {
    //   return [...this.getParents(parent.parentId), parent.categoryName];
    // } else {
    //   return dispatch({
    //     type: 'goodsCategory/detail',
    //     payload: { categoryId: Number(parentId) },
    //   }).then(() => {
    //     return that.getParents(parentId);
    //   });
    // }
  }

  handleImageChange = (fileList) => {
    this.setState({
      fileList,
    });
  }

  handleSubmit = () => {
    const { form, dispatch, match: { params: { id, pid } } } = this.props;
    const { validateFieldsAndScroll } = form;

    validateFieldsAndScroll((error, values) => {
      // console.log('values:', values);
      // 对参数进行处理
      const newValues = { ...values };

      newValues.status = newValues.status ? 1 : 3;
      newValues.parentId = pid || 0;
      newValues.categoryId = id || 0;
      const type = newValues.categoryId ? 'edit' : 'add';
      if (type === 'edit') {
        delete newValues.parentId;
        delete newValues.status;
      }
      if (!error) {
        dispatch({
          type: `goodsCategory/${type}`,
          payload: {
            ...newValues,
          },
        }).then(() => {
          const result = this.props.goodsCategory[type];
          if (result && !result.error) {
            message.success('保存成功！');
            history.back();
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
    const { form, submitting, goodsCategory, match: { params: { id, pid } } } = this.props;
    const { pattern, fileList } = this.state;
    const disabled = pattern === 'detail';
    const data = goodsCategory?.[`detail${id}`] || {};

    // if (data) {
    //   data.parents = this.getParents(data.parentId);
    // }
    // if (pid) {
    //   data.parents = this.getParents(pid);
    // }

    // console.log(goodsCategory);
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
      { label: '否', value: 2 },
    ];
    return (
      <PageHeaderLayout>
        <Card title="基本信息" bordered={false}>
          <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
            {(Number(pid) || data?.parentId) ? (
              <FormItem {...formItemLayout} label="上级分类">
                <div>{this.state.parents}</div>
              </FormItem>
            ) : ''}
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
            <FormItem {...formItemLayout} label="预计到货天数">
              {form.getFieldDecorator('arrivalTime', {
                rules: [{
                  required: true, message: '预计到货天数不能为空',
                }],
                initialValue: data?.arrivalTime || 0,
              })(
                <InputNumber min={0} max={9999} precision={0} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="是否允许使用家居券及预存款">
              {form.getFieldDecorator('isAllowUseDiscount', {
                rules: [],
                initialValue: data?.isAllowUseDiscount || 2,
              })(
                <Radio.Group options={options} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="是否支持全国配送">
              {form.getFieldDecorator('isArrivalAll', {
                rules: [],
                initialValue: data?.isArrivalAll || 2,
              })(
                <Radio.Group options={options} disabled={disabled} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="分类图片">
              {form.getFieldDecorator('categoryUrl', {
                rules: [],
                initialValue: data?.categoryUrl,
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
              {form.getFieldDecorator('categoryDesc', {
                rules: [],
                initialValue: data?.categoryDesc || '',
              })(
                <MonitorTextArea datakey="categoryDesc" rows={5} maxLength={200} form={form} disabled={disabled} />
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
                initialValue: data?.basePropertyGroupId,
              })(
                <AssociatedButton type="1" groupName={data?.basePropertyGroupName} match={this.props.match} />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="规格属性组">
              {form.getFieldDecorator('propertyGroupId', {
                rules: [{
                  required: true, message: '请选择规格属性组',
                }],
                initialValue: data?.propertyGroupId,
              })(
                <AssociatedButton type="2" groupName={data?.propertyGroupName} match={this.props.match} />
              )}
            </FormItem>
          </Form>
        </Card>
        {pattern === 'add' ? (
          <Card title="" style={{ marginTop: '15px' }} bordered>
            <Form onSubmit={this.handleSubmit} style={{ marginTop: 8 }}>
              <div>
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
            </Form>
          </Card>
        ) : ''}
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
