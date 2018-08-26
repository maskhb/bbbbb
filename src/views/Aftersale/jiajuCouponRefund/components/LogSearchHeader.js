/*
 * @Author: fuanzhao
 * @Date: 2018-04-08 16:17:48
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-09 16:20:54
 *
 * 订单列表搜索组件
 */

import React, { PureComponent } from 'react';
import { Select, Input } from 'antd';

import { Search } from 'components/PanelList';


import { transformSearchParam } from '../../transform';


const SelectOption = Select.Option;
const SearchItem = Search.Item;

class SearchHeader extends PureComponent {
  static defaultProps = {};

  state = {
    // 搜索选项行布局设置 整行为24
    labelCol: {
      sm: 24,
      md: 6,
    },
  }

  componentDidMount() {
    // 初始化调用
    this.search.handleSearch();
  }

  /**
   * 返回Select元素的公共方法
   */
  getSearchOptionsElm = (options = [], isMore = false, placeholder = '全部') => {
    // const searchOptions = (isMore ? options : getSearchOptions(options)) || [];

    const params = isMore ? {
      mode: 'multiple',
    } : {};

    return (
      <Select allowClear placeholder={placeholder} {...params}>
        {
          options.map((item) => {
            return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
          })
        }
      </Select>
    );
  }

  /**
   * 搜索回调
   */
  handleSearch = async (values) => {
    const { dispatch } = this.props;
    const params = transformSearchParam(values);
    await dispatch({
      type: 'jiajuCoupon/logList',
      payload: params,
    });
  }


  render() {
    const { searchDefault } = this.props;
    const { labelCol } = this.state;

    return (
      <React.Fragment>
        <Search
          {...this.props}
          ref={(inst) => { this.search = inst; }}
          searchDefault={searchDefault}
          onSearch={this.handleSearch}
        >

          <SearchItem {...labelCol} label="支付单号" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('payNo', {
              })(
                <Input placeholder="请输入子订单编号" />
              )
            )
          }
          </SearchItem>
          <SearchItem {...labelCol} label="订单编号" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('orderAliasCode', {
              })(
                <Input maxLength={30} placeholder="请输入母订单编号" />
              )
            )
          }
          </SearchItem>
          <SearchItem {...labelCol} label="退款申请ID" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('applyId', {
              })(
                <Input maxLength={30} placeholder="请输入" />
              )
            )
          }
          </SearchItem>
        </Search>
      </React.Fragment>
    );
  }
}

export default SearchHeader;
