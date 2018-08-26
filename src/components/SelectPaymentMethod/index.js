/*
 * @Author: wuhao
 * @Date: 2018-05-05 11:43:28
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-09 20:09:01
 *
 * 支付方式  下拉选择框
 */
import React, { PureComponent } from 'react';

import { Select } from 'antd';

const { Option } = Select;

class SelectPaymentMethod extends PureComponent {
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
              key={item.paymentMethodCode}
              value={item.paymentMethodCode}
            >{item.paymentMethodName}
            </Option>
          ))
        }
      </Select>
    );
  }
}

export default SelectPaymentMethod;
