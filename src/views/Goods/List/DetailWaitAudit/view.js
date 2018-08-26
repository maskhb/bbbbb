import React, { PureComponent } from 'react';
import AUDITSTATUS from 'components/AuditStatus';
import Detail from '../../Detail/Detail';

export default class View extends PureComponent {
  render() {
    return (
      <Detail audit={AUDITSTATUS.WAIT.value} {...this.props} />
    );
  }
}
