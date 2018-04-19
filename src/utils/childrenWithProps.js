import React from 'react';
import _ from 'lodash';

export default function childrenWithProps(ele, props) {
  const clone = (item, i) => {
    if (item.$$typeof === Symbol.for('react.element')) {
      return React.cloneElement(item, {
        ...props,
        key: i,
      });
    } else {
      return item;
    }
  };

  if (_.isArray(ele)) {
    return Object.values(ele).map(clone);
  }

  return React.Children.map(ele, clone);
}
