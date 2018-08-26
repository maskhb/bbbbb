import React, { PureComponent } from 'react';
import AUDITSTATUS from 'components/AuditStatus';
import View from '../List/view';

export default class List extends PureComponent {
  render() {
    return (
      <View audit={AUDITSTATUS.WAIT.value} />
    );
  }
}
