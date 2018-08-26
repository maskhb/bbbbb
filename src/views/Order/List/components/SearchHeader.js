/*
 * @Author: wuhao
 * @Date: 2018-04-08 16:17:48
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-05 15:12:55
 *
 * 订单列表搜索组件
 */

import React, { PureComponent } from 'react';
import { Select, DatePicker } from 'antd';
import { parse } from 'qs';
import moment from 'moment';
import ProjectInput from 'components/ProjectInput/business';
import SelectPaymentMethod from 'components/SelectPaymentMethod/business';
import SelectRegion from 'components/SelectRegion/business';
import Input from 'components/input/DecorateInput';

import { Search } from 'components/PanelList';

import {
  payStatusOptions,
  orderSourceOptions,
  orderStatusSelectOptions,
  invoiceTypeOptions,
  // deliveryMethodOptions,
  needInvoiceTypeOptions,
  whenExcessTypeOptions,

  // getStartTimeAndEndTimeFor6Months,
} from '../../attr';

import { transformSearchParam } from '../../transform';

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
      type: 'orders/list',
      payload: params,
    });

    await dispatch({
      type: 'orders/queryOrdeListTotalCount',
      payload: params,
    });
  }

  /**
   * 重置
   */
  // handleFormReset = (form) => {
  //   form.resetFields();
  //   form.setFields({ orderTime: {
  //     value: getStartTimeAndEndTimeFor6Months(),
  //   } });

  //   this.search.handleSearch();
  // }

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

  /**
   * 校验 -- 选择所在项目
   */
  validatorProjectSelect = (rule, value, callback) => {
    const [,, projectId] = value || [];
    if (value && value.length > 0 && !projectId) {
      callback('请选择所在项目');
    }
    callback();
  }

  render() {
    const { searchDefault } = this.props;
    const { labelCol, rangePickerStyle } = this.state;

    const { phone: initPhone } = parse(this.props?.location?.search, {
      ignoreQueryPrefix: true,
    }) || {};

    return (
      <Search
        {...this.props}
        ref={(inst) => { this.search = inst; }}
        searchDefault={searchDefault}
        onSearch={this.handleSearch}
        // onFormReset={this.handleFormReset}
      >

        <SearchItem {...labelCol} label="订单号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderSn', {
              })(
                <Input placeholder="请输入订单号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="用户手机号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('userMobile', {
                initialValue: initPhone || '',
              })(
                <Input placeholder="请输入用户手机号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="商家名称" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('merchantName', {
              })(
                <Input placeholder="请输入商家名称" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="收货人手机号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('consigneeMobile', {
              })(
                <Input placeholder="请输入收货人手机号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="商品名称" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('goodsName', {
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
              })(
                this.getSearchOptionsElm(needInvoiceTypeOptions)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="所在项目" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('project', {
                rules: [
                  { validator: this.validatorProjectSelect },
                ],
              })(
                <ProjectInput style={{ width: '100%' }} placeholder="全部项目" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="订单来源" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderSourceList', {
              })(
                this.getSearchOptionsElm(orderSourceOptions, true)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="订单状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderStatusList', {
              })(
                this.getSearchOptionsElm(orderStatusSelectOptions, true)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="支付状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('payStatusList', {
              })(
                this.getSearchOptionsElm(payStatusOptions, true)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="下单时间" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderTime', {
                initialValue: searchDefault.orderTime,
                rules: [
                  // { required: true, message: '请选择下单时间' },
                  { validator: this.validatorLimit6Months }],
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
              form.getFieldDecorator('paymentMethodCodeList', {
              })(
                <SelectPaymentMethod mode="multiple" type={0} allowClear placeholder="全部" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="配送地区">
          {
            ({ form }) => (
              form.getFieldDecorator('region', {
              })(
                <SelectRegion placeholder="全部地区" depth={3} />
              )
            )
          }
        </SearchItem>

        {/* <SearchItem {...labelCol} label="配送方式">
          {
            ({ form }) => (
              form.getFieldDecorator('deliveryMethod', {
              })(
                this.getSearchOptionsElm(deliveryMethodOptions)
              )
            )
          }
        </SearchItem> */}

        <SearchItem {...labelCol} label="收货人">
          {
            ({ form }) => (
              form.getFieldDecorator('consigneeName', {
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
              form.getFieldDecorator('excessPay', {
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
