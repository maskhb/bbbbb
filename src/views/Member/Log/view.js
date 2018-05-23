import PageHeaderLayout from 'layouts/PageHeaderLayout';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import moment from 'moment';
// import { Link } from 'dva/router';
import PanelList, { Search, Table } from 'components/PanelList';
import {
  Card,
  Input,
  DatePicker,
  Select,
} from 'antd';
import getColumns from '../List/column';
import { transLogParams } from '../const';

const { RangePicker } = DatePicker;
@connect(({ member, loading }) => ({
  /* redux传入 @:装饰器 */
  member,
  loading: loading.models.member,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {},
  };

  state = {
    rangePickerStyle: {
      style: {
        width: 'auto',
      },
    },
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearchDateChange = (date, dateString) => {
    return { date, dateString };
  }

  handleSearch = (values) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'member/log',
      payload: transLogParams(values),
    });
  }

  validatorLimit6Months = (rule, value, callback) => {
    if (value && value.length > 1) {
      const startRegTime = moment(value[0]);
      const endRegTime = moment(value[1]);
      const months = endRegTime.diff(startRegTime, 'months', true);
      if (months > 6) {
        callback('每次可搜索6个月订单记录，请重新选择');
      }
    }
    callback();
  }

  render() {
    const { loading, member, searchDefault } = this.props;
    const { handleSearch, validatorLimit6Months } = this;
    const { rangePickerStyle } = this.state;
    const { Option } = Select;
    const { accountId: initLoginId } = parse(this.props?.location?.search, {
      ignoreQueryPrefix: true,
    }) || {};

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => {
                this.search = inst;
              }}
              searchDefault={searchDefault}
              onSearch={handleSearch}
              className="searchArea"
            >
              <Search.Item md={6} label="操作人" simple className="col-6">
                {
                  ({ form }) => (
                    form.getFieldDecorator('operatorUserId', {
                    })(<Input placeholder="" type="number" />))
                }
              </Search.Item>
              <Search.Item md={6} label="会员" simple>
                {({ form }) => (form.getFieldDecorator('memberUserId', {
                  initialValue: initLoginId || null,
                })(<Input placeholder="" type="number" />))
                }
              </Search.Item>
              <Search.Item md={6} label="操作行为" simple>
                {({ form }) => (form.getFieldDecorator('operateType', {
                })(
                  <Select onChange={() => ''}>
                    <Option value="0">全部</Option>
                    <Option value="4">新增会员</Option>
                    <Option value="5">冻结会员</Option>
                    <Option value="6">激活会员</Option>
                    <Option value="7">编辑会员</Option>
                    <Option value="8">修改密码</Option>
                    <Option value="9">导入会员</Option>
                  </Select>
                ))
                }
              </Search.Item>
              <Search.Item label="操作时间" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('operateTime', {
                      initialValue: searchDefault.operateTime,
                      rules: [{
                        validator: validatorLimit6Months,
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
              </Search.Item>
            </Search>
            <Table
              loading={loading}
              bordered
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault).log}
              dataSource={member?.log?.list}
              pagination={member?.log?.pagination}
              footer={member?.log?.pagination?.total}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
