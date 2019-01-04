/*
 * @Author: wuhao
 * @Date: 2018-09-20 10:40:54
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-27 09:42:47
 *
 * 基础设置 - 收款方式设置 - 搜索栏
 */

import React, { PureComponent } from 'react';

import { Select } from 'antd';
import { Search } from 'components/PanelList';
import Input from 'components/input/DecorateInput';
import { stateAvailableOrUnavailable } from 'utils/attr/public';

const { Item: SearchItem } = Search;
const { Option: SelectOption } = Select;

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
    await dispatch({
      type: 'paymentMethod/page',
      payload: values,
    });
  }


  render() {
    const { searchDefault, loading } = this.props;
    const { labelCol } = this.state;
    return (
      <Search
        {...this.props}
        ref={(inst) => { this.search = inst; }}
        searchDefault={searchDefault}
        onSearch={this.handleSearch}
        queryBtnLoading={loading}
      >
        <SearchItem {...labelCol} label="收款方式" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('paymentMethodName', {
              })(
                <Input placeholder="请输入名称" />
              )
            )
            }
        </SearchItem>

        <SearchItem {...labelCol} label="状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('status', {
              })(
                this.getSearchOptionsElm(stateAvailableOrUnavailable)
              )
            )
          }
        </SearchItem>
      </Search>
    );
  }
}

export default SearchHeader;
