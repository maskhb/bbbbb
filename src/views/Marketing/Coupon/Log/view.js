import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import TabsInfo from '../components/detail/TabsInfo';

@connect(({ marketing, loading }) => ({
  marketing,
  loading: loading.models.marketing,
}))

@Form.create()
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {};

  render() {
    return (
      <PageHeaderLayout >
        <TabsInfo
          {...this.props}
        />
      </PageHeaderLayout>
    );
  }
}
