import React, { PureComponent } from 'react';
import { Popover } from 'antd';

export default class TextBeyond extends PureComponent {
  static defaultProps = {
  };

  state = {
  };

  render() {
    const { content = '', maxLength = 12, width, ...props } = this.props;

    const popoverProps = {
      placement: 'right',
      title: '',
      content: <div style={{ width }}>{content}</div>,
      trigger: 'hover',
      ...props,
    };

    return (
      content.length > maxLength
        ? (
          <Popover {...popoverProps}>
            {content.substr(0, maxLength)}...
          </Popover>
        )
        : content
    );
  }
}
