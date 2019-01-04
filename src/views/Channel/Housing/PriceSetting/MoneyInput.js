import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

class MoneyInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
  handleChange(value) {
    let isPass = false;
    if (Number(value) >= 0) {
      if (String(value).split('.').length > 1) { // 如果有小数点
        if (String(value).split('.')[1].length <= 2) {
          isPass = true;
        }
      } else {
        isPass = true;
      }
    }
    if (isPass) {
      this.setState({
        value,
      });
      this.props.inputChange(value);
    }
  }
  render() {
    const { value } = this.state;
    return (
      <InputNumber
        {...this.props}
        value={value}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}

export default MoneyInput;
