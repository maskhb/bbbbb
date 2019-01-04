/*
 *
 * 房间管理 - 房型管理 - 搜索栏
 */

import React, { PureComponent } from "react";
import { connect } from "dva";

import { Select } from "antd";
import { Search } from "components/PanelList";
import Input from "components/input/DecorateInput";
import SelectGoodSubjects from "components/SelectGoodSubjects";
import { stateEnabledOrDisableOptions } from "utils/attr/public";
import { orgId } from "utils/getParams";

const { Item: SearchItem } = Search;
const { Option: SelectOption } = Select;

@connect(({ room }) => ({
  room
}))
class SearchHeader extends PureComponent {
  static defaultProps = {};

  state = {
    // 搜索选项行布局设置 整行为24
    labelCol: {
      sm: 24,
      md: 8
    }
  };

  componentDidMount() {
    // 初始化调用
    this.search.handleSearch();
    this.SelDataRows();
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
      <Select
        allowClear
        placeholder={placeholder} 
        showSearch
        optionFilterProp="children"  
        {...params}
      >
        {options.map(item => {
          return (
            <SelectOption key={item.value} value={item.value} title={item.label}>
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
    await dispatch({
      type: "room/page",
      payload: values
    });
  };

  SelDataRows = async () => {
    const { dispatch } = this.props;
    await dispatch({
      type: "room/buildingData",
      payload: {
        orgId,
        currPage: 1,
        pageSize: 9999
      }
    });

    await dispatch({
      type: "room/floorData",
      payload: {
        orgId,
        currPage: 1,
        pageSize: 9999
      }
    });

    await dispatch({
      type: "room/tagData",
      payload: {
        orgId,
        currPage: 1,
        pageSize: 9999
      }
    });

    await dispatch({
      type: "room/roomTypeData",
      payload: {
        orgId,
        currPage: 1,
        pageSize: 9999
      }
    });
  };
  render() {
    const { searchDefault, room, loading } = this.props;
    const { buildingData, floorData, tagData, roomTypeData } = room;
    const { labelCol } = this.state;

    const buildingDataSource = (buildingData?.list || []).map(item => {
      return {
        label: item?.buildingName,
        value: item?.buildingId
      };
    });

    const floorDataSource = (floorData?.list || []).map(item => {
      return {
        label: item?.floorName,
        value: item?.floorId
      };
    });

    const tagDataSource = (tagData?.list || []).map(item => {
      return {
        label: item?.name,
        value: item?.tagId
      };
    });

    const roomTypeDataSource = (roomTypeData?.list || []).map(item => {
      return {
        label: item?.roomTypeName,
        value: item?.roomTypeId
      };
    });
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
        <SearchItem {...labelCol} label="房间号" simple>
          {({ form }) =>
            form.getFieldDecorator("roomNo", {})(
              <Input placeholder="请输入名称" />
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="楼栋" simple>
          {({ form }) =>
            form.getFieldDecorator("buildingId", {})(
              this.getSearchOptionsElm(buildingDataSource)
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="楼层" simple>
          {({ form }) =>
            form.getFieldDecorator("floorId", {})(
              this.getSearchOptionsElm(floorDataSource)
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="标签" simple>
          {({ form }) =>
            form.getFieldDecorator("roomTagId", {})(
              this.getSearchOptionsElm(tagDataSource)
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="房型" simple>
          {({ form }) =>
            form.getFieldDecorator("roomTypeId", {})(
              this.getSearchOptionsElm(roomTypeDataSource)
            )
          }
        </SearchItem>

        <SearchItem {...labelCol} label="状态" simple>
          {({ form }) =>
            form.getFieldDecorator("_status", {})(
              this.getSearchOptionsElm(stateEnabledOrDisableOptions)
            )
          }
        </SearchItem>
      </Search>
    );
  }
}

export default SearchHeader;
