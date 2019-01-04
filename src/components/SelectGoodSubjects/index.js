/*
 * @Author: wuhao
 * @Date: 2018-07-18 17:28:15
 * @Last Modified by:   wuhao
 * @Last Modified time: 2018-07-18 17:28:15
 *
 * 擅长科目 下拉选择框
 */

import React, { PureComponent } from 'react';

import { Select } from 'antd';

const { Option } = Select;

class SelectGoodSubjects extends PureComponent {
  static defaultProps = {};

  state = {}

  render() {
    const { dataSource = [], ...other } = this.props;
    return (
      <Select
        {...other}
      >
        {
          dataSource?.map(item => (
            <Option
              key={item.value}
              value={item.value}
            >{item.label}
            </Option>
          ))
        }
      </Select>
    );
  }
}

export default SelectGoodSubjects;
