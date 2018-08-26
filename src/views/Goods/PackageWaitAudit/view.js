import React, { PureComponent } from 'react';
import AUDITSTATUS from 'components/AuditStatus/PackageAuditStatus';
import View from '../Package/List/List';

export default class List extends PureComponent {
  render() {
    return (
      <View audit={AUDITSTATUS.WAIT.value} />
    );
  }
}
