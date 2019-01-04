import React, { Component } from 'react';
import Input from './DecorateInput';
import './MonitorInput.less';

export default class MonitorInput extends Component {
  state = {
    currNum: 0,
  }

  componentDidMount() {
    if ('value' in this.props) {
      const { value } = this.props;
      if (value) {
        this.setState({
          currNum: value.length,
        });
      }
    }
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
    const { onChange, whitespace } = this.props;
    const { value } = e.target;

    if (value && whitespace === true) {
      e.target.value = value.replace(/^\s/, '').replace(/(\s{2}$)/g, ' ');
    }

    this.setState({
      currNum: value.length,
    });

    onChange?.(e);
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
