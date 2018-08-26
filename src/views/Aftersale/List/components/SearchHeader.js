/*
 * @Author: wuhao
 * @Date: 2018-04-08 16:17:48
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-09 16:20:54
 *
 * 订单列表搜索组件
 */

import React, { PureComponent } from 'react';
import { Select, DatePicker } from 'antd';
import MonitorInput from 'components/input/MonitorInput';
import ProjectInput from 'components/ProjectInput/business';

import { Search } from 'components/PanelList';

import qs from 'qs';

import BatchSearchList from './BatchSearchList';


import {
  applyServiceTypeOptions,
  afterSaleStatusOptions,
  closeStatusOptions,
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

  getSearchQuery() {
    return qs.parse(this.props?.location?.search, {
      ignoreQueryPrefix: true,
    }) || {};
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
      type: 'aftersale/queryApplyList',
      payload: params,
    });
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

    return (
      <React.Fragment>
        <Search
          {...this.props}
          ref={(inst) => { this.search = inst; }}
          searchDefault={searchDefault}
          onSearch={this.handleSearch}
        >

          <SearchItem {...labelCol} label="子订单编号" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('orderSn', {
                initialValue: this.getSearchQuery()?.orderSn,
              })(
                <MonitorInput maxLength={30} placeholder="请输入子订单编号" />
              )
            )
          }
          </SearchItem>
          <SearchItem {...labelCol} label="母订单编号" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('parentOrderSn', {
              })(
                <MonitorInput maxLength={30} placeholder="请输入母订单编号" />
              )
            )
          }
          </SearchItem>

          <SearchItem {...labelCol} label="售后申请单号" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('applyOrderSn', {
              })(
                <MonitorInput maxLength={30} placeholder="请输入售后申请单号" />
              )
            )
          }
          </SearchItem>

          <SearchItem {...labelCol} label="所属商家" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('merchantName', {
              })(
                <MonitorInput maxLength={30} placeholder="请输入商家名称" />
              )
            )
          }
          </SearchItem>

          <SearchItem {...labelCol} label="所属厂家" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('factoryName', {
              })(
                <MonitorInput maxLength={30} placeholder="请输入厂家名称" />
              )
            )
          }
          </SearchItem>

          <SearchItem {...labelCol} label="申请时间" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('applyTime', {
                initialValue: searchDefault.applyTime,
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

          <SearchItem {...labelCol} label="申请服务类型" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('serviceTypeList', {
              })(
                this.getSearchOptionsElm(applyServiceTypeOptions, true)
              )
            )
          }
          </SearchItem>

          <SearchItem {...labelCol} label="售后状态" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('afterSaleStatusList', {
              })(
                this.getSearchOptionsElm(afterSaleStatusOptions, true)
              )
            )
          }
          </SearchItem>

          <SearchItem {...labelCol} label="关闭状态" simple>
            {
            ({ form }) => (
              form.getFieldDecorator('shutDownStatusList', {
              })(
                this.getSearchOptionsElm(closeStatusOptions, true)
              )
            )
          }
          </SearchItem>
        </Search>
        <BatchSearchList {...this.props} onFetch={() => this.search.handleSearch()} />
      </React.Fragment>
    );
  }
}

export default SearchHeader;
