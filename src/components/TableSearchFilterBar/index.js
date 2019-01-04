/*
 * @Author: wuhao
 * @Date: 2018-04-09 09:53:46
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-24 14:31:40
 *
 * 表格过滤选择栏
 */

import React, { PureComponent } from 'react';
import { Radio } from 'antd';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class TableSearchFilterBar extends PureComponent {
  static defaultProps = {};

  state = {}

  /**
   * change方法，进行数据重组。
   * 调用props的onChange(values)方法
   */
  handleSearchFilterChange = (e) => {
    const { radioOptions, stateOfSearch, setStateOfSearch, searchDefault, onChange } = this.props;
    const radioOptionValue = e.target.value;

    const params = radioOptions?.[radioOptionValue]?.value;
    // eslint-disable-next-line
    const { ...otherParams} = stateOfSearch;

    const values = {
      ...searchDefault,
      ...otherParams,
      ...params,
      currPage: 1,
    };

    setStateOfSearch(values);
    onChange?.(values);
  }

  render() {
    const { searchDefault, radioOptions } = this.props;

    return (
      <div style={{
        marginTop: '20px',
      }}
      >
        <RadioGroup
          defaultValue={searchDefault?.radioDefaultOption || 0}
          onChange={this.handleSearchFilterChange}
        >
          {
            radioOptions.map((item, index) => (
              <RadioButton key={item.label} value={index}>{item.label}</RadioButton>
            ))
          }
        </RadioGroup>
      </div>
    );
  }
}

export default TableSearchFilterBar;
