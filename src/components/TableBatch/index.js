import React, { PureComponent } from 'react';
import childrenWithProps from '../../utils/childrenWithProps';
import BatchMore from './More';
import BatchItem from './Item';
import './index.less';

export default class Batch extends PureComponent {
  static Item = BatchItem;
  static More = BatchMore;

  render() {
    const { children, selectedRows } = this.props;

    return (
      <div styleName="operator">
        {childrenWithProps(children, { rows: selectedRows })}
      </div>
    );
  }
}
