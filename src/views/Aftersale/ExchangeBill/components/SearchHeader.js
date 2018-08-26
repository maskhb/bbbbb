/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:19:38
 * @Last Modified by: jone
 * @Last Modified time: 2018-7-8
 *
 * 退货单列表搜索
 */


import React, { PureComponent } from 'react';
import { Select, DatePicker } from 'antd';
import ProjectInput from 'components/ProjectInput/business';
import Input from 'components/input/DecorateInput';

import { Search } from 'components/PanelList';

import {
  warehouseStatusOptions,
} from '../../attr';

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
      type: 'aftersale/queryReturnExchangeList',
      payload: {
        ...values,
        serviceTypeList: [2],
      },
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
    const { searchDefault, loading } = this.props;
    const { labelCol, rangePickerStyle } = this.state;

    return (
      <Search
        {...this.props}
        ref={(inst) => { this.search = inst; }}
        searchDefault={searchDefault}
        onSearch={this.handleSearch}
        queryBtnLoading={loading}
      >

        <SearchItem {...labelCol} label="订单编号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('orderSn', {
              })(
                <Input placeholder="请输入订单号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="退货单号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('returnSn', {
              })(
                <Input placeholder="请输入退货单号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="换货子订单号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('exchangeOrderSn', {
              })(
                <Input placeholder="请输入换货子订单号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="所属商家" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('merchantName', {
              })(
                <Input placeholder="请输入商家名称" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="所属厂家" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('factoryName', {
              })(
                <Input placeholder="请输入厂家名称" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="申请时间" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('applyTime', {
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

        <SearchItem {...labelCol} label="换货母订单号" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('exchangeParentOrderSn', {
              })(
                <Input placeholder="请输入换货母订单号" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="入库状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('returnStatusList', {
              })(
                this.getSearchOptionsElm(warehouseStatusOptions, true)
              )
            )
          }
        </SearchItem>


      </Search>
    );
  }
}

export default SearchHeader;
