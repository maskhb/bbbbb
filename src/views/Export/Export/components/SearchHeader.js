import React, { PureComponent } from "react";
import { Select, DatePicker } from "antd";
import moment from "moment";

import { Search } from "components/PanelList";
import Input from "components/input/DecorateInput";

import { moduleOptions } from "utils/attr/exportFile";
import cookie from "cookies-js";

const SelectOption = Select.Option;
const { RangePicker } = DatePicker;
const SearchItem = Search.Item;

class SearchHeader extends PureComponent {
  static defaultProps = {};

  state = {
    // 搜索选项行布局设置 整行为24
    labelCol: {
      sm: 24,
      md: 8
    },
    // 日期组件样式 -- 用于解决showTime=true时，日期控件宽度不自动缩放的bug
    rangePickerStyle: {
      style: {
        width: "auto"
      }
    }
  };

  componentDidMount() {
    // 初始化调用
    this.search.handleSearch();
  }

  /**
   * 返回Select元素的公共方法
   */
  getSearchOptionsElm = (
    options = [],
    isMore = false,
    placeholder = "全部"
  ) => {
    const params = isMore
      ? {
          mode: "multiple"
        }
      : {};

    return (
      <Select allowClear placeholder={placeholder} {...params}>
        {options.map(item => {
          return (
            <SelectOption key={item.value} value={item.value}>
              {item.label}
            </SelectOption>
          );
        })}
      </Select>
    );
  };

  /**
   * 搜索回调
   */
  handleSearch = async values => {
    const { dispatch } = this.props;
    const postData = Object.assign({}, values);
    postData.page = {};
    if (postData.currPage) {
      postData.page.currentPage = postData.currPage;
      delete postData.currPage;
    }
    if (postData.pageSize) {
      postData.page.pageSize = postData.pageSize;
      delete postData.pageSize;
    }
    if (values.exportTime && values.exportTime.length === 2) {
      postData.startTime = moment(values.exportTime?.[0]).valueOf();
      postData.endTime = moment(values.exportTime?.[1]).valueOf();
      delete postData.exportTime;
    }
    if (postData.prefix) {
      postData.prefix = [postData.prefix];
    } else {
      postData.prefix = [];
      moduleOptions.map(v => {
        postData.prefix.push(v.value);
        return "";
      });
    }

    postData.loginType = 7;
    postData.token = cookie.get("x-manager-token");
    await dispatch({
      type: "exportFile/queryList",
      payload: postData
    });
  };

  render() {
    const { searchDefault, loading } = this.props;
    const { labelCol, rangePickerStyle } = this.state;
    const { prefix } = this.props?.match?.params;
    return (
      <Search
        {...this.props}
        ref={inst => {
          this.search = inst;
        }}
        searchDefault={searchDefault}
        onSearch={this.handleSearch}
        queryBtnLoading={loading}
      >
        <SearchItem {...labelCol} label="导出文件名" simple>
          {({ form }) =>
            form.getFieldDecorator("fileName", {})(
              <Input placeholder="请输入文件名" />
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="导出模块" simple>
          {({ form }) =>
            form.getFieldDecorator("prefix", {
              initialValue: prefix ? parseInt(prefix, 10) : ""
            })(this.getSearchOptionsElm(moduleOptions))
          }
        </SearchItem>

        <SearchItem {...labelCol} label="导出时间段" simple>
          {({ form }) =>
            form.getFieldDecorator("exportTime", {})(
              <RangePicker
                {...rangePickerStyle}
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={["开始时间", "结束时间"]}
              />
            )
          }
        </SearchItem>
      </Search>
    );
  }
}

export default SearchHeader;
