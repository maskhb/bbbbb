import React, { PureComponent } from 'react';

export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
  };

  componentDidMount() {
    location.href = '/';
  }


  render() {
    return <div>..</div>;
  }
}
