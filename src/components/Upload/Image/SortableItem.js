/*
 * @Author: wuhao
 * @Date: 2018-09-21 16:39:24
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-21 17:32:10
 *
 * 可拖动item
 */
import React, { Component } from 'react';

import { sortable } from 'react-anything-sortable';

@sortable
class SortableItem extends Component {
  static defaultProps = {};

  state = {}

  render() {
    return (
      <div {...this.props} >
        {this.props.children}
      </div>
    );
  }
}

export default SortableItem;
