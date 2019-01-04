import React, { Component } from 'react';
import { Input } from 'antd';
import { getValueFromEvent } from 'utils/utils';

export default class DecorateInput extends Component {
  handleChange = (e) => {
    const { onChange } = this.props;
    if (onChange) {
      const value = getValueFromEvent(e);
      if (value !== null && e.target) {
        e.target.value = value;
      }
      // console.log(value.length, e.target.value, e);
      onChange(e);
    }
  }
  render() {
    const { onChange, ...other } = this.props;
    return (
      <Input onChange={this.handleChange} {...other} />
    );
  }
}

DecorateInput.Group = Input.Group;
DecorateInput.Search = Input.Search;
DecorateInput.TextArea = Input.TextArea;
