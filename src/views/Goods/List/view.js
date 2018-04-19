import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, message, Popconfirm, Input, Cascader, Popover, Icon, InputNumber, DatePicker } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import ModalAudit from 'components/ModalAudit';
import { ONLINESTATUS } from 'components/Status/online';
import { handleOperate } from 'components/Handle';
import RangeInput from 'components/RangeInput';
import getColumns from './columns';

@connect(({ goods, goodsCategory, loading }) => ({
  goods,
  goodsCategory,
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
    modalAuditVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsCategory/list',
      payload: {},
    });

    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;

    // 控件数据->接口数据
    const params = {
      ...values,
      remainNum1: values.remainNum?.min,
      remainNum2: values.remainNum?.max,
      createdTime1: moment(values.createdTime?.[0]).valueOf(),
      createdTime2: moment(values.createdTime?.[1]).valueOf(),
    };

    delete params.remainNum;
    delete params.createdTime;

    return dispatch({
      type: 'goods/list',
      payload: params,
    });
  }

  modalAuditShow = (records) => {
    if (!records) {
      return;
    }

    let rows = [];
    if (records.constructor.name !== 'Array') {
      rows = [records];
    } else {
      rows = records;
    }

    this.modalAuditRef.resetFields();
    this.modalAuditRef.rows = rows;
    this.setState({ modalAuditVisible: true });
  }
  modalAuditCancel = () => {
    this.setState({ modalAuditVisible: false });
  }
  modalAuditOk = () => {
    this.modalAuditRef.validateFields((err, values) => {
      if (err) {
        return;
      }

      const { dispatch } = this.props;
      dispatch({
        type: 'goods/audit',
        payload: {
          ...values,
          ids: this.modalAuditRef.rows.map(row => row.id).join(','),
        },
      }).then(() => {
        const { audit } = this.props.goods;
        if (audit.result === 0) {
          message.success('审核成功');
          this.search.handleSearch();
        } else if (audit.result === 1) {
          message.error(`审核失败, ${audit.msg || '请稍后再试。'}`);
        }
      });

      this.modalAuditCancel();
    });
  }

  render() {
    const { goods, loading, searchDefault } = this.props;
    const { modalAuditVisible } = this.state;

    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => { this.search = inst; }}
              searchDefault={searchDefault}
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
                      <Cascader options={[]} placeholder="" />
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
                    form.getFieldDecorator('merchantId', {
                    })(
                      <Cascader options={[]} placeholder="" />
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
              <Search.Item label="SKU ID">
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
                    })(
                      <RangeInput placeholders={['大于等于', '小于等于']} />
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
              <a href="#/goods/list/add/0">
                <Button icon="plus" type="primary">新建</Button>
              </a>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      rows.length
                        ? <Button disabled>导出</Button>
                        : ''
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    const status = _.uniq(Object.values(rows).map(r => r.onlineStatus));
                    let content = '';

                    if (status.length === 1) {
                      const targetVal = status[0] === 1 ? 2 : 1;
                      const confirmText = ONLINESTATUS[targetVal];

                      content = (
                        <Popconfirm
                          placement="top"
                          title={`确认${confirmText}？`}
                          onConfirm={handleOperate.bind(this, { goodsId: rows.map(r => r.goodsId), status: targetVal }, 'goods', 'online', confirmText)}
                          okText="确认"
                          cancelText="取消"
                        >
                          <Button loading={loading.effects['goods/online']}>{confirmText}</Button>
                        </Popconfirm>
                      );
                    } else if (status.length > 1) {
                      content = (
                        <Popover placement="right" title="" content="只能批量操作一种状态！" trigger="hover">
                          <Button disabled>
                            上/下架<Icon type="question-circle-o" style={{ color: '#000' }} />
                          </Button>
                        </Popover>
                      );
                    }

                    return content;
                  }
                }
              </Batch.Item>
            </Batch>

            <Table
              loading={loading.models.goods}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault, loading.models.goodsCategory)}
              dataSource={goods?.list?.list}
              pagination={goods?.list?.pagination}
              rowKey="goodsId"
            />
          </PanelList>

          <ModalAudit
            ref={(inst) => { this.modalAuditRef = inst; }}
            visible={modalAuditVisible}
            onCancel={this.modalAuditCancel}
            onOk={this.modalAuditOk}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
