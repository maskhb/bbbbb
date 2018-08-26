/*
 * @Author: wuhao
 * @Date: 2018-07-16 14:51:59
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-01 15:03:08
 *
 * 穿梭框默认搜索结果显示组件
 */

import React, { PureComponent } from 'react';

import { Form, InputNumber } from 'antd';

const { Item: FormItem } = Form;

class SearchShowItem extends PureComponent {
  static defaultProps = {};

  state = {}

  handleInputNumberChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange({
        num: value,
      });
    }
  }

  render() {
    const { record, form, isShowInput, rowKey } = this.props;
    const { getFieldDecorator } = form || {};
    // console.log('....record...', record);
    return (
      <div className="search_res_item">
        <img src={record?.img || ''} alt="" />
        <div>
          <div>{record?.name}</div>
          <div>{record?.desc}</div>
          <div>
            {
              isShowInput ? (
                <FormItem className="form_item_input">
                  {
                    getFieldDecorator(`num[${record?.[`${rowKey}`]}]`, {
                      rules: [
                        { required: true, message: '请输入数量' },
                      ],
                      initialValue: record?.num,
                    })(
                      <InputNumber min={0} placeholder="请输入数量" onChange={this.handleInputNumberChange} onClick={(e) => { e.stopPropagation(); }} />
                    )
                  }
                </FormItem>
              ) : null
            }

          </div>
        </div>
      </div>
    );
  }
}

export default SearchShowItem;
