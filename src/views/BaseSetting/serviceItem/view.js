import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Input, Select } from 'antd';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Table } from 'components/PanelList';
import Authorized from 'utils/Authorized';

import { getColumns } from './columns';
import { sourceOption, statusOption } from './arr';
import { getOption } from './utils';
import { ModalNew } from './components';

const { Item } = Search;
const { Option } = Select;

@connect(({ serviceItem, loading }) => ({
  loading: loading.effects['serviceItem/page'],
  serviceItem,
}))

class ServiceItem extends PureComponent {
  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = async (values) => {
    const { serviceName, status, source, ...othors } = values;
    const { dispatch } = this.props;

    await dispatch({
      type: 'serviceItem/page',
      payload: {
        ...othors,
        serviceItemVO: {
          serviceName,
          status,
          source,
        },
      },
    });
  }

  render() {
    const { loading, serviceItem: { serviceItemPage } } = this.props;

    return (
      <PageHeaderLayout>
        <Card
          title="服务项管理"
          extra={
            <Authorized authority="PMS_BASICSETTING_SERVICEITEM_ADD" key="ModalStock">
              <ModalNew {...this.props} />
            </Authorized>
          }
        >
          <PanelList>
            <Search
              searchDefault={null}
              onSearch={this.handleSearch}
              ref={(inst) => { this.search = inst; }}
            >
              <Item label="服务名称" simple>
                {
                  ({ form: { getFieldDecorator } }) => (
                    getFieldDecorator('serviceName', {
                      initialValue: '',
                    })(
                      <Input placeholder="请输入" />
                    )
                  )
                }
              </Item>
              <Item label="状态" simple>
                {
                  ({ form: { getFieldDecorator } }) => (
                    getFieldDecorator('status', {
                      initialValue: 0,
                    })(
                      <Select>
                        { getOption(Option, statusOption) }
                      </Select>
                    )
                  )
                }
              </Item>
              <Item label="添加来源" simple>
                {
                  ({ form: { getFieldDecorator } }) => (
                    getFieldDecorator('source', {
                      initialValue: 0,
                    })(
                      <Select>
                        { getOption(Option, sourceOption) }
                      </Select>
                    )
                  )
                }
              </Item>
            </Search>
            <Table
              loading={loading}
              columns={getColumns(this)}
              dataSource={serviceItemPage?.list}
              pagination={serviceItemPage?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default ServiceItem;
