import React from 'react';
import RefundInfo from './RefundInfo';

export default class Index extends React.Component {
  render() {
    return <RefundInfo {...this.props} />;
  }
}
