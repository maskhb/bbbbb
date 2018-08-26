import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';

import PageHeaderLayout from 'layouts/PageHeaderLayout';

import AnchorBar from './components/AnchorBar';
import OrderProgressProcess from './components/OrderProgressProcess';
import ReceiptInfo from './components/ReceiptInfo';
import GoodsInfo from './components/GoodsInfo';
import CostInfo from './components/CostInfo';
import LogisticsInfo from './components/LogisticsInfo';
import OperationLog from './components/OperationLog';
import FooterOperBar from './components/FooterOperBar';

import {
  getOptionLabelForValue,
  orderStatusOptions,
} from '../../attr';

import styles from './index.less';

@connect(({ global, orders, propertyKey, goods, loading }) => ({
  collapsed: global.collapsed,
  orders,
  propertyKey,
  goods,
  loading: loading.models.orders,
}))
class view extends PureComponent {
  static defaultProps = {};

  state = {}

  componentDidMount() {
    this.refreshOrderDetail();
  }

  getAnchorColumns = () => {
    const colums = [
      {
        label: '收货信息',
        value: '.view_order_list_detail_receipt',
      },
      {
        label: '商品信息',
        value: '.view_order_list_detail_goods',
      },
      {
        label: '费用信息',
        value: '.view_order_list_detail_cost',
      },
    ];

    if (
      !(
        this.props.match.params.type === '0' &&
        (
          getOptionLabelForValue(orderStatusOptions)(this.props?.orders?.detail?.orderStatus) === '已取消' ||
          getOptionLabelForValue(orderStatusOptions)(this.props?.orders?.detail?.orderStatus) === '已取消 '
        )
      )
    ) {
      colums.push({
        label: '物流信息',
        value: '.view_order_list_detail_logistics',
      });
    }

    colums.push({
      label: '操作日志',
      value: '.view_order_list_detail_operation',
    });

    return colums;
  }

  refreshOrderDetail = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'orders/detail',
      payload: {
        orderId: this.props.match.params.id,
      },
    });
  }

  render() {
    const { detail } = this.props.orders;
    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_order_list_detail)}>
        <AnchorBar
          columns={this.getAnchorColumns()}
          className="view_order_list_detail_anchor"
        />

        {
          !(
              getOptionLabelForValue(orderStatusOptions)(detail?.orderStatus) === '已取消' ||
              getOptionLabelForValue(orderStatusOptions)(detail?.orderStatus) === '已取消 '
          ) && (
            <OrderProgressProcess
              {...this.props}
              className="view_order_list_detail_progress"
            />
        )}

        <ReceiptInfo
          {...this.props}
          className="view_order_list_detail_receipt"
          refresh={this.refreshOrderDetail}
        />
        <GoodsInfo
          {...this.props}
          className="view_order_list_detail_goods"
          refresh={this.refreshOrderDetail}
        />
        <CostInfo
          {...this.props}
          className="view_order_list_detail_cost"
        />
        {
          !(
            this.props.match.params.type === '0' &&
            (
              getOptionLabelForValue(orderStatusOptions)(detail?.orderStatus) === '已取消' ||
              getOptionLabelForValue(orderStatusOptions)(detail?.orderStatus) === '已取消 '
            )
          ) && detail?.orderId ? (
            <LogisticsInfo
              {...this.props}
              className="view_order_list_detail_logistics"
            />
          ) : null
        }
        {detail?.orderSn ? (
          <OperationLog
            {...this.props}
            orderSn={detail?.orderSn}
            className="view_order_list_detail_operation"
          />
        ) : null}
        <FooterOperBar
          {...this.props}
          className="view_order_list_detail_footeroper"
        />
      </PageHeaderLayout>
    );
  }
}

export default view;
