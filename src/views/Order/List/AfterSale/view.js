/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:22:33
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-17 08:15:10
 *
 * 生成售后单
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';

import classNames from 'classnames';
import { goTo } from 'utils/utils';

import { Form, Spin, message } from 'antd';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import DetailFooterToolbar from 'components/DetailFooterToolbar';

import UserInfoCard from './components/UserInfoCard';
import ReceiptInfoCard from './components/ReceiptInfoCard';
import BusinessGoodsCard from './components/BusinessGoodsCard';
import OtherInfoCard from './components/OtherInfoCard';

import styles from './index.less';

@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
@Form.create()
class view extends PureComponent {
  static defaultProps = {};

  state = {}

  componentDidMount = () => {
    this.initOrderInfo();
  }


  initOrderInfo = async () => {
    const { dispatch } = this.props;
    // TODO wuhao 需要确认请求调用
    await dispatch({
      type: 'orders/detail',
      payload: {
        orderId: this.props.match.params.id,
      },
    });
  }

  handleAfterSaleAdd = async () => {
    const { form, dispatch, orders } = this.props;
    const { detail } = orders || {};
    const { orderSn } = detail || {};

    form?.validateFields((err, values) => {
      if (!err) {
        const func = async () => {
          const [goodsVO] = values?.orderGoodsList || [];

          if (!goodsVO) {
            message.success('请选择商品后在进行此操作~');
            return;
          }

          await dispatch({
            type: 'orders/createOrderForExcessPay',
            payload: {
              orderSn,
              skuId: goodsVO?.skuId,
              goodsNum: goodsVO?.goodsNum,
              orderRemark: values?.remark,
              merchantId: values?.merchantId,
            },
          });

          const res = this.props?.orders?.createOrderForExcessPay;
          if (res) {
            message.success('成功生成售后订单');
            goTo('/order/list');
          }
        };

        func();
      }
    });
  }

  render() {
    const { form, loading } = this.props;
    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_order_list_after_sale)}>
        <Spin spinning={loading}>
          <Form>
            <UserInfoCard
              {...this.props}
            />

            <ReceiptInfoCard
              {...this.props}
            />

            <BusinessGoodsCard
              {...this.props}
            />

            <OtherInfoCard
              {...this.props}
            />
          </Form>
        </Spin>

        <DetailFooterToolbar
          submitBtnTitle="生成订单"
          pattern="add"
          form={form}
          submitting={loading}
          handleSubmit={this.handleAfterSaleAdd}
        />

      </PageHeaderLayout>
    );
  }
}

export default view;
