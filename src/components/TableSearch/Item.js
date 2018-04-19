import React, { PureComponent } from 'react';
import { Col, Form } from 'antd';
import './index.less';

export default class Item extends PureComponent {
  render() {
    const {
      md = 8,
      sm = 24,
      label,
      form,
      children,
      expand,
      simple = false,
    } = this.props;

    return (
      expand || simple
        ? (
          <Col md={md} sm={sm} styleName="item">
            <Form.Item label={label}>
              {children({ form })}
            </Form.Item>
          </Col>
        )
        : ''
    );
  }
}
