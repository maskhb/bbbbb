import React, { PureComponent } from 'react';
import TabsCard from 'components/TabsCard';
import BaseInfo from './BaseInfo';
import CouponCodeDetail from './CouponCodeDetail';
import OperateLog from './OperateLog';
import BatchLog from './BatchLog';
import BatchOperate from './BatchOperate';

class TabsInfo extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { path } = this.props?.match;

    return (

      <div>
        {
          path !== '/marketing/coupon/log' ? (
            <TabsCard>
              <BaseInfo
                {...this.props}
                tab="基本信息"
              />
              <CouponCodeDetail
                {...this.props}
                tab="券码明细"
              />
              <OperateLog
                {...this.props}
                tab="操作日志"
              />
            </TabsCard>) : (
              <TabsCard>
                <BatchOperate
                  {...this.props}
                  tab="操作"
                />
                <BatchLog
                  {...this.props}
                  tab="日志"
                />
              </TabsCard>)
        }
      </div>
    );
  }
}

export default TabsInfo;
