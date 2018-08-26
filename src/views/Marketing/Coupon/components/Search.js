
import React, { PureComponent } from 'react';
import { Select } from 'antd';
import Input from 'components/input/DecorateInput';
import { Search } from 'components/PanelList';


import {
  scopeTypeOptions,
  couponStatusOptions,
} from '../../attr';

const SelectOption = Select.Option;
const SearchItem = Search.Item;

class SearchHeader extends PureComponent {
  static defaultProps = {};

  state = {
    // 搜索选项行布局设置 整行为24
    labelCol: {
      sm: 24,
      md: 5,
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
      type: 'marketing/couponList',
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
        <SearchItem {...labelCol} label="优惠券名称" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('couponName', {
              })(
                <Input placeholder="请输入" />
              )
            )
          }
        </SearchItem>
        <SearchItem {...labelCol} label="适用范围" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('scopeType', {
              })(
                this.getSearchOptionsElm(scopeTypeOptions, false)
              )
            )
          }
        </SearchItem>
        <SearchItem {...labelCol} label="状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('status', {
              })(
                this.getSearchOptionsElm(couponStatusOptions, false)
              )
            )
          }
        </SearchItem>
      </Search>
    );
  }
}

export default SearchHeader;
