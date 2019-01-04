// 所属组织选择输入框--  业务组件
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import OrgInput from './index';

@connect(({ user }) => ({
  user,
}))
class View extends PureComponent {
  static defaultProps = {
    user: { AllOrganization: [] },
  };


  componentDidMount() {
    const { user: { AllOrganization } } = this.props;
    if (!AllOrganization || AllOrganization.length < 1) {
      this.init();
    }
  }

  init = async (orgId = 0) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'user/queryAllOrganization',
      payload: {
        orgId,
      },
    });
  }


  render() {
    const { dispatch, user: { AllOrganization }, ...other } = this.props;
    return (

      <OrgInput
        {...other}
        data={AllOrganization}
      />

    );
  }
}

export default View;
