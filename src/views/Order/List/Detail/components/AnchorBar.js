/*
 * @Author: wuhao
 * @Date: 2018-04-20 08:48:07
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-09 15:58:38
 *
 * 锚点组件
 */
import React, { PureComponent } from 'react';

import { Radio } from 'antd';

const { Group: RadioGroup, Button: RadioButton } = Radio;

class AnchorBar extends PureComponent {
  static defaultProps = {};

  state = {}

  handleNavBarChange = (e) => {
    const { value } = e.target;

    document.querySelector(`${value}`)?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }

  render() {
    const { className, columns = [] } = this.props;
    return (
      <RadioGroup value="" onChange={this.handleNavBarChange} size="large" className={`${className}`}>
        {
          columns.map(item => (
            <RadioButton key={item.value} value={item.value}>{item.label}</RadioButton>
          ))
        }
      </RadioGroup>
    );
  }
}

export default AnchorBar;
