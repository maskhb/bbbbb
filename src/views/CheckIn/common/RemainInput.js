import { PureComponent } from 'react';
import { InputNumber, message } from 'antd';

export default class RemainInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    const { onChange, value: propsValue, remainValue, ...others } = this.props;
    const { value } = this.state;
    return (
      <InputNumber
        min={0}
        step={1}
        precision={0}
        value={value}
        {...others}
        onChange={(val) => {
          if (remainValue > val) {
            message.error('预留或入住该房型数量不能小于预定数量');
            this.setState({ value: propsValue });
          } else {
            this.setState({ value: val }, () => {
              onChange(val);
            });
          }
        }}
      />
    );
  }
}
