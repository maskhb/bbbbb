import React, { Component } from 'react';
import { Input } from 'antd';
import './MonitorInput.less';

export default class MonitorInput extends Component {
  state = {
    currNum: 0,
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      if (value) {
        this.setState({
          currNum: value.length,
        });
      } else {
        this.setState({
          currNum: 0,
        });
      }
    }
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({
      currNum: value.length,
    });

    this.props.onChange(value);
  }

  render() {
    const { maxLength, simple } = this.props;
    const { currNum } = this.state;

    return (
      !Number(maxLength)
        ? <Input {...this.props} />
        : (
          <div>
            <Input
              {...this.props}
              style={{
                paddingRight: `${maxLength}`.length * 24,
              }}
              onChange={this.handleChange.bind(this)}
            />
            <div styleName="monitor" style={simple ? { height: '39px', lineHeight: '39px' } : {}}>
              <span>{currNum}</span>/{maxLength}
            </div>
          </div>
        )
    );
  }
}
