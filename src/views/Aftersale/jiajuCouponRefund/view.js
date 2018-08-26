import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Card } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import TabsCard from 'components/TabsCard';
// import Authorized from 'utils/Authorized';
import checkPermission from 'components/Authorized/CheckPermissions';

import {
  OPERPORT_JIAJU_JIAJUQUANRETURNLIST_LIST,
  OPERPORT_JIAJU_JIAJUQUANRETURNLOG_LIST,
} from 'config/permission';

import List from './List';
import Log from './Log';
// import Upload from 'components/Upload/File/FileUpload';
// import GroupsListView from './GroupsListView';

// const { TabPane } = Tabs;

@connect(({ jiajuCoupon, loading }) => ({
  jiajuCoupon,
  loading: loading.models.jiajuCoupon,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };


  render() {
    return (
      <PageHeaderLayout>
        <TabsCard>
          {checkPermission(OPERPORT_JIAJU_JIAJUQUANRETURNLIST_LIST) && (
            <List
              {...this.props}
              tab="家居券退款申请列表"
            />
          )}

          {checkPermission(OPERPORT_JIAJU_JIAJUQUANRETURNLOG_LIST) && (
            <Log
              {...this.props}
              tab="操作日志"
            />
          )}
        </TabsCard>
      </PageHeaderLayout>
    );
  }
}
