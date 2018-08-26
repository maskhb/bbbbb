import React, { PureComponent } from 'react';
import { Popover } from 'antd';

export default class TextBeyond extends PureComponent {
  static defaultProps = {
  };

  state = {
  };

  render() {
    const { content = '', tip = '', width = '300px', ...props } = this.props;

    const popoverProps = {
      placement: 'right',
      title: '',
      content: <div style={{ width }}>{tip}</div>,
      trigger: 'hover',
      ...props,
    };

    return (
      <Popover {...popoverProps}>
        {content}
      </Popover>
    );
  }
}
