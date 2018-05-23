import React, { Component } from 'react';
import { Input, Select, InputNumber } from 'antd';

export default class InputSelectGroup extends Component {
  constructor(props) {
    super(props);

    const { value = {} } = this.props;
    this.state = {
      number: value.number,
      unit: value.unit || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState(value);
    }
  }

  handleNumberChange = (value) => {
    const number = parseInt(value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ number });
    }
    this.triggerChange({ number });
  }

  handleUnitChange = (unit) => {
    if (!('value' in this.props)) {
      this.setState({ unit });
    }
    this.triggerChange({ unit });
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { size, disabled, children } = this.props;
    const { number, unit } = this.state;

    return (
      <Input.Group compact>
        <InputNumber
          min={0}
          precision={0}
          step={1}
          size={size}
          value={number}
          onChange={this.handleNumberChange}
          disabled={disabled}
          style={{ width: '50%', marginRight: 0 }}
        />
        <Select
          value={unit}
          size={size}
          style={{ width: '32%' }}
          disabled={disabled || !children}
          onChange={this.handleUnitChange}
        >
          {children || <Select.Option value={unit}>{unit}</Select.Option>}
        </Select>
      </Input.Group>
    );
  }
}
