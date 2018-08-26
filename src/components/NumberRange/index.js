import React, { Component } from 'react';
import { InputNumber } from 'antd';

export default class NumberRange extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      min: value?.min,
      max: value?.max,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.setState({
        min: nextProps.value.min,
        max: nextProps.value.max,
      });
    } else {
      this.setState({
        min: null,
        max: null,
      });
    }
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    const { placeholders: [p1 = '最小', p2 = '最大'] = [] } = this.props;
    const { min, max } = this.state;

    return (
      <div>
        <InputNumber
          min={0}
          value={min}
          placeholder={p1}
          onChange={value => this.triggerChange({ min: value })}
        />
        <span>  ——  </span>
        <InputNumber
          min={0}
          value={max}
          placeholder={p2}
          onChange={value => this.triggerChange({ max: value })}
        />
      </div>
    );
  }
}
