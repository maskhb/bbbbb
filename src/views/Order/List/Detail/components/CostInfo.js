/*
 * @Author: wuhao
 * @Date: 2018-04-20 10:30:24
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-20 08:25:34
 *
 * 费用信息
 */

import React, { PureComponent } from 'react';

import { Card } from 'antd';

import PayInfoForCostInfo from './PayInfoForCostInfo';
import OrderPaysForCostInfo from './OrderPaysForCostInfo';
import RefundInfoForCostInfo from './RefundInfoForCostInfo';

class CostInfo extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { className } = this.props;
    return (
      <Card title="费用信息" className={`${className}`}>
        <PayInfoForCostInfo
          {...this.props}
        />
        <OrderPaysForCostInfo
          {...this.props}
        />
        <RefundInfoForCostInfo
          {...this.props}
        />
      </Card>
    );
  }
}

export default CostInfo;
