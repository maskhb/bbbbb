import React, { Component } from 'react';
import { Input } from 'antd';

const canChange = (e) => {
  let value;
  if (!e || !e.target) {
    value = e;
  } else {
    const { target } = e;
    // eslint-disable-next-line
    value =  target.type === 'checkbox' ? target.checked : target.value;
  }
  // eslint-disable-next-line
  if (value.__proto__ === String.prototype) {
    return value.replace(/^\s/, '').replace(/(\s{2}$)/g, ' ') === value;
  }
  return true;
};
export default class DecorateInput extends Component {
  handleChange = (e) => {
    const { onChange } = this.props;
    if (onChange) {
      const canChanged = canChange(e);
      if (!canChanged) {
        e.preventDefault();
        return;
      }
      // e.target.value = value;

      // console.log(value.length, e.target.value, e);
      onChange(e);
    }
  }
  render() {
    const { onChange, ...other } = this.props;
    return (
      <Input {...other} onChange={this.handleChange} />
    );
  }
}

DecorateInput.Group = Input.Group;
DecorateInput.Search = Input.Search;
DecorateInput.TextArea = Input.TextArea;
