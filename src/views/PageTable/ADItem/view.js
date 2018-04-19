/**
 * Created by rebecca on 2018/4/3.
 */
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
        view
      </div>
    );
  }
}
