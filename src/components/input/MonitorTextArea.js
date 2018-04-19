import React, { PureComponent } from 'react';
import { Input } from 'antd';
import './MonitorTextArea.less';

export default class MonitorTextArea extends PureComponent {
  render() {
    const { maxLength, form, datakey } = this.props;
    const currNum = form.getFieldsValue([datakey])[datakey]?.length || 0;

    return (
      !Number(maxLength)
        ? <Input.TextArea {...this.props} />
        : (
          <div>
            <Input.TextArea
              {...this.props}
              styleName="monitor-textarea"
            />
            <div styleName="monitor">
              <span>{currNum}</span>/{maxLength}
            </div>
          </div>
        )
    );
  }
}
