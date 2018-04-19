import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputNumber, message } from 'antd';

// 模式说明：
// 组件内部使用setState后，通过form的事件onChange，改变form表单值

// 调用
// form.getFieldDecorator('', {})(
//   <ComboInput />
// )
export default class RangeInput extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      min: value?.min || null,
      max: value?.max || null,
    };
  }

  componentWillReceiveProps(nextPops) {
    if (!nextPops.value) {
      this.setState({
        min: null,
        max: null,
      });
    } else {
      this.setState({
        min: nextPops.value.min,
        max: nextPops.value.max,
      });
    }
  }

  handleX1Change = (x) => {
    if (x === '') {
      this.props.onChange({ min: null, max: this.state.max });
      return;
    }
    const min = x;
    if (x < 0) {
      message.error('需大于等于0');
      return;
    }
    this.props.onChange({ min, max: this.state.max });
  }

  handleX2Change = (x) => {
    if (x === '') {
      this.props.onChange({ min: this.state.min, max: null });
      return;
    } const max = x;
    if (x < 0) {
      message.error('需大于等于0');
      return;
    }
    this.props.onChange({ min: this.state.min, max });
  }

  handleBlur = () => {
    const max = parseFloat(this.state.max);
    const min = parseFloat(this.state.min);
    if (max && max >= 0 && min && min >= 0 && min >= max) {
      message.error('上限需大于下限');
    }
  }

  render() {
    return (
      <div>
        <InputNumber
          style={{ width: '40%', display: 'inline-block' }}
          placeholder={this.props.placeholders[0]}
          onChange={this.handleX1Change}
          value={this.state.min}
          onBlur={this.handleBlur}
        />
        <span>  ——  </span>
        <InputNumber
          style={{ width: '40%', display: 'inline-block' }}
          placeholder={this.props.placeholders[1]}
          onChange={this.handleX2Change}
          value={this.state.max}
          onBlur={this.handleBlur}
        />
      </div>
    );
  }
}

RangeInput.propTypes = Object.assign({}, {
  value: PropTypes.shape({
    // min: PropTypes.oneOfType(
    //   PropTypes.number,
    // ),
    min: PropTypes.number,
    max: PropTypes.number,
  }), // 默认选中的选项
  placeholders: PropTypes.arrayOf(PropTypes.string).isRequired, // 下拉列表选项对应的value
});
