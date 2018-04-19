/*
 * @Author: wuhao
 * @Date: 2018-04-08 16:17:48
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-10 10:13:25
 *
 * 订单列表搜索组件
 */

import React, { PureComponent } from 'react';
import { Input, Select, DatePicker } from 'antd';
import moment from 'moment';

import { Search } from '../../../../components/PanelList';

import { getSearchOptions, payTypeOptions, payStatusOptions, orderSourceOptions, orderStatusOptions, invoiceTypeOptions, deliveryMethodOptions, needInvoiceTypeOptions, whenExcessTypeOptions } from '../attr';

const SelectOption = Select.Option;
const { RangePicker } = DatePicker;
const SearchItem = Search.Item;

class SearchHeader extends PureComponent {
  static defaultProps = {};

  state = {
    // 搜索选项行布局设置 整行为24
    labelCol: {
      sm: 24,
      md: 6,
    },
    // 日期组件样式 -- 用于解决showTime=true时，日期控件宽度不自动缩放的bug
    rangePickerStyle: {
      style: {
        width: 'auto',
      },
    },
  }

  componentDidMount() {
    // 初始化调用
    this.search.handleSearch();
  }

  /**
   * 返回Select元素的公共方法
   */
  getSearchOptionsElm = (options, isMore = false) => {
    const searchOptions = (isMore ? options : getSearchOptions(options)) || [];

    const params = isMore ? {
      mode: 'multiple',
      placeholder: '全部',
      allowClear: true,
    } : {};

    return (
      <Select {...params}>
        {
          searchOptions.map((item) => {
            return <SelectOption value={item.value}>{item.label}</SelectOption>;
          })
        }
      </Select>
    );
  }

  /**
   * 搜索回调
   */
  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'orders/list',
      payload: values,
    });
  }

  /**
   * 校验 -- 时间不能超过6个月
   */
  validatorLimit6Months = (rule, value, callback) => {
    if (value && value.length > 1) {
      const startTime = moment(value[0]);
      const endTime = moment(value[1]);
      const months = endTime.diff(startTime, 'months', true);
      if (months > 6) {
        callback('每次可搜索6个月订单记录，请重新选择');
      }
    }
    callback();
  }

  render() {
    const { searchDefault } = this.props;
    const { labelCol, rangePickerStyle } = this.state;

    return (
      <Search
        {...this.props}
        ref={(inst) => { this.search = inst; }}
        searchDefault={searchDefault}
        onSearch={this.handleSearch}
      >

        <SearchItem {...labelCol} label="订单号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderNo', {
              })(
                <Input placeholder="请输入订单号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="用户手机号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('phoneNo', {
              })(
                <Input placeholder="请输入用户手机号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="商家名称" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('businessName', {
              })(
                <Input placeholder="请输入商家名称" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="收货人手机号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('consigneePhoneNo', {
              })(
                <Input placeholder="请输入收货人手机号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="商品名称" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('productName', {
              })(
                <Input placeholder="请输入商品名称" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="需要发票" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('needInvoice', {
                initialValue: searchDefault.needInvoice,
              })(
                this.getSearchOptionsElm(needInvoiceTypeOptions)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="所在项目" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('projectName', {
                initialValue: searchDefault.projectName,
              })(
                <Select>
                  <SelectOption value="" >全部项目</SelectOption>
                </Select>

              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="订单来源" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderSource', {
                initialValue: searchDefault.orderSource,
              })(
                this.getSearchOptionsElm(orderSourceOptions, true)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="订单状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderStatus', {
                initialValue: searchDefault.orderStatus,
              })(
                this.getSearchOptionsElm(orderStatusOptions, true)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="支付状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('payStatus', {
                initialValue: searchDefault.payStatus,
              })(
                this.getSearchOptionsElm(payStatusOptions, true)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="下单时间" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('createTime', {
                initialValue: searchDefault.createTime,
                rules: [{
                  validator: this.validatorLimit6Months,
                }],
              })(
                <RangePicker
                  {...rangePickerStyle}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="支付方式">
          {
            ({ form }) => (
              form.getFieldDecorator('payType', {
                initialValue: searchDefault.payType,
              })(
                this.getSearchOptionsElm(payTypeOptions, true)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="配送地区">
          {
            ({ form }) => (
              form.getFieldDecorator('address', {
                initialValue: searchDefault.address,
              })(
                <Select>
                  <SelectOption value="">全部地区</SelectOption>
                </Select>
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="配送方式">
          {
            ({ form }) => (
              form.getFieldDecorator('shipType', {
                initialValue: searchDefault.shipType,
              })(
                this.getSearchOptionsElm(deliveryMethodOptions)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="收货人">
          {
            ({ form }) => (
              form.getFieldDecorator('receiver', {
              })(
                <Input placeholder="请输入收货人" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="发票类型">
          {
            ({ form }) => (
              form.getFieldDecorator('invoiceType', {
                initialValue: searchDefault.invoiceType,
              })(
                this.getSearchOptionsElm(invoiceTypeOptions)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="发票抬头">
          {
            ({ form }) => (
              form.getFieldDecorator('invoiceTitle', {
              })(
                <Input placeholder="请输入发票抬头" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="是否超额">
          {
            ({ form }) => (
              form.getFieldDecorator('excess', {
                initialValue: searchDefault.excess,
              })(
                this.getSearchOptionsElm(whenExcessTypeOptions)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="支付时间">
          {
            ({ form }) => (
              form.getFieldDecorator('payTime', {
                initialValue: searchDefault.payTime,
                rules: [{
                  validator: this.validatorLimit6Months,
                }],
              })(
                <RangePicker
                  {...rangePickerStyle}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="完成时间">
          {
            ({ form }) => (
              form.getFieldDecorator('finishTime', {
                initialValue: searchDefault.finishTime,
                rules: [{
                  validator: this.validatorLimit6Months,
                }],
              })(
                <RangePicker
                  {...rangePickerStyle}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                />
              )
            )
          }
        </SearchItem>


      </Search>
    );
  }
}

export default SearchHeader;
