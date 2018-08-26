import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Popconfirm, Input, Cascader, InputNumber, DatePicker, Select } from 'antd';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { handleOperate } from 'components/Handle';
import NumberRange from 'components/NumberRange';
import numberRangeValidator from 'components/Rules/numberRangeValidator';
import ONLINESTATUS from 'components/OnlineStatus';
import AUDITSTATUS from 'components/AuditStatus';
import flat2nested from 'components/Flat2nested';
import getColumns from './columns';

const SelectOption = Select.Option;
const auditOptions = [
  { label: '未发布', value: 1 },
  { label: '待审核', value: 2 },
  { label: '已审核', value: 3 },
  { label: '审核不通过', value: 4 },
];
const statusOptions = [
  { label: '待上架', value: 1 },
  { label: '已上架', value: 2 },
  { label: '已下架', value: 3 },
];
@connect(({ user, goods, goodsCategory, loading }) => ({
  user,
  goods,
  goodsCategory,
  loading,
}))
export default class List extends PureComponent {
  static defaultProps = {
    searchDefault: {
      status: Object.values(ONLINESTATUS).map(({ value }) => value),
      auditStatus: Object.values(AUDITSTATUS).map(({ value }) => value),
    },
  };
  state = {
  };
  componentDidMount() {
    const { goods, dispatch, audit } = this.props;
    const me = this;

    this.search.props.setStateOfSearch({
      auditStatus: Number(goods?.linkState) ||
        audit || Object.values(AUDITSTATUS).map(({ value }) => value),
    }, () => {
      dispatch({
        type: 'goods/deleteLinkAuditStatus',
        payload: {},
      });

      me.search.handleSearch();

      dispatch({
        type: 'goodsCategory/list',
        payload: {},
      });
    });
  }
  handleSearch = (values = {}) => {
    const { dispatch } = this.props;

    const params = {
      ...values,
      remainNumMin: values.remainNum?.min,
      remainNumMax: values.remainNum?.max,
      goodsCategoryId: values.goodsCategoryId?.[values.goodsCategoryId.length - 1],
      // isRecovery: 2,
    };

    if (values.status) {
      const list = String(values.status).split(',');
      params.status = list.length >= 3 ? null : list.map(v => Number(v));
    }
    if (values.auditStatus) {
      const list = String(values.auditStatus).split(',');
      params.auditStatus = list.length >= 3 ? null : list.map(v => Number(v));
    }
    if (values.createdTime?.[0]) {
      params.createdTimeStart = moment(values.createdTime?.[0]).valueOf();
    }
    if (values.createdTime?.[1]) {
      params.createdTimeEnd = moment(values.createdTime?.[1] + 1000).valueOf();
    }

    delete params.remainNum;
    delete params.createdTime;

    return dispatch({
      type: 'goods/recoveryList',
      payload: params,
    });
  }
  render() {
    const { goods, loading, goodsCategory, searchDefault, audit } = this.props;
    const goodsCategoryCascaderOptions = flat2nested(goodsCategory.list || [], { id: 'categoryId', parentId: 'parentId' });


    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={{
                ...searchDefault,
                auditStatus: Number(goods?.linkState) ||
                  audit || Object.values(AUDITSTATUS).map(({ value }) => value),
              }}
              onSearch={this.handleSearch}
            >
              <Search.Item label="商品标题" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('goodsName', {
                    })(
                      <Input placeholder="" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="商品分类" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('goodsCategoryId', {
                    })(
                      <Cascader options={goodsCategoryCascaderOptions} placeholder="" changeOnSelect />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="品牌" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('brand', {
                    })(
                      <Input placeholder="" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="所属商家" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('merchantName', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="上下架状态">
                {
                  ({ form }) => (
                    form.getFieldDecorator('status', {
                    })(
                      <Select allowClear placeholder="全部">
                        {
                          statusOptions.map((item) => {
                            return (
                              <SelectOption key={item.value} value={item.value}>
                                {item.label}
                              </SelectOption>
                            );
                          })
                        }
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="审核状态">
                {
                  ({ form }) => (
                    form.getFieldDecorator('auditStatus', {
                    })(
                      <Select allowClear placeholder="全部">
                        {
                          auditOptions.map((item) => {
                            return (
                              <SelectOption key={item.value} value={item.value}>
                                {item.label}
                              </SelectOption>
                            );
                          })
                        }
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="商品ID">
                {
                  ({ form }) => (
                    form.getFieldDecorator('goodsId', {
                    })(
                      <InputNumber
                        min={0}
                        precision={0}
                        step={1}
                        style={{ width: '100%' }}
                      />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="商家商品编码">
                {
                  ({ form }) => (
                    form.getFieldDecorator('goodsCode', {
                    })(
                      <Input placeholder="" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="SKU编号">
                {
                  ({ form }) => (
                    form.getFieldDecorator('skuId', {
                    })(
                      <InputNumber
                        min={0}
                        precision={0}
                        step={1}
                        style={{ width: '100%' }}
                      />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="商家SKU编码">
                {
                  ({ form }) => (
                    form.getFieldDecorator('skuCode', {
                    })(
                      <Input placeholder="" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="库存">
                {
                  ({ form }) => (
                    form.getFieldDecorator('remainNum', {
                      rules: [{
                        validator: numberRangeValidator,
                      }],
                    })(
                      <NumberRange />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="创建时间">
                {
                  ({ form }) => (
                    form.getFieldDecorator('createdTime', {
                    })(
                      <DatePicker.RangePicker
                        style={{ width: '100%' }}
                        format="YYYY-MM-DD HH:mm:ss"
                        showTime={{
                          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                        }}
                      />
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <Batch.Item>
                {
                  ({ rows }) => {
                    const disabled = !(rows.length > 0);
                    return (
                      (
                        <Authorized authority="OPERPORT_JIAJU_PRORECYCLEBIN_BATCHRESTORE">
                          <Popconfirm
                            placement="top"
                            title="确认还原?"
                            onConfirm={handleOperate.bind(this, {
                                goodsIds: rows?.map(r => r.goodsId),
                                isRecovery: 1,
                              },
                              'goods',
                              'recovery',
                              '还原',
                              () => {
                                this.search?.props?.setSelectedRows([]);
                              })}
                            okText="确认"
                            cancelText="取消"
                          >
                            <Button disabled={disabled} loading={loading.effects['goods/recovery']}>批量还原</Button>
                          </Popconfirm>
                        </Authorized>
                      )
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    const ids = rows?.map(r => r.goodsId);
                    const disabled = !(rows.length > 0);
                    return (
                      (
                        <Authorized authority="OPERPORT_JIAJU_PRORECYCLEBIN_BATCHDELETE">
                          <Popconfirm
                            placement="top"
                            title="确认删除?"
                            onConfirm={handleOperate.bind(this, ids,
                              'goods',
                              'removeBatch',
                              '删除',
                              () => {
                                this.search?.props?.setSelectedRows([]);
                              })}
                            okText="确认"
                            cancelText="取消"
                          >
                            <Button disabled={disabled} loading={loading.effects['goods/removeBatch']}>批量删除</Button>
                          </Popconfirm>
                        </Authorized>
                      )
                    );
                  }
                }
              </Batch.Item>
            </Batch>

            <Table
              loading={loading.models.goods}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault, audit)}
              dataSource={goods.list?.list}
              pagination={goods.list?.pagination}
              rowKey="goodsId"
            />
          </PanelList>

        </Card>
      </PageHeaderLayout>
    );
  }
}
