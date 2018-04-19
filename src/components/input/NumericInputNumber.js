import React from 'react';
import { InputNumber, Tooltip } from 'antd';

export default class NumericInput extends React.Component {
  render() {
    const { value } = this.props;
    const title = value ? (
      <span>
        {value}
      </span>
    ) : '请输入一个数字';

    return (
      <Tooltip
        trigger={['focus']}
        title={title}
        placement="topLeft"
      >
        <InputNumber
          {...this.props}
          maxLength="25"
        />
      </Tooltip>
    );
  }
}
