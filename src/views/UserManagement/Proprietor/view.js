import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import { Card, Button, Input, Select, Radio, DatePicker, Divider, Modal } from 'antd';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import getColumns from './columns'; 
import {orgId as getOrgId} from 'utils/getParams';

@connect(({ proprietor, loading, }) => ({
  proprietor,
  loading: loading.models.proprietor,
}))
class view extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
    defaultProps: {
    },
    pageInfo: {
      currPage: 1,
      pageSize: 10,
    },
  }

  componentDidMount() { 
    this.doSearch();
  }

  handleSearch(values = {}) { 
    this.doSearch(values);
  }

  // 响应搜索请求
  doSearch = async ({ currPage, pageSize, ...query } = this.state.pageInfo) => {
    const { dispatch } = this.props;
    const roomRateQueryVO = {
      roomOwnerVO:{
        ...query
      },      
      currPage,
      orgId:getOrgId(),
      pageSize: pageSize || 10,
    };

    await dispatch({
      type: 'proprietor/roomOwnerList',
      payload: { roomRateQueryVO },
    });

    this.table?.cleanSelectedKeys();
  } 

  render() {
    const { loading, searchDefault, proprietor } = this.props;
    // debugger;
    return (
      <PageHeaderLayout>
        <Card>
          <h2>
            <span>业主管理</span> 
            <span style={{ float: 'right' }}>
            <Authorized authority={[permission.PMS_USERMANAGEMENT_PROPRIETOR_ADD]}>
              <Button type="gray" href="#/usermanagement/proprietor/add">+ 新增业主</Button>
              </Authorized>
            </span>
          </h2>
          <Divider />
          <PanelList>
            <Search
              ref={(inst) => {
              this.search = inst;
            }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch.bind(this)}
            >
              <Search.Item label="业主姓名" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('name')(
                      <Input placeholder="请输入业主姓名" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="手机号码" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('phone')(
                      <Input placeholder="请输入手机号码" />
                    )
                  )
                }
              </Search.Item>
            </Search> 

            <Table
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={proprietor?.proprietorList?.dataList}
              pagination={proprietor?.proprietorList?.pagination}
              disableRowSelection
              rowKey="id"
              ref={(inst) => {
                this.table = inst;
              }}
              loading={loading}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default view;
