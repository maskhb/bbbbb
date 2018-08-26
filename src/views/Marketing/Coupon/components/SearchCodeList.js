
import React, { PureComponent } from 'react';
import { Select } from 'antd';
import Input from 'components/input/DecorateInput';
import { Search } from 'components/PanelList';

import {
  couponCodeStatusOptions,
} from '../../attr';

const SelectOption = Select.Option;
const SearchItem = Search.Item;

class SearchCodeHeader extends PureComponent {
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
    this.codeSum();
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
    const { id: couponId } = this.props?.match?.params;
    await dispatch({
      type: 'marketing/couponCodeList',
      payload: {
        couponId,
        ...values,
      },
    });
  }

  codeSum = async () => {
    const { dispatch } = this.props;
    const { id: couponId } = this.props?.match?.params;
    await dispatch({
      type: 'marketing/couponCount',
      payload: {
        couponId,
      },
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
        <SearchItem {...labelCol} label="券码" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('couponCode', {
              })(
                <Input placeholder="请输入" />
              )
            )
          }
        </SearchItem>
        <SearchItem {...labelCol} label="状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('status', {
              })(
                this.getSearchOptionsElm(couponCodeStatusOptions, false)
              )
            )
          }
        </SearchItem>
        <SearchItem {...labelCol} label="用户" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('userPhone', {
              })(
                <Input placeholder="请输入手机号码" />
              )
            )
          }
        </SearchItem>
        <SearchItem {...labelCol} label="订单编号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderId', {
              })(
                <Input placeholder="请输入" />
              )
            )
          }
        </SearchItem>
      </Search>
    );
  }
}

export default SearchCodeHeader;
