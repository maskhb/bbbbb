import React, { Component } from 'react';
import { Select } from 'antd';

export default class SimpleSelect extends Component {
  render() {
    const { options = {}, ...props } = this.props;

    return (
      <Select {...props}>
        {
          Object.keys(options).map((i) => {
            return <Select.Option key={i} value={options[i]}>{i}</Select.Option>;
          })
        }
      </Select>
    );
  }
}
