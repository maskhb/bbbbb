/*
 * @Author: wuhao
 * @Date: 2018-04-20 10:28:19
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-08 16:54:43
 *
 * 商品信息
 */
import React, { PureComponent } from 'react';

import { Card, Table } from 'antd';

import { Link } from 'dva/router';

import Authorized from 'utils/Authorized';

import ModalRemarkGoods from '../../../components/ModalRemarkGoods';

import {
  getOptionLabelForValue,
  orderStatusOptions,

  isCustomGoodsOrder,
  isSetMealOrderGoodsInfo,
  isPartialShipments,
} from '../../../attr';

import {
  transformOrderDetailsGoodsList,
} from '../../../transform';

class GoodsInfo extends PureComponent {
  static defaultProps = {};

  state = {
    loading: false,
  }

  getColumns = () => {
    const { orders } = this.props;
    let isPackage = false;
    if (orders?.detail?.orderGoodsVOList) {
      isPackage = orders?.detail?.orderGoodsVOList.some((item) => {
        return isSetMealOrderGoodsInfo(item.isPackage);
      });
    }

    const isShowDiscount = (
      this.props.match.params.type !== '0' &&
      orderStatusName !== '已取消' &&
      orderStatusName !== '已取消 '
    );

    const orderStatusName = getOptionLabelForValue(orderStatusOptions)(orders?.detail?.orderStatus);
    const columns = [
      {
        title: '商品ID',
        width: '100px',
        dataIndex: 'goodsId',
        key: 'goodsId',
        render: (text) => {
          return `${text}` === '-1' ? (
            <a>{text}</a>
          ) : (
            <Link to={`/goods/list/detail/${text}`} >{text}</Link>
          );
        },
      },
      {
        title: '商品图片',
        width: '90px',
        dataIndex: 'mainImgUrl',
        key: 'mainImgUrl',
        render: (text, record) => {
          return text ? (
            <img src={text} width="65" height="65" alt={record.goodsName} />
          ) : '';
        },
      },
      {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      },
      {
        title: '商品规格',
        width: isShowDiscount ? '120px' : '240px',
        dataIndex: 'propertyValue',
        key: 'propertyValue',
      },
    ];

    if (isPackage) {
      columns.push({
        title: '销售价',
        width: '120px',
        dataIndex: 'marketPriceFormat',
        key: 'marketPriceFormat',
        render: (text, record) => {
          return isSetMealOrderGoodsInfo(
            record.isPackage
          ) ? record.marketPriceFormat : record.salePriceFormat;
        },
      }, {
        title: '套餐价',
        width: '120px',
        dataIndex: 'salePriceFormat',
        key: 'salePriceFormat',
        render: (text, record) => {
          return isSetMealOrderGoodsInfo(
            record.isPackage
          ) ? record.salePriceFormat : '';
        },
      });
    } else {
      columns.push({
        title: '销售价',
        width: '120px',
        dataIndex: 'salePriceFormat',
        key: 'salePriceFormat',
      });
    }
    columns.push(
      {
        title: '数量',
        width: '100px',
        dataIndex: 'goodsNum',
        key: 'goodsNum',
      },
      {
        title: '小计',
        width: '120px',
        dataIndex: 'goodsAmountFormat',
      },
    );

    if (
      isShowDiscount
    ) {
      (
        columns.push({
          title: '商家优惠',
          width: '90px',
          dataIndex: 'merchantDiscountFormat',
        },
        {
          title: '平台优惠券',
          width: '110px',
          dataIndex: 'platformCouponFormat',
        },
        {
          title: '商家优惠券',
          width: '110px',
          dataIndex: 'merchantCouponFormat',
        },
        {
          title: '平台满减',
          width: '90px',
          dataIndex: 'platformFullDiscountFormat',
        },
        {
          title: '商家满减',
          width: '90px',
          dataIndex: 'merchantFullDiscountFormat',
        },
        )
      );
    }


    columns.push({
      title: '应付金额',
      width: '120px',
      dataIndex: 'shouldPayAmountFormat',
    });

    return columns;
  }

  render() {
    const { className, orders, propertyKey, goods, dispatch, refresh } = this.props;
    const { detail } = orders || {};
    const { loading } = this.state;
    const orderStatusName = getOptionLabelForValue(orderStatusOptions)(detail?.orderStatus);
    return (
      <Card
        title="商品信息"
        className={`${className}`}
        extra={orderStatusName === '待发货' &&
        isCustomGoodsOrder(detail?.orderGoodsType) &&
        !isPartialShipments(detail) ? (
          <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_REMARKGOODS']}>
            <ModalRemarkGoods
              dispatch={dispatch}
              orders={orders}
              params={orders?.detail}
              propertyKey={propertyKey}
              goods={goods}
              refresh={refresh}
            />
          </Authorized>
        ) : null}
      >
        <Table
          dataSource={transformOrderDetailsGoodsList(orders?.detail?.orderGoodsVOList)}
          columns={this.getColumns()}
          pagination={false}
          loading={loading}
          rowKey="orderGoodsId"
        />
      </Card>
    );
  }
}

export default GoodsInfo;
