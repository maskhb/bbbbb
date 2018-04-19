import PageHeaderLayout from 'layouts/PageHeaderLayout';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Card } from 'antd';
import Crop from 'components/Crop';
import './view.less';


@connect(({ member, loading }) => ({
  /* redux传入 @:装饰器 */
  member,
  loading: loading.models.member,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {

  };


  render() {
    return (
      <PageHeaderLayout>
        <Crop />
      </PageHeaderLayout>
    );
  }
}
