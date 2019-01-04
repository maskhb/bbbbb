import React, { PureComponent } from 'react';

import { DatePicker } from 'antd';
import { Search } from 'components/PanelList';

const { Item: SearchItem } = Search;
const { RangePicker } = DatePicker;

class SearchHeader extends PureComponent {
  static defaultProps = {};

  state = {
    // 搜索选项行布局设置 整行为24
    labelCol: {
      sm: 26,
      md: 8,
    },

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
   * 搜索回调
   */
  handleSearch = async (values) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'analysisTable/queryList',
      payload: values,
    });
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
        <SearchItem {...labelCol} label="营业日期" simple>
          {
              ({ form }) => (
                form.getFieldDecorator('_businessTime', {
                })(
                  <RangePicker
                    {...rangePickerStyle}
                    showTime={false}
                    format="YYYY-MM-DD"
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
