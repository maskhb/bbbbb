import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { } from 'antd';

@connect(({ xxx, loading }) => ({
  xxx,
  loading: loading.models.xxx,
}))
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
  };

  render() {
    return (
      <div>
        设置权限
      </div>
    );
  }
}
