/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:23:37
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-09 10:12:13
 *
 * 生成售后单 商品操作
 */

import React, { PureComponent } from 'react';

import { Card, Row, Col, Select, Form, Button, Table, InputNumber } from 'antd';

import ModalSelectGoods from 'components/ModalSelectGoods/business';

import { fenToYuan } from 'utils/money';

const SelectOption = Select.Option;
const { Item: FormItem } = Form;

class BusinessGoodsCard extends PureComponent {
  static defaultProps = {};

  state = {
    orderGoodsList: [],
  }

  getColumns = () => {
    const { form } = this.props;

    const columns = [
      {
        title: '商品ID',
        width: '100px',
        dataIndex: 'goodsId',
        key: 'goodsId',
      },
      {
        title: '商品信息',
        dataIndex: 'goodsName',
        key: 'goodsName',
        render: (text, record) => (
          <Row type="flex">
            <Col>
              <img className="select_goods_img" src={record.imgUrl} alt="" />
            </Col>
            <Col>
              <div className="select_goods_name">
                <span>{record.goodsName}</span>
              </div>
              <div className="select_goods_oper">
                <span>{record.propertyValue}</span>
              </div>
            </Col>
          </Row>
        ),
      },
      {
        title: '数量',
        width: '100px',
        dataIndex: 'goodsNum',
        key: 'goodsNum',
        render: (text, record) => {
          return (
            <div className="select_goods_inputnum">
              <FormItem>
                {
                  form.getFieldDecorator(`goodsNum[${record.skuId}]`, {
                    initialValue: text,
                    rules: [
                      { type: 'integer', required: true, message: '请输入数量' },
                      { validator: (rule, value, callback) => {
                        this.validatorGoodsNum(rule, value, callback, record);
                      } },
                    ],
                  })(
                    <InputNumber
                      precision={0}
                      onChange={(value) => {
                        this.handleGoodsNumChange(record, value || 0);
                      }}
                    />
                  )
                }
              </FormItem>
            </div>
          );
        },
      },
      {
        title: '销售价',
        width: '120px',
        dataIndex: 'salePrice',
        key: 'salePrice',
        render: (text) => {
          return fenToYuan(text, false);
        },
      },
      {
        title: '操作',
        width: '120px',
        dataIndex: 'goodsAmountFormat',
        render: (text, record) => {
          return (
            <a onClick={() => {
              this.handleDeleteSelectGoods(record);
            }}
            >删除
            </a>
          );
        },
      },
    ];

    return columns;
  }

  getInitMerchantInitValue = () => {
    let value = 0;

    const { orders } = this.props;
    const { detail } = orders || {};
    const { orderGoodsVOList } = detail || {};

    (orderGoodsVOList || []).forEach((item) => {
      if (item?.merchantId > value) {
        value = item?.merchantId;
      }
    });

    return value;
  }

  getMerchantOption = () => {
    const { orders } = this.props;
    const { detail } = orders || {};
    const { orderGoodsVOList } = detail || {};

    const merchantMap = {};
    const merchantList = [];

    (orderGoodsVOList || []).forEach((item) => {
      if (!merchantMap[`merchant_${item?.merchantId}`]) {
        merchantList.push({
          label: item?.merchantName,
          value: item?.merchantId,
        });

        merchantMap[`merchant_${item?.merchantId}`] = true;
      }
    });

    return merchantList;
  }

  validatorGoodsNum = (rule, value, callback, record) => {
    if (value < 1) {
      callback('请输入正确的数量');
    } else if (value > record.remainNum) {
      callback('数量不能大于库存');
    }
    callback();
  }

  handleDeleteSelectGoods = (record) => {
    const { form } = this.props;
    const { orderGoodsList = [] } = this.state;
    const newOrderGoodsList = orderGoodsList.filter(item => item.skuId !== record.skuId);
    this.setState({
      orderGoodsList: [
        ...newOrderGoodsList,
      ],
    });

    form.setFieldsValue({
      orderGoodsList: [
        ...newOrderGoodsList,
      ],
    });
  }

  handleCustomSelectGoodsOk = (selectGoods) => {
    const { form } = this.props;
    // const { orderGoodsList = [] } = this.state;

    /*
    orderGoodsList.push(...(selectGoods || []).filter((item) => {
      return !orderGoodsList.some(sItem => sItem.skuId === item.skuId);
    }));

    this.setState({
      orderGoodsList: [...orderGoodsList],
    });

    form.setFieldsValue({
      orderGoodsList,
    });
    */

    this.setState({
      orderGoodsList: [...selectGoods],
    });

    form.setFieldsValue({
      orderGoodsList: [...selectGoods],
    });
  }

  handleGoodsNumChange = (record, value) => {
    const { form } = this.props;
    const { orderGoodsList = [] } = this.state;
    orderGoodsList.forEach((item) => {
      const newItem = item;
      if (newItem.skuId === record.skuId) {
        newItem.goodsNum = value || 0;
      }
    });

    this.setState({
      orderGoodsList,
    });

    form.setFieldsValue({
      orderGoodsList,
    });
  }

  render() {
    const { form, className, colLeftSpan = 3 } = this.props;
    const { orderGoodsList } = this.state;

    form.getFieldDecorator('orderGoodsList', { initialValue: [] });

    const merchantId = form.getFieldValue('merchantId');

    return (
      <Card title="商家商品" className={`${className || ''} views_order_aftersale_select_goods`}>
        <Row>
          <Col span={colLeftSpan}>
            <span>选择商家：</span>
          </Col>

          <Col span={24 - colLeftSpan}>
            <FormItem>
              {
              form.getFieldDecorator('merchantId', {
                rules: [
                  { required: true, message: '请选择商家' },
                ],
                initialValue: this.getInitMerchantInitValue(),
              })(
                <Select>
                  {
                    this.getMerchantOption().map(item => (
                      <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>
                    ))
                  }
                </Select>
              )
            }
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={colLeftSpan}>
            <ModalSelectGoods
              {...this.props}
              isOne
              params={{ merchantId }}
              onSelectOk={this.handleCustomSelectGoodsOk}
              btnDom={(
                <Button type="primary" icon="plus-circle-o" ghost>选择商品</Button>
              )}
            />
          </Col>
          <Col span={24 - colLeftSpan}>
            <Table
              dataSource={orderGoodsList}
              columns={this.getColumns()}
              pagination={false}
              rowKey="skuId"
            />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default BusinessGoodsCard;
