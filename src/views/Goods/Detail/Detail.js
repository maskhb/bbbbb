import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Form, Col, Row, Radio, Cascader, Select, Input, message, Switch, Icon } from 'antd';
import draftToHtml from 'draftjs-to-html';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { d3Col0, d3Col1 } from 'components/Const';
import { MonitorInput, rules } from 'components/input';
import Editor from 'components/Editor';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import { GoodsType } from 'components/Enum/GoodsType';
import InputSelectGroup from './InputSelectGroup';
import SkuCard from './SkuCard';
import ImageCard from './ImageCard';
import fieldLabels from './fieldLabels';
import styles from './Detail.less';

@connect(({ goods, goodsCategory, goodsBrand, marketingCategory, business, loading }) => ({
  goods,
  goodsCategory,
  goodsBrand,
  marketingCategory,
  business,
  submitting: loading.effects['goods/add'],
  fetchingBusinessList: loading.effects['business/list'],
}))
@Form.create()
export default class Detail extends Component {
  state = {
    pattern: 'detail',
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
        type: 'goods/detail',
        payload: { id },
      });
    }

    dispatch({
      type: 'goodsCategory/list',
      payload: {},
    });

    dispatch({
      type: 'marketingCategory/list',
      payload: {},
    });

    dispatch({
      type: 'goods/unit',
      payload: {},
    });
  }

  handleSubmit = () => {
    const { form, dispatch } = this.props;
    const { validateFieldsAndScroll } = form;

    import('draft-js').then((raw) => {
      const { convertToRaw } = raw;

      const description = draftToHtml(
        convertToRaw(this.editor.state.editorState.getCurrentContent())
      );

      validateFieldsAndScroll((error, values) => {
        // 对参数进行处理
        if (!error) {
          dispatch({
            type: 'goods/add',
            payload: {
              description,
              ...values,
            },
          }).then(() => {
            const { result, msg } = this.props.goods;
            if (result === 1) {
              message.error(`提交失败！${msg}`);
            } else if (result === 0) {
              message.success('提交成功。', 1, () => {
                history.back();
              });
            }
          });
        }
      });
    });
  }

  handleCategoryChange = (value) => {
    const { dispatch } = this.props;

    if (value.length) {
      dispatch({
        type: 'goodsBrand/list',
        payload: {},
      });
    }
  }

  handlePatternChange = () => {
    const { pattern } = this.state;
    this.setState({
      pattern: pattern === 'detail' ? 'edit' : 'detail',
    });
  }

  render() {
    const { form, submitting, goods, goodsCategory, goodsBrand } = this.props;
    const { pattern } = this.state;

    const disabled = pattern === 'detail';
    const options = [
      { label: '阳台', value: 0 },
      { label: '客厅', value: 1 },
      { label: '厨房', value: 2 },
      { label: '阳台', value: 3 },
      { label: '客厅', value: 4 },
      { label: '厨房', value: 5 },
      { label: '阳台', value: 6 },
      { label: '客厅', value: 7 },
      { label: '厨房', value: 8 },
    ];

    return (
      <PageHeaderLayout>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="所属厂家">
                  {form.getFieldDecorator('factoryId', {
                    rules: [{
                      required: true, message: '请填写所属厂家',
                    }],
                  })(
                    <Cascader disabled={disabled} options={[]} placeholder="" />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="所属商家">
                  {form.getFieldDecorator('merchantId', {
                    rules: [{
                      required: true, message: '请填写所属商家',
                    }],
                  })(
                    <Cascader disabled={disabled} options={[]} placeholder="" />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品分类">
                  {form.getFieldDecorator('goodsCategoryId', {
                    rules: [{
                      required: true, message: '请输入商品分类',
                    }],
                  })(
                    <Cascader
                      options={goodsCategory?.list?.list}
                      placeholder=""
                      onChange={this.handleCategoryChange}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="商品品牌">
                  {form.getFieldDecorator('brandId', {
                    rules: [{
                      required: true, message: '请填写商品品牌',
                    }],
                  })(
                    <Select
                      placeholder={!goodsBrand?.list?.list?.length ? '请先选择商品分类' : ''}
                      disabled={!goodsBrand?.list?.list?.length || disabled}
                    >
                      {goodsBrand?.list?.list.map(brand => (
                        <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品类型">
                  {form.getFieldDecorator('goodsType', {
                    rules: [{ required: true, message: '请填写商品类型' }],
                  })(
                    <Select disabled={disabled}>
                      {Object.entries(GoodsType).map(([k, v]) =>
                        <Select.Option value={Number(k)} key={k}>{v}</Select.Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商品标题">
                  {form.getFieldDecorator('name', {
                    rules: rules([{
                      required: true, message: '请输入商品标题',
                    }, {
                      max: 60,
                    }]),
                    initialValue: goods?.detail?.goodsName,
                  })(
                    <MonitorInput maxLength={60} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="商品卖点">
                  {form.getFieldDecorator('sellingPoint', {
                    rules: rules([{
                      max: 50,
                    }]),
                  })(
                    <MonitorInput maxLength={50} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="商家商品编码">
                  {form.getFieldDecorator('goodsCode', {
                    rules: rules([{
                      max: 50,
                    }]),
                  })(
                    <MonitorInput maxLength={50} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="营销分类">
                  {form.getFieldDecorator('marketingCategoryId', {
                    rules: [],
                  })(
                    <Cascader
                      options={[]}
                      placeholder=""
                      onChange={this.handleCategoryChange}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="售后服务时间">
                  {form.getFieldDecorator('afterSaleServiceTime', {
                    rules: [],
                    initialValue: {
                      number: 3,
                      unit: 'month',
                    },
                  })(
                    <InputSelectGroup disabled={disabled}>
                      <Select.Option value="year">年</Select.Option>
                      <Select.Option value="month">月</Select.Option>
                      <Select.Option value="day">日</Select.Option>
                    </InputSelectGroup>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card title="基本属性" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col>
                <Form.Item label="适用位置">
                  {form.getFieldDecorator('position', {
                    rules: [{
                      required: true, message: '请选择适用位置',
                    }],
                  })(
                    <Radio.Group options={options} disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="可送货/安装">
                  {form.getFieldDecorator('delivery', {
                    valuePropName: 'checked',
                    rules: [{
                      required: true, message: '请选择是否可送货/安装',
                    }],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="是否带储物空间">
                  {form.getFieldDecorator('storage', {
                    rules: [],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="是否可订制">
                  {form.getFieldDecorator('custom', {
                    rules: [],
                  })(
                    <Switch
                      checkedChildren={<Icon type="check" />}
                      unCheckedChildren={<Icon type="cross" />}
                      disabled={disabled}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...d3Col0}>
                <Form.Item label="材质">
                  {form.getFieldDecorator('material', {
                    rules: [],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="面料">
                  {form.getFieldDecorator('fabric', {
                    rules: [],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
              <Col {...d3Col1}>
                <Form.Item label="产地">
                  {form.getFieldDecorator('productionPlace', {
                    rules: [],
                  })(
                    <Input disabled={disabled} />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <SkuCard form={form} disabled={disabled} />

        {
          form.getFieldDecorator('imgCard', {
          })(
            <ImageCard disabled={disabled} />
          )
        }

        <Card title="介绍" className={styles.card} bordered={false}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Editor ref={(inst) => { this.editor = inst; }} maxLength={2} disabled={disabled} />
            </Row>
          </Form>
        </Card>

        <DetailFooterToolbar
          form={form}
          fieldLabels={fieldLabels}
          submitting={submitting}
          handleSubmit={this.handleSubmit}
          pattern={pattern}
          handlePatternChange={this.handlePatternChange}
        />
      </PageHeaderLayout>
    );
  }
}
