import React, { PureComponent } from 'react';
import { Select, DatePicker } from 'antd';

import { Search } from 'components/PanelList';
import Input from 'components/input/DecorateInput';
import { repairStatusOptions, repairTypeOptions } from 'utils/attr/repair';
import moment from 'moment';

// const selectRepairStatusOptions = repairStatusOptions.slice(0);
// const selectRepairTypeOptions = repairTypeOptions.slice(0);
// selectRepairStatusOptions.unshift({ label: '全部', value: 0 });
// selectRepairTypeOptions.unshift({ label: '全部', value: 0 });

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
      <Select showSearch allowClear optionFilterProp="children" placeholder={placeholder} {...params}>
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
    const postData = {
      repairCondition: values,
    };
    if (values.currPage) {
      postData.currPage = values.currPage;
      delete postData.repairCondition.currPage;
    }
    if (values.pageSize) {
      postData.pageSize = values.pageSize;
      delete postData.repairCondition.pageSize;
    }
    if (values.repairTime && values.repairTime.length === 2) {
      postData.repairCondition.startTime = moment(values.repairTime?.[0]).valueOf();
      postData.repairCondition.endTime = moment(values.repairTime?.[1]).valueOf();
      delete postData.repairCondition.repairTime;
    } else {
      delete postData.repairCondition.startTime;
      delete postData.repairCondition.endTime;
      delete postData.repairCondition.repairTime;
    }

    const { dispatch } = this.props;
    await dispatch({
      type: 'houseStatus/queryRepairList',
      payload: postData,
    });
  };

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

        <SearchItem {...labelCol} label="状态" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('status', {
              })(
                this.getSearchOptionsElm(repairStatusOptions)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="类型" simple>
          {

            ({ form }) => (
              form.getFieldDecorator('type', {
              })(
                this.getSearchOptionsElm(repairTypeOptions)
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="报修内容" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('content', {
              })(
                <Input placeholder="请输入报修内容" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="报修人" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('createdName', {
              })(
                <Input placeholder="请输入报修人" />
              )
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="报修时间" simple>
          {
            ({ form }) => (
              form.getFieldDecorator('repairTime', {
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
