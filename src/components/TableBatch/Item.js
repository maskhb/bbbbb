import React, { PureComponent } from 'react';

export default class Item extends PureComponent {
  render() {
    const { rows, children } = this.props;

    return (
      <span>
        {children({ rows })}
      </span>
    );
  }
}
