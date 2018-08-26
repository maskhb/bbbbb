/*
 * @Author: wuhao
 * @Date: 2018-06-15 10:04:50
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-27 19:15:32
 *
 * 售后 商品信息组件  列表项
 */

import React from 'react';

import { Form, InputNumber } from 'antd';
import { Link } from 'dva/router';

import ModalSwapGoods from './components/ModalSwapGoods';

const { Item: FormItem } = Form;

const defaultGoodsPic = require('assets/goods_default.png');

/**
 * 订单商品表格
 */
export function getOrderGoodsTableColumn() {
  const { type = 0, isEdit = false, form } = this.props;
  const { getFieldDecorator } = form || {};
  const columns = [
    {
      title: '商品编号',
      width: '100px',
      dataIndex: 'goodsId',
      render(val, record) {
        return val || record.orderGoodsId;
      },
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (text, record) => {
        return (
          <div className="view_aftersale_components_detail_goodsInfo_goods_name">
            { record.goodsId && record.skuId > 0 ? (
              <Link to={`/goods/list/detail/${record.goodsId}`} target="_blank">
                <img
                  style={{
              width: '50px',
              height: '50px',
            }}
                  src={record.mainImgUrl || record.goodsUrl || defaultGoodsPic}
                  alt=""
                />
                <span>{text}</span>
              </Link>
            )
            : [
              <img
                style={{
                width: '50px',
                height: '50px',
              }}
                src={record.mainImgUrl || record.goodsUrl || defaultGoodsPic}
                alt=""
              />,
              <span>{text}</span>,
            ]}
          </div>
        );
      },
    },
    {
      title: '商品规格',
      width: '120px',
      dataIndex: 'propertyValue',
    },
    {
      title: '商品数量',
      width: '120px',
      dataIndex: 'goodsNum',
    },
    {
      title: type === 1 ? '换货数量' : '售后数量',
      width: '120px',
      dataIndex: 'exchangeAmount',
    },
    {
      title: '销售价',
      width: '120px',
      dataIndex: 'salePriceFormat',
    },
    {
      title: '成交价',
      width: '120px',
      dataIndex: 'finalPriceFormat',
    },
    {
      title: '售后单价',
      width: '120px',
      dataIndex: 'aftersalePriceFormat',
      render: (text, record) => {
        let initVal = typeof record?.aftersalePriceFormat === 'undefined' ?
          record?.finalPriceFormat : record?.aftersalePriceFormat;

        if (initVal && typeof initVal === 'string') {
          initVal = initVal.replace(/,/g, '');
        }
        let maxPrice = record.finalPriceFormat;
        if (maxPrice && typeof maxPrice === 'string') {
          maxPrice = maxPrice.replace(/,/g, '');
        }
        maxPrice = parseFloat(maxPrice);

        if (typeof record?.aftersalePriceFormat === 'undefined') {
          setTimeout(() => {
            this.handleAftersalePriceFormatChange(record, initVal);
          });
        }

        return isEdit ? (
          <FormItem className="view_aftersale_components_detail_goodsInfo_form_item">
            {
            getFieldDecorator(`aftersalePriceFormat[${record?.skuId}]`, {
              rules: [
                { required: true, message: '请输入售后单价！' },
              ],
              initialValue: initVal,
            })(
              <InputNumber
                max={maxPrice}
                min={0}
                onChange={(value) => {
                  this.handleAftersalePriceFormatChange(record, value);
                }}
              />
            )
          }
          </FormItem>
        ) : text;
      },
    },
    {
      title: '商品总额',
      width: '120px',
      dataIndex: 'goodsTotalSumFormat',
    },
    {
      title: '售后总额',
      width: '120px',
      dataIndex: 'aftersaleTotalSumFormat',
      // render(val, record) {
      //   if (typeof val !== 'undefined') {
      //     return val;
      //   }
      //   let initVal = typeof record?.aftersalePrice === 'undefined' ?
      //     record?.finalPrice : record?.aftersalePrice;
      //   if (initVal && typeof initVal === 'string') {
      //     initVal = initVal.replace(/,/, '');
      //   }
      //   // console.log('sum Amount', initVal, record.exchangeAmount);
      //   return fenToYuan(initVal * record.exchangeAmount, false);
      // },
    },
  ];

  if (isEdit && type === 1) {
    // 换货原商品
    columns.push({
      title: '操作',
      width: '120px',
      dataIndex: 'oper',
      render: (text, record) => {
        const { orderInfoVo = {}, swapOrderGoodsData = [] } = this.state;
        return (
          <ModalSwapGoods
            {
              ...this.props
            }
            params={{
              ...record,
              merchantId: orderInfoVo?.merchantId,
              orderGoodsType: orderInfoVo?.orderGoodsType,
            }}
            goodsList={swapOrderGoodsData.filter(item => item?.originSkuId === record?.skuId)}
            onOk={this.handleSelectSwapGoodsOk}
          />
        );
      },
    });
  }

  return columns;
}

/**
 * 换货单 换货商品表格
 */
export function getSwapOrderGoodsTableColumn() {
  const { isEdit = false, form } = this.props;
  const { getFieldDecorator } = form || {};
  const columns = [
    {
      title: '商品编号',
      width: '120px',
      dataIndex: 'goodsId',
      render(val, record) {
        return val || record.orderGoodsExchangeId;
      },
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (text, record) => {
        return (
          <div className="view_aftersale_components_detail_goodsInfo_goods_name">
            { record.goodsId && record.skuId > 0 ? (
              <Link to={`/goods/list/detail/${record.goodsId}`} target="_blank">
                <img
                  style={{
                  width: '50px',
                  height: '50px',
                }}
                  src={record.imgUrl || record.goodsUrl || defaultGoodsPic}
                  alt=""
                />
                <span>{text}</span>
              </Link>
            )
            : [
              <img
                style={{
                width: '50px',
                height: '50px',
              }}
                src={record.imgUrl || record.goodsUrl || defaultGoodsPic}
                alt=""
              />,
              <span>{text}</span>,
            ]}
          </div>
        );
      },
    },
    {
      title: '商品规格',
      width: '200px',
      dataIndex: 'propertyValue',
    },
    {
      title: '换货数量',
      width: '120px',
      dataIndex: 'exchangeAmount',
    },
    {
      title: '销售价',
      width: '120px',
      dataIndex: 'salePriceFormat',
    },
    {
      title: '换货单价',
      width: '120px',
      dataIndex: 'swapPriceFormat',
      render: (text, record) => {
        const initVal = (typeof record?.swapPriceFormat === 'undefined' ?
          record?.salePriceFormat : record?.swapPriceFormat);
        if (typeof text === 'undefined') {
          setTimeout(() => {
            this.handleSwapPriceFormatChange(record, initVal);
          });
        }
        return isEdit ? (
          <FormItem className="view_aftersale_components_detail_goodsInfo_form_item">
            {
            getFieldDecorator(`swapPriceFormat[${record?.skuId}]`, {
              rules: [
                { required: true, message: '请输入换货单价！' },
              ],
              initialValue: initVal,
            })(
              <InputNumber
                max={parseFloat(record.salePriceFormat)}
                min={0}
                onChange={(value) => {
                  this.handleSwapPriceFormatChange(record, value);
                }}
              />
            )
          }
          </FormItem>
        ) : text;
      },
    },
    {
      title: '换货总额',
      width: '120px',
      dataIndex: 'swapTotalFormat',
    },
  ];

  return columns;
}
