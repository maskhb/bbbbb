import React, { Component } from 'react';

// 模式说明：
// 组件内部使用setState后，通过form的事件onChange，改变form表单值

// 调用
// form.getFieldDecorator('', {})(
//   <ComboInput />
// )
export default class ComboForm extends Component {
  constructor(props) {
    super(props);

    const { value = {} } = this.props;
    this.state = {
      x1: value.x1 || '',
      x2: value.x2 || '',
    };
    this.triggerChange();
  }

  handleX1Change = (x) => {
    const x1 = x;

    this.setState({ x1 });
    this.triggerChange({ x1 });
  }

  handleX2Change = (x) => {
    const x2 = x;

    this.setState({ x2 });
    this.triggerChange({ x2 });
  }

  triggerChange = (changedValue) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  }

  render() {
    return (
      <div>ComboInput</div>
    );
  }
}
