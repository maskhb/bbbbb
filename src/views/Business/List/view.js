import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import ModalExportBusiness from 'components/ModalExport/business';
import ProjectInput from 'components/ProjectInput/business.js';
// import { goTo } from 'utils/utils';
import AsyncCascader from 'components/AsyncCascader';
import AsyncCascaderNew from 'components/AsyncCascaderNew';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Button, Input, DatePicker, Select, Modal, Message, InputNumber } from 'antd';
import { getStartMillisecond, getEndMillisecond } from 'utils/datetime';
import getColumns from './columns';
import { transformCommunityAll } from './utils';
import './view.less';

const { RangePicker } = DatePicker;

@connect(({ business, loading, common }) => ({
  /* redux传入 @:装饰器 */
  business,
  common,
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
    const me = this;
    const { /* business, dispatch, */ history: { location: { search } } } = this.props;
    if (search) {
      this.search.props.setStateOfSearch({
        merchantId: Number(search.substr(1)),
      }, () => {
        me.search.handleSearch();
      });
    } else {
      me.search.handleSearch();
    }
  }

  convertExportParam = () => {
    const { searchDefault, stateOfSearch } = this?.search?.props;
    const { business } = this?.props;
    const { pageInfo, ...otherSearch } = stateOfSearch || {};
    const param = {
      ...searchDefault,
      ...otherSearch,
    };
    return {
      param: { param },
      totalCount: business?.queryListByPageRes?.totalCount,
      dataUrl: '/ht-mj-merchant-server/merchantBase/exportMerchantList',
      prefix: '802001',
    };
  }

  handleSearch = (values = {}) => {
    console.log(values) //eslint-disable-line
    const communityList = this.props?.common?.queryCommunityList?.dataList;
    /* 格式化数据 */
    function fmtData(
      {
        createDate: [createdTimeBegin, createdTimeEnd] = [],
        categoryId,
        operateScopeId,
        communityIdList,
        ...others
      } = {}) {
      return {
        ...others,
        communityIdList: transformCommunityAll(communityList, communityIdList),
        categoryId,
        operateScopeId,
        createdTimeBegin: getStartMillisecond(createdTimeBegin),
        createdTimeEnd: getEndMillisecond(createdTimeEnd),
      };
    }

    const params = fmtData(values);
    const { dispatch } = this.props;
    return dispatch({
      // type: 'business/queryListByPage',
      type: 'business/queryListByPage',
      payload: { goodsCategoryVoQ: params },
    }).then(() => {
      const res = this.props.business.queryListByPageRes;

      if (res) {
        this.search?.props?.setSelectedRows([]);
        const { currPage: current, totalCount: total, pageSize, totalPage } = res;
        this.setState({
          pagination: {
            current,
            total,
            pageSize,
            totalPage,
          },
        });
      }
    });
  }
  handleSearchDateChange=(date, dateString) => {
    return { date, dateString };
  }
  addBusiness=(rows) => {
    return rows;
  }
  handleBathOperating=(rows, type) => {
    const self = this;
    const { dispatch } = this.props;
    let updateType;
    switch (type) {
      case 'up':
        updateType = 2;
        break;
      case 'down':
        updateType = 1;
        break;
      case 'fz':
        updateType = 3;
        break;
      default:
        break;
    }
    const resArr = [];
    rows.forEach((item) => {
      resArr.push(item.merchantId);
    });
    if (rows.length) {
      Modal.confirm({
        title: '确定要批量操作',
        content: `是否对已选择的 ${rows.length}个商家 批量操作`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'business/updateStatus',
            payload: { merchantUpdateStatusVo: { merchantIdList: resArr, updateType } },
          }).then(() => {
            if (self.props.business.updateStatusRes === 1) {
              Message.success('保存成功');
              self.search.handleSearch();
              self.search?.props?.setSelectedRows([]);
            }
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
    const { loading, business, searchDefault } = this.props;
    // const { fileList } = this.state;
    const { Option } = Select;
    // const self = this;
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
                  form.getFieldDecorator('merchantId', {
                    initialValue: this.search?.props.stateOfSearch.merchantId || null,
                  })(
                    <InputNumber style={{ width: '100%' }} />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="商家名称" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('merchantName', {
                  })(
                    <Input placeholder="" />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="关联厂商名称" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('unionMerchantName', {
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
                      <Option value="1">厂商</Option>
                      <Option value="2">经销商</Option>
                      <Option value="3">小商家</Option>
                    </Select>
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="商家分类" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('categoryId', {
                  })(
                    <AsyncCascaderNew
                      placeholder="全部"
                      asyncType="queryTree"
                      param={{ categoryId: 0, parentId: 0 }}
                      labelParam={
                        {
                          label: 'categoryName',
                          value: 'categoryId',
                         }
                      }
                      filter={res => res.status === 0}
                    />
                  )
                )
              }
              </Search.Item>
              <Search.Item md={6} label="经营范围" simple>
                {
              ({ form }) => (
                form.getFieldDecorator('operateScopeId', {
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
              <Search.Item md={6} label="关联项目" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('communityIdList', {
                  })(
                    <ProjectInput style={{ width: '100%' }} />
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

              <Search.Item md={6} label="创建时间" simple>
                {
                ({ form }) => (
                  form.getFieldDecorator('createDate', {
                  })(
                    <RangePicker onChange={this.handleSearchDateChange.bind(this)} />
                  )
                )
              }
              </Search.Item>
            </Search>

            <Batch>
              <Authorized authority={['OPERPORT_JIAJU_SHOP_EXPORT']}>
                <ModalExportBusiness
                  {...this.props}
                  title="商家"
                  params={{}}
                  convertParam={this.convertExportParam}
                  exportModalType={2}
                  simple
                />
              </Authorized>
              <Batch.Item>
                {
                  () => {
                    return (
                      <Authorized authority={['OPERPORT_JIAJU_SHOP_ADD']}>
                        <Link to="/business/list/add/0">
                          <Button type="primary ">新增商家</Button>
                        </Link>
                      </Authorized>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  () => {
                    return (
                      <Authorized authority={['OPERPORT_JIAJU_BATCHADDING_ADDSHOP']}>
                        <Link to="/business/list/importBusiness/0">
                          <Button type="primary ">导入商家</Button>
                        </Link>
                      </Authorized>

                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  () => {
                    return (
                      <Authorized authority={['OPERPORT_JIAJU_BATCHADDING_ADDACCOUN']}>
                        <Link to="/business/list/importAccount/0">
                          <Button type="primary ">导入账号</Button>
                        </Link>
                      </Authorized>

                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Authorized authority={['OPERPORT_JIAJU_SHOP_BATCHUPDATE']}>
                        <Button type="primary " onClick={this.handleBathOperating.bind(this, rows, 'up')}>批量上架</Button>
                      </Authorized>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Authorized authority={['OPERPORT_JIAJU_SHOP_BATCHFROMSALE']}>
                        <Button type="primary " onClick={this.handleBathOperating.bind(this, rows, 'down')}>批量下架</Button>
                      </Authorized>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Authorized authority={['OPERPORT_JIAJU_SHOP_BATCHFREEZE']}>
                        <Button type="primary " onClick={this.handleBathOperating.bind(this, rows, 'fz')}>批量冻结</Button>
                      </Authorized>
                    );
                  }
                }
              </Batch.Item>

            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={business?.queryListByPageRes?.dataList}
              pagination={this.state?.pagination}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
