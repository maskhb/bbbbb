import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import AsyncCascader from 'components/AsyncCascader';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Button, Input, DatePicker, Select, Modal } from 'antd';
import getColumns from './columns';
import './view.less';

const { RangePicker } = DatePicker;

@connect(({ business, loading }) => ({
  /* redux传入 @:装饰器 */
  business,
  loading: loading.models.business,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    console.log(values) //eslint-disable-line
    /* Object.getOwnPropertyNames(values).forEach((key) => {
      if (Array.isArray(values[key]) && values[key].length === 1) {
        values[key] = values[key][0];
      }
    }); */
    const { dispatch } = this.props;
    return dispatch({
      type: 'business/list',
      payload: values,
    });
  }
  handleSearchDateChange=(date, dateString) => {
    return { date, dateString };
  }
  addBusiness=(rows) => {
    return rows;
  }
  handleBathOperating=(rows, type) => {
    if (rows.length) {
      Modal.confirm({
        title: '确定要批量操作',
        content: `是否对已选择的 ${rows.length}个商家 批量操作`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          this.dispatch({
            type: 'business/list',
            payload: type,
          });
        },
      });
    } else {
      Modal.warning({
        title: '提示',
        content: '请先选择商家再进行批量操作',
        okText: '确定',
        cancelText: '取消',
      });
    }
  }

  render() {
    const { loading, business, searchDefault, handleSearchDateChange } = this.props;
    // const { fileList } = this.state;
    const { Option } = Select;
    const self = this;
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
              onSearch={this.handleSearch}
              className="searchArea"
            >
              <Search.Item md={6} label="商家ID" simple className="col-6">
                {
                ({ form }) => (
                  form.getFieldDecorator('businessId', {
                  })(
                    <Input placeholder="" />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="商家名称" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('businessName', {
                  })(
                    <Input placeholder="" />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="关联厂家名称" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('assocName', {
                  })(
                    <Input placeholder="" />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="商家类型" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('merchantType', {
                  })(
                    <Select onChange={() => ''}>
                      <Option value="0">全部</Option>
                      <Option value="1">经销商</Option>
                      <Option value="2">厂家</Option>
                      <Option value="3">小商家</Option>
                    </Select>
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="商家分类" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('sort', {
                  })(
                    <AsyncCascader
                      placeholder="全部"
                      asyncType="queryCategory"
                      param={{ categoryId: 0, parentId: 0 }}
                      labelParam={{ label: 'categoryName', value: 'categoryId' }}
                      // filter={res => res.status === 1}
                    />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="经营范围" simple>
                {
              ({ form }) => (
                form.getFieldDecorator('range', {
                })(
                  <AsyncCascader
                    placeholder="全部"
                    asyncType="queryListAndHasChild"
                    labelParam={{ label: 'categoryName', value: 'categoryId' }}
                    filter={res => res.status === 1}
                  />
                )
              )
            }
              </Search.Item>
              <Search.Item md={6} label="商家状态" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('status', {
                  })(
                    <Select >
                      <Option value="0">全部</Option>
                      <Option value="1">已下架</Option>
                      <Option value="2">已上架</Option>
                      <Option value="3">已冻结</Option>
                    </Select>
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="关联项目" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('associate', {
                  })(
                    <Input placeholder="全部" />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="创建时间" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('createDate', {
                  })(
                    <RangePicker onChange={handleSearchDateChange} />
                  )
                )
              }
              </Search.Item>
              <Button
                simple
                type="primary"
                onClick={
              () => Modal.confirm({
                title: '提示',
                content: (
                  <div>
                    <p>为了查询性能及体验，我们对导出功能进行改造；</p>
                    <p>1.为了保证您的查询性能，两次导出的时间间隔请保持在5分钟以上；</p>
                    <p>2.本次导出的订单约X条，大概需要在X分钟才能下载；</p>
                  </div>
                ),
                okText: '查看导出结果',
                cancelText: '取消',
                onOk() {
                  // self.search.handleSearch({});
                  console.log(self.search) //eslint-disable-line
                  const { stateOfSearch } = self.search.props;
                  /* TODO: 跳转到异步导出路由 */
                  self.props.dispatch({
                    type: 'business/list',
                    payload: stateOfSearch,
                  });
                },
              })
              }
              >导出查询结果
              </Button>
            </Search>

            <Batch>

              <Batch.Item>
                {
                  () => {
                    return (
                      <Link to="/business/list/add/0">
                        <Button type="primary ">新增商家</Button>
                      </Link>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  () => {
                    return (
                      <Link to="/business/list/importBusiness/0">
                        <Button type="primary ">导入商家</Button>
                      </Link>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  () => {
                    return (
                      <Link to="/business/list/importAccount/0">
                        <Button type="primary ">导入帐号</Button>
                      </Link>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Button type="primary " onClick={this.handleBathOperating.bind(this, rows, 'up')}>批量上架</Button>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Button type="primary " onClick={this.handleBathOperating.bind(this, rows, 'down')}>批量下架</Button>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Button type="primary " onClick={this.handleBathOperating.bind(this, rows, 'freeze')}>批量冻结</Button>
                    );
                  }
                }
              </Batch.Item>

            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={business?.list?.list}
              pagination={business?.list?.pagination}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
