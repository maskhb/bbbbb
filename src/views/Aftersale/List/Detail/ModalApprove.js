import React from 'react';

import ModalReturnApprove from '../components/ModalReturnApprove';

export default class ModalApprove extends React.PureComponent {
  render() {
    // const { form, ...other } = this.props;
    return (
      <ModalReturnApprove {...this.props} />
    );
  }
}
