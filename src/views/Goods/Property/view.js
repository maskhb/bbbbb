import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Tabs, Card } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
// import Authorized from 'utils/Authorized';
import checkPermission from 'components/Authorized/CheckPermissions';

import {
  OPERPORT_JIAJU_BASICPROPERTYLIST_LIST,
  OPERPORT_JIAJU_SALESPROPERTYLIST_LIST,
} from 'config/permission';

// import Upload from 'components/Upload/File/FileUpload';
import GroupsListView from './GroupsListView';

const { TabPane } = Tabs;

@connect(({ propertyGroup, loading }) => ({
  propertyGroup,
  loading: loading.models.propertyGroup,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
    tabKey: 'basic',
  };

  handleChange = (tabKey) => {
    this.setState({ tabKey });
  }

  render() {
    const { tabKey } = this.state;
    const { loading, propertyGroup, dispatch } = this.props;
    return (
      <PageHeaderLayout>
        <Card>
          {/* <Upload uploaduploadType="*" /> */}
          <Tabs defaultActiveKey={tabKey} onChange={this.handleChange}>
            { checkPermission(OPERPORT_JIAJU_BASICPROPERTYLIST_LIST) && (
              <TabPane tab="基本属性组" key="basic">
                <GroupsListView
                  type={1}
                  loading={loading}
                  propertyGroup={propertyGroup}
                  dispatch={dispatch}
                />
              </TabPane>
              )
            }
            { checkPermission(OPERPORT_JIAJU_SALESPROPERTYLIST_LIST) && (
              <TabPane tab="规格属性组" key="specs">
                <GroupsListView
                  type={2}
                  loading={loading}
                  propertyGroup={propertyGroup}
                  dispatch={dispatch}
                />
              </TabPane>
              )}
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
