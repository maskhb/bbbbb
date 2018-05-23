import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import getColumns from './columns';
import { listToOptions, optionsToHtml } from '../../../components/DataTransfer';

const getSearchOptions = (options) => {
  return [
    {
      label: '全部',
      value: '',
    },
    ...options,
  ];
};

const openStatus = [
  {
    label: '启用',
    value: 1,
  },
  {
    label: '禁用',
    value: 2,
  },
];

@connect(({ ad, adPos, loading }) => ({
  ad,
  adPos,
  loading,
}))
export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {
      auditStatus: 2,
      onlineStatus: 1,
    },
  };

  state = {
    labelCol: {
      sm: 24,
      md: 5,
    },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'adPos/list',
      payload: {
        pageInfo: {
          currPage: -1,
          pageSize: -1,
        },
      },
    });

    this.search.handleSearch();
  }
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
            return <Select.Option value={item.value}>{item.label}</Select.Option>;
          })
        }
      </Select>
    );
  }
  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const params = {
      ...values,
    };

    return dispatch({
      type: 'ad/list',
      payload: params,
    });
  }

  render() {
    const { ad, loading, searchDefault, adPos: { list = [] } = {} } = this.props;
    const { labelCol } = this.state;

    const adPosOptions = listToOptions(list?.list || [], 'posId', 'posName');
    // console.log('ad', ad);
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              // searchDefault={searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item {...labelCol} label="广告项名称" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('adName', {
                    })(
                      <Input placeholder="请输入" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item {...labelCol} label="广告位置" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('posId', {
                    })(
                      <Select placeholder="请选择">
                        {optionsToHtml(getSearchOptions(adPosOptions))}
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item {...labelCol} label="开启状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('openStatus', {
                    })(
                      <Select placeholder="请选择">
                        {optionsToHtml(getSearchOptions(openStatus))}
                      </Select>
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <Authorized authority={[permission.OPERPORT_JIAJU_BANNERLIST_ADD]}>
                <a href="#/pagetable/aditem/add">
                  <Button icon="plus" type="primary">新加广告项</Button>
                </a>
              </Authorized>
            </Batch>

            <Table
              loading={loading.models.ad}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault, loading.models.ad)}
              dataSource={ad?.list?.list}
              pagination={ad?.list?.pagination}
              rowKey="adItemId"
              disableRowSelection
            />
          </PanelList>

        </Card>
      </PageHeaderLayout>
    );
  }
}
