/*
 * @Author: wuhao
 * @Date: 2018-06-13 17:01:41
 * @Last Modified by: jone
 * @Last Modified time: 2018-7-8
 *
 * 换货单详情 其他多选信息
 */

import React, { PureComponent } from 'react';

import TabsCard from 'components/TabsCard';

import GoodsInfo from '../../../components/details/GoodsInfo';
import ApplyInfo from '../../../components/details/ApplyInfo';
import OriginOrderInfo from '../../../components/details/OriginOrderInfo';
import PayInfo from '../../../components/details/PayInfo';
import OperateLog from '../../../components/details/OperateLog';

class TabsOtherMoreInfo extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    return (
      <TabsCard>
        <GoodsInfo
          {...this.props}
          tab="商品信息"
          type={1}
        />
        <ApplyInfo
          {...this.props}
          tab="申请信息"
        />
        <OriginOrderInfo
          {...this.props}
          tab="原单据信息"
        />
        <PayInfo
          {...this.props}
          tab="支付信息"
        />
        <OperateLog
          {...this.props}
          tab="状态处理日志"
        />
      </TabsCard>
    );
  }
}

export default TabsOtherMoreInfo;
