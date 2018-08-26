/*
 * @Author: wuhao
 * @Date: 2018-04-20 10:25:10
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-21 18:45:08
 *
 * 订单进度流程图
 */
import React, { PureComponent } from 'react';

import { Card, Steps } from 'antd';
import _ from 'lodash';

import { isCustomGoodsOrder } from '../../../attr';

const { Step } = Steps;

class OrderProgressProcess extends PureComponent {
  static defaultProps = {};

  state = {}

  renderCustomGoodsOrderProcess = () => {
    const { orders } = this.props;

    const actionList = orders?.detail?.orderActionVOList || [];
    return (
      <Steps current={
        _.filter(actionList, (item) => {
          return [1, 3, 4, 5, 6, 7].indexOf(item.action) !== -1 && item.time > 0;
        })?.length - 1 || 0
        }
      >
        <Step title="买家下单" description={_.find(actionList, (item) => { return item.action === 1; })?.formatTime} />
        <Step title="已付定金" description={_.find(actionList, (item) => { return item.action === 3; })?.formatTime} />
        <Step title="商家审核" description={_.find(actionList, (item) => { return item.action === 4; })?.formatTime} />
        <Step title="已付尾款" description={_.find(actionList, (item) => { return item.action === 5; })?.formatTime} />
        <Step title="商家发货" description={_.find(actionList, (item) => { return item.action === 6; })?.formatTime} />
        <Step title="交易完成" description={_.find(actionList, (item) => { return item.action === 7; })?.formatTime} />
      </Steps>
    );
  }

  renderGoodsOrderProcess = () => {
    const { orders } = this.props;

    const actionList = orders?.detail?.orderActionVOList || [];
    return (
      <Steps current={
        _.filter(actionList, (item) => {
          return [1, 2, 6, 7].indexOf(item.action) !== -1 && item.time > 0;
        })?.length - 1 || 0
        }
      >
        <Step title="买家下单" description={_.find(actionList, (item) => { return item.action === 1; })?.formatTime} />
        <Step title="买家付款" description={_.find(actionList, (item) => { return item.action === 2; })?.formatTime} />
        <Step title="商家发货" description={_.find(actionList, (item) => { return item.action === 6; })?.formatTime} />
        <Step title="交易完成" description={_.find(actionList, (item) => { return item.action === 7; })?.formatTime} />
      </Steps>
    );
  }

  render() {
    const { className, orders } = this.props;
    const { detail } = orders || {};

    return (
      <Card className={`${className}`}>

        {
          isCustomGoodsOrder(detail?.orderGoodsType) ?
          this.renderCustomGoodsOrderProcess() :
          this.renderGoodsOrderProcess()
        }

      </Card>
    );
  }
}

export default OrderProgressProcess;
