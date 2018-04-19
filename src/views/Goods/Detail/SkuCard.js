import React, { Component } from 'react';
import { Card, Form, Row, Col, message, Button, Icon, Table, InputNumber, Input, Radio } from 'antd';
import _ from 'lodash';
import emitter from '../../../utils/events';
import { d3Col0, d3Col1 } from '../../../components/Const';
import styles from './Detail.less';

let uuid = 0;

export default class SkuCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 0,
      size: 0,
      list: [],
      colorData: [
        { label: '红色', value: 0 },
        { label: '黄色', value: 1 },
        { label: '蓝色', value: 2 },
        { label: '绿色', value: 3 },
        { label: '青色', value: 4 },
        { label: '紫色', value: 5 },
      ],
      sizeData: [
        { label: '1800mm*1900m', value: 0 },
        { label: '1700mm*1900m', value: 1 },
        { label: '1600mm*1900m', value: 2 },
      ],
    };
  }

  handleAddSku = () => {
    const { color, size, list, colorData, sizeData } = this.state;

    if (color === null) {
      message.error('请选择颜色！');
      return;
    }
    if (size === null) {
      message.error('请选择尺寸！');
      return;
    }

    const newList = [...list];
    newList.unshift({
      id: uuid,
      key: uuid += 1,
      color,
      size,
      store: 0,
      code: '',
      barCode: '',
      supplyPrice: 0,
      marketPrice: 0,
      price: 0,
      discountPrice: 0,
    });
    this.setState({
      list: newList,
    }, () => {
      const { form } = this.props;
      form.setFieldsValue({
        skuList: newList,
      });
    });

    emitter.emit('goods.detail.imageCard', null, {
      skuId: uuid,
      skuText: [
        colorData.find(c => c.value === color).label,
        sizeData.find(c => c.value === size).label,
      ].join('；'),
      operate: 'add',
    });
  }

  skuColumns = () => {
    const { disabled } = this.props;
    const { colorData, sizeData } = this.state;
    const me = this;

    return [
      {
        title: '默认',
        dataIndex: 'id',
        render(val, record) {
          return (
            <Radio
              checked={record.isDefault}
              value={val}
              onChange={() => me.handleChangeRadio(record.key)}
            />
          );
        },
        width: 64,
      },
      {
        title: '颜色',
        dataIndex: 'color',
        render(val) {
          return colorData.find(c => c.value === val).label;
        },
      },
      {
        title: '尺寸',
        dataIndex: 'size',
        render(val) {
          return sizeData.find(c => c.value === val).label;
        },
      },
      {
        title: '可售库存',
        dataIndex: 'store',
        render(text, record) {
          return (
            <InputNumber
              value={text}
              min={0}
              step={1}
              disabled={disabled}
              width={120}
              onChange={value => me.handleChangeColumn(value, record.key, 'store')}
            />
          );
        },
        width: 120,
      },
      {
        title: '商家SKU编码',
        dataIndex: 'code',
        render(text, record) {
          return <Input value={text} onChange={e => me.handleChangeColumn(e.target.value, record.key, 'code')} />;
        },
        width: 120,
      },
      {
        title: '条形码',
        dataIndex: 'barCode',
        render(text, record) {
          return <Input value={text} onChange={e => me.handleChangeColumn(e.target.value, record.key, 'barCode')} />;
        },
        width: 120,
      },
      {
        title: '供货价',
        dataIndex: 'supplyPrice',
        render(text, record) {
          return (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              width={120}
              onChange={value => me.handleChangeColumn(value, record.key, 'supplyPrice')}
            />
          );
        },
        width: 120,
      },
      {
        title: '市场价',
        dataIndex: 'marketPrice',
        render(text, record) {
          return (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              width={120}
              onChange={value => me.handleChangeColumn(value, record.key, 'marketPrice')}
            />
          );
        },
        width: 120,
      },
      {
        title: '售价',
        dataIndex: 'price',
        render(text, record) {
          return (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              width={120}
              onChange={value => me.handleChangeColumn(value, record.key, 'price')}
            />
          );
        },
        width: 120,
      },
      {
        title: '折扣价',
        dataIndex: 'discountPrice',
        render(text, record) {
          return (
            <InputNumber
              value={text}
              min={0}
              precision={2}
              step={0.01}
              disabled={disabled}
              width={120}
              onChange={value => me.handleChangeColumn(value, record.key, 'discountPrice')}
            />
          );
        },
        width: 120,
      },
      {
        title: '操作',
        dataIndex: 'operate',
        render() {
          return <a>刪除</a>;
        },
      },
    ];
  }

  handleChangeColumn(value, key, column) {
    const newData = [...this.state.list];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ list: newData });
    }
  }

  handleChangeRadio(key) {
    const newData = [...this.state.list];
    for (const item of newData.values()) {
      item.isDefault = item.key === key;
    }
    this.setState({ list: newData });
  }

  handleChangeColor = (e) => {
    this.setState({
      color: e.target.value,
    });
  }

  handleChangeSize = (e) => {
    this.setState({
      size: e.target.value,
    });
  }

  handleCustomBlur = (value, dataKey, e) => {
    if (!e.target.value) {
      return;
    }

    this.setState({
      [dataKey]: this.state[dataKey].map((c) => {
        const color = c;
        if (color.value === value) {
          color.label = e.target.value;
        }
        return color;
      }),
      [`${dataKey}Lock`]: false,
    });
  }

  handleCustom = (data, dataKey) => {
    if (this.state[`${dataKey}Lock`]) {
      return;
    }

    const value = _.maxBy(data, o => o.value).value + 1;
    this.setState({
      [dataKey]: data.concat({
        label: <Input
          size="small"
          onBlur={this.handleCustomBlur.bind(this, value, dataKey)}
        />,
        value,
      }),
      [`${dataKey}Lock`]: true,
    });
  }

  render() {
    const { disabled, form } = this.props;
    const { list, colorData, sizeData } = this.state;

    return (
      <Card title="规格" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col {...d3Col0}>
              <Form.Item label={<span>颜色<Button disabled={disabled} type="dashed" size="small" style={{ float: 'right' }} onClick={this.handleCustom.bind(this, colorData, 'colorData')}><Icon type="plus" />自定义</Button></span>}>
                <Radio.Group
                  onChange={this.handleChangeColor}
                  options={colorData}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
            <Col {...d3Col1}>
              <Form.Item label={<span>尺寸<Button disabled={disabled} type="dashed" size="small" style={{ float: 'right' }} onClick={this.handleCustom.bind(this, sizeData, 'sizeData')}><Icon type="plus" />自定义</Button></span>}>
                <Radio.Group
                  onChange={this.handleChangeSize}
                  options={sizeData}
                  disabled={disabled}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Button disabled={disabled} type="dashed" onClick={this.handleAddSku}><Icon type="plus" />生成规格</Button>
          </Form.Item>
        </Form>

        {
          form.getFieldDecorator('skuList', {})(
            <Table
              bordered
              columns={this.skuColumns()}
              dataSource={list}
            />
          )
        }
      </Card>
    );
  }
}
