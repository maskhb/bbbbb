/*
 * @Author: wuhao
 * @Date: 2018-06-13 17:28:43
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-18 10:18:28
 *
 * 售后  商品信息组件
 */
import React, { PureComponent } from 'react';

import classNames from 'classnames';

import { mul } from 'utils/number';

import { Table, Card, Button } from 'antd';
import { fenToYuan } from 'utils/money';

import ModalSelectOrderGoods from './components/ModalSelectOrderGoods';

import { getOrderGoodsTableColumn, getSwapOrderGoodsTableColumn } from './columns';

import styles from './index.less';

class GoodsInfo extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      orderInfoVo: {}, // eslint-disable-line
      orderGoodsData: [],
      swapOrderGoodsData: [],
      selectedRowKeys: [],
      selectedSwapRowKeys: [],
    };

    this.initFormField();

    this.getOrderGoodsTableColumn = getOrderGoodsTableColumn.bind(this);
    this.getSwapOrderGoodsTableColumn = getSwapOrderGoodsTableColumn.bind(this);

    if (props.detailVO) {
      this.setGoodsFromDetail(props.detailVO);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { orderInfoVo } = nextProps || {};
    if (!orderInfoVo?.orderSn && !this.props.detailVO && nextProps.detailVO) {
      this.setGoodsFromDetail(nextProps.detailVO);
    }
  }

  setGoodsFromDetail = (detailVO) => {
    const data = { orderInfoVo: {
      ...detailVO.orderInfoVO, paymentRecordVOList: detailVO.paymentRecordVOList,
    } };

    if (this.state.orderGoodsData.length === 0 || this.state.swapOrderGoodsData.length === 0) {
      const { orderInfoVo = {} } = this.state;
      this.setState({
        orderInfoVo: { ...Object.assign(orderInfoVo, data.orderInfoVo) },
      });
    }

    if (this.state.orderGoodsData.length === 0) {
      data.orderGoodsData = (detailVO?.orderGoodsList || []).map((gd) => {
        return {
          ...gd,
          propertyValue: gd.goodsPropertis,
          exchangeAmount: gd.afterSaleNum,
          salePrice: gd.saleUnitPrice,
          salePriceFormat: gd.saleUnitPriceFormat,
          finalPrice: gd.dealUnitPrice,
          finalPriceFormat: gd.dealUnitPriceFormat,
          aftersalePriceFormat: gd.afterSaleUnitPriceFormat,
          aftersalePrice: gd.afterSaleUnitPrice,
          aftersaleTotalSumFormat: fenToYuan(mul(gd.afterSaleNum, gd.afterSaleUnitPrice), false),
          aftersaleTotalSum: mul(gd.afterSaleNum, gd.afterSaleUnitPrice),
          goodsId: gd.goodsId,
          goodsTotalSumFormat: fenToYuan(mul(gd.saleUnitPrice, gd.goodsNum)),
        };
      });

      const { orderGoodsData = [] } = this.state;
      orderGoodsData.push(...data.orderGoodsData);
      this.setState({
        orderGoodsData: [...orderGoodsData],
      });
    }
    if (this.state.swapOrderGoodsData.length === 0) {
      data.swapOrderGoodsData = (detailVO?.orderGoodsExchangeList || []).map((gd) => {
        return {
          ...gd,
          propertyValue: gd.goodsPropertis,
          exchangeAmount: gd.exchangeNum,
          salePrice: gd.saleUnitPrice,
          salePriceFormat: gd.saleUnitPriceFormat,
          swapPriceFormat: gd.exchangeUnitPriceFormat,
          swapPrice: gd.exchangeUnitPrice,
          swapTotalFormat: fenToYuan(mul(gd.exchangeNum, gd.exchangeUnitPrice)),
          goodsId: gd.goodsId,
        };
      });

      const { swapOrderGoodsData = [] } = this.state;
      swapOrderGoodsData.push(...data.swapOrderGoodsData);
      this.setState({
        swapOrderGoodsData: [...swapOrderGoodsData],
      });
    }
    // console.log('set init ....', data);

    this.setState(data);
    this.setFormField({
      orderInfoVo: data.orderInfoVo,
      goodsList: data.orderGoodsData,
      exchangeGoddsList: data.swapOrderGoodsData,
    });
  }

  setFormField = ({ orderInfoVo, goodsList, exchangeGoddsList }) => {
    const { form } = this.props;
    const { setFieldsValue } = form || {};

    if (setFieldsValue) {
      if (orderInfoVo) {
        setFieldsValue({
          orderInfoVo,
        });
      }

      if (goodsList) {
        setFieldsValue({
          goodsList: [
            ...(goodsList || []).map((item) => {
              return {
                afterSaleNum: item?.exchangeAmount,
                afterSaleUnitPrice: item?.aftersalePrice || item?.finalPrice,
                applyOrderId: item?.applyOrderId,
                dealUnitPrice: item?.finalPrice,
                goodsName: item?.goodsName,
                goodsNum: item?.goodsNum,
                goodsPropertis: item?.propertyValue,
                goodsUrl: item?.mainImgUrl,
                orderGoodsId: item?.orderGoodsId,
                saleUnitPrice: item?.salePrice,
                signTime: item?.receiptTime,
                skuId: item?.skuId,
                goodsId: item?.goodsId,
              };
            }),
          ],
        });
      }

      if (exchangeGoddsList) {
        setFieldsValue({
          exchangeGoddsList: [
            ...(exchangeGoddsList || []).map((item) => {
              return {
                exchangeNum: item?.exchangeAmount,
                exchangeUnitPrice: item?.swapPrice || item?.salePrice,
                goodsName: item?.goodsName,
                goodsPropertis: item?.propertyValue,
                goodsUrl: item?.imgUrl || item?.mainImgUrl,
                orderGoodsExchangeId: item?.orderGoodsExchangeId,
                orderGoodsExchangeSn: item?.orderGoodsExchangeSn,
                originSkuId: item?.originSkuId,
                saleUnitPrice: item?.salePrice,
                skuId: `${item?.skuId}`?.indexOf('custom') > -1 ? undefined : item?.skuId,
                goodsId: item?.goodsId,
              };
            }),
          ],
        });
      }
    }
  }

  initFormField = () => {
    const { form } = this.props;
    const { getFieldDecorator } = form || {};

    if (getFieldDecorator) {
      /**
       * 初始化表单数据
       */
      getFieldDecorator('orderInfoVo', { initialValue: {} });
      getFieldDecorator('goodsList', { initialValue: [] });
      getFieldDecorator('exchangeGoddsList', { initialValue: [] });
    }
  }

  handleSelectOrderGoodsOk = ({ orderVO = {}, selectedRows = [] }) => {
    this.setFormField({
      orderInfoVo: orderVO,
      goodsList: selectedRows,
      exchangeGoddsList: [],
    });

    this.setState({
      orderInfoVo: orderVO, // eslint-disable-line
      orderGoodsData: selectedRows,
      swapOrderGoodsData: [],
    });
  }

  handleSelectSwapGoodsOk = ({ originSkuId, goodsList = [] }) => {
    const { swapOrderGoodsData = [] } = this.state;
    this.setFormField({
      exchangeGoddsList: [
        ...swapOrderGoodsData?.filter(item => item.originSkuId !== originSkuId),
        ...goodsList,
      ],
    });
    this.setState({
      swapOrderGoodsData: [
        ...swapOrderGoodsData?.filter(item => item.originSkuId !== originSkuId),
        ...goodsList,
      ],
    });
  }

  handleSelectOrderDelete = () => {
    const { selectedRowKeys = [], orderGoodsData = [] } = this.state;

    const newGoodsList = orderGoodsData?.filter((item) => {
      return !selectedRowKeys?.some(skuId => item?.skuId === skuId);
    });

    this.setFormField({
      goodsList: newGoodsList,
    });

    this.setState({
      orderGoodsData: newGoodsList,
    });
  }

  handleSwapGoodsDelete = () => {
    const { selectedSwapRowKeys = [], swapOrderGoodsData = [] } = this.state;

    const newGoodsList = swapOrderGoodsData?.filter((item) => {
      return !selectedSwapRowKeys?.some(skuId => item?.skuId === skuId);
    });

    this.setFormField({
      exchangeGoddsList: newGoodsList,
    });

    this.setState({
      swapOrderGoodsData: newGoodsList,
    });
  }

  handleTableSelectSwapChange = (selectedRowKeys) => {
    this.setState({
      selectedSwapRowKeys: selectedRowKeys,
    });
  }

  handleTableSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  handleAftersalePriceFormatChange = (record, value) => {
    const { orderGoodsData = [] } = this.state;

    const newGoodsList = orderGoodsData?.map((item) => {
      const newItem = item;
      if (record?.skuId === newItem?.skuId) {
        newItem.aftersalePriceFormat = value || 0;
        newItem.aftersalePrice = mul(newItem.aftersalePriceFormat, 100);
        newItem.aftersaleTotalSumFormat = mul(newItem.exchangeAmount, value);
        newItem.aftersaleTotalSum = mul(newItem.exchangeAmount, newItem.aftersalePrice);
      }
      return newItem;
    });

    this.setFormField({
      goodsList: newGoodsList,
    });

    this.setState({
      orderGoodsData: newGoodsList,
    });
  }

  handleSwapPriceFormatChange = (record, value) => {
    const { swapOrderGoodsData = [] } = this.state;

    const newGoodsList = swapOrderGoodsData?.map((item) => {
      const newItem = item;
      if (record?.skuId === newItem?.skuId) {
        newItem.swapPriceFormat = value || 0;
        newItem.swapPrice = mul(newItem.swapPriceFormat, 100);
        newItem.swapTotalFormat = fenToYuan(mul(newItem.exchangeAmount, newItem.swapPrice));
        newItem.swapTotal = mul(newItem.exchangeAmount, newItem.swapPrice);
      }
      return newItem;
    });

    this.setFormField({
      exchangeGoddsList: newGoodsList,
    });

    this.setState({
      swapOrderGoodsData: newGoodsList,
    });
  }

  // 原订单 商品信息
  renderOrder() {
    const { isEdit = false, form, pattern, aftersaleType, detailVO, ...other } = this.props;
    const { orderGoodsData, selectedRowKeys } = this.state;
    const selectGoodsProps = { pattern };
    // console.log('other....', other);
    // console.log('orderGoodsData', order)
    // console.log('selectGoodsProps', 'fdjsofjsdof', pattern);
    if (pattern === 'edit') {
      selectGoodsProps.title = '编辑原订单';
      selectGoodsProps.btnTitle = '编辑原订单';
      selectGoodsProps.orderSn = detailVO?.orderSn;
      selectGoodsProps.orderGoodsList = detailVO?.orderGoodsList;
      // console.log(other);
    }
    return (
      <div className={classNames(styles.view_aftersale_components_detail_goodsInfo)}>
        {
          isEdit && (pattern === 'add' || (pattern === 'edit' && aftersaleType !== 'refund')) ? (
            <div className="view_aftersale_components_detail_goodsInfo_operbtns">
              <ModalSelectOrderGoods
                {...other}
                {...selectGoodsProps}
                onOk={this.handleSelectOrderGoodsOk}
              />
              <Button type="danger" icon="minus" onClick={this.handleSelectOrderDelete}>删除</Button>
            </div>
          ) : null
        }

        <Table
          rowSelection={isEdit ? {
            selectedRowKeys,
            onChange: this.handleTableSelectChange,
          } : null}
          columns={this.getOrderGoodsTableColumn()}
          dataSource={orderGoodsData}
          pagination={false}
          rowKey="skuId"
        />
      </div>
    );
  }

  // 售后换货 商品信息
  renderSwap() {
    const { isEdit = false } = this.props;
    const { swapOrderGoodsData, selectedSwapRowKeys } = this.state;
    return (
      <div>
        <Card title="原商品信息" type="inner">
          {this.renderOrder()}
        </Card>
        <Card title="换货商品信息" type="inner">
          <div className={classNames(styles.view_aftersale_components_detail_goodsInfo)}>
            {
              isEdit ? (
                <div className="view_aftersale_components_detail_goodsInfo_operbtns">
                  <Button type="danger" icon="minus" onClick={this.handleSwapGoodsDelete}>删除</Button>
                </div>
              ) : null
            }

            <Table
              rowSelection={isEdit ? {
                selectedSwapRowKeys,
                onChange: this.handleTableSelectSwapChange,
              } : null}
              columns={this.getSwapOrderGoodsTableColumn()}
              dataSource={swapOrderGoodsData}
              pagination={false}
              rowKey="skuId"
            />
          </div>
        </Card>
      </div>
    );
  }

  render() {
    // console.log('state', this.state);
    const { type = 0 } = this.props;


    return type === 1 ? this.renderSwap() : this.renderOrder();
  }
}

export default GoodsInfo;
