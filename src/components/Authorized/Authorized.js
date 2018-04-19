import React from 'react';
import { connect } from 'dva';
import check from './CheckPermissions';

@connect(({ permission }) => ({
  permission,
}))
class Authorized extends React.Component {
  render() {
    const { children, authority, noMatch = null } = this.props;
    const childrenRender = typeof children === 'undefined' ? null : children;

    return check(
      authority,
      childrenRender,
      noMatch
    );
  }
}

export default Authorized;
