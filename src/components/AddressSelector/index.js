import React, { Component } from 'react';
import { Cascader } from 'antd';
// import './AddressSelector.less';
import options from './data.js';

export default class AddressSelector extends Component {
  onChange=(value) => {
    // console.log(value.join());
    return value;
  }

  render() {
    return (
      <div>
        <Cascader
          options={options}
          onChange={this.onChange.bind(this)}
          placeholder="请选择"
          {...this.props}
        />
      </div>
    );
  }
}
