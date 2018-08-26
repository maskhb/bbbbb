import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Popconfirm, Input, Cascader, InputNumber, DatePicker, Badge, Popover, Icon } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { OPERPORT_JIAJU_PRODUCTLIST_ADD, OPERPORT_JIAJU_PRODUCTLIST_EXPORT,
  OPERPORT_JIAJU_PRODUCTLIST_BATCHPUBLISH, OPERPORT_JIAJU_PRODUCTLIST_BATCHUNPUBLISH,
  OPERPORT_JIAJU_TOAPPROVEPROLIST_BATCHAPPROVE } from 'config/permission';
import Authorized from 'utils/Authorized';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import ModalAudit from 'components/ModalAudit';
import { handleOperate } from 'components/Handle';
import NumberRange from 'components/NumberRange';
import ModalExportBusiness from 'components/ModalExport/business';
import ModalImport from 'components/ModalImport';
import numberRangeValidator from 'components/Rules/numberRangeValidator';
import ONLINESTATUS from 'components/OnlineStatus';
import AUDITSTATUS from 'components/AuditStatus';
import flat2nested from 'components/Flat2nested';
import getColumns from './columns';
import ModalCopy from './ModalCopy';

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
    modalAuditVisible: false,
    modalCopyVisible: false,
    modalImportVisible: false,
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
      type: 'goods/list',
      payload: params,
    });
  }

  // 审核
  modalAuditShow = (records) => {
    if (!records) {
      return;
    }

    let rows = [];
    if (records?.constructor?.name !== 'Array') {
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
    const { modalAuditRef } = this;

    modalAuditRef.validateFields((err, values) => {
      if (err) {
        return;
      }

      const params = {
        auditStatus: values.auditCode,
        auditOpinion: values.comment,
        goodsIds: modalAuditRef.rows.map(row => row.goodsId),
      };

      handleOperate.call(this, params, 'goods', 'audit', '审核', () => {
        this.modalAuditCancel();
        this.search?.props?.setSelectedRows([]);
      }, true);
    });
  }

  // 复制给经销商
  modalCopyShow = (records) => {
    if (!records) {
      return;
    }

    let rows = [];
    if (records?.constructor?.name !== 'Array') {
      rows = [records];
    } else {
      rows = records;
    }

    this.modalCopyRef.resetFields();
    this.modalCopyRef.rows = rows;

    this.setState({ modalCopyVisible: true });
  }
  modalCopyCancel = () => {
    this.setState({ modalCopyVisible: false });
    this.search?.props?.setSelectedRows([]);
  }
  modalCopyOk = () => {
    const { modalCopyRef } = this;

    modalCopyRef.validateFields((err, values) => {
      if (err) {
        return;
      }

      const params = {
        goodsIds: modalCopyRef.rows.map(row => row.goodsId),
        merchantIds: values.merchantIds,
      };

      handleOperate.call(this, params, 'goods', 'copy', '复制', this.modalCopyCancel);
    });
  }

  // 导入
  modalImportShow = () => {
    this.setState({ modalImportVisible: true });
  }
  modalImportCancel = () => {
    this.setState({ modalImportVisible: false });
  }
  modalImportOk = () => {
    this.modalImportCancel();
  }

  // 导出
  convertExportParam = async ({ exportFileName, prefix, exportType }) => {
    const { dispatch, user } = this.props;
    const { stateOfSearch = {} } = this.search.props;
    // const { pagination } = this.props.goods.list;
    // eslint-disable-next-line
    const { pageInfo, remainNum, ...otherSearch } = stateOfSearch;
    const userMerchantId = user.merchant?.merchantId; // 登录用户的商家id
    const userMerchantType = user.merchant?.merchantType; // 登录用户的商家类型
    const getOneFromStr = (str) => {
      if (str) {
        const vals = str.split(',');
        return vals.length > 1 ? null : vals[0];
      }
      return str;
    };
    const params = { ...otherSearch };
    if (otherSearch.createdTime?.[0]) {
      params.createdTimeStart = moment(otherSearch.createdTime?.[0]).valueOf();
    }
    if (otherSearch.createdTime?.[1]) {
      params.createdTimeEnd = moment(otherSearch.createdTime?.[1] + 1000).valueOf();
    }

    // eslint-disable-next-line
    // debugger
    params.remainNumMin = remainNum?.min;
    params.remainNumMax = remainNum?.max;
    // delete params.remainNum;
    delete params.createdTime;

    const param = {
      prefix: 804001,
      ...params,
      status: Array.isArray(
        otherSearch.status
      ) ? (
          otherSearch.status.length > 1 ? null : otherSearch.status[0]
        ) : getOneFromStr(otherSearch.status),
      auditStatus: Array.isArray(
        otherSearch.auditStatus
      ) ? (
          otherSearch.auditStatus.length > 1 ? null : otherSearch.auditStatus[0]
        ) : getOneFromStr(otherSearch.auditStatus),
      // remainNumMin: remainNum?.min,
      // remainNumMax: remainNum?.max,
      goodsCategoryId: otherSearch.goodsCategoryId?.[otherSearch.goodsCategoryId.length - 1],
      userMerchantId,
      userMerchantType,
    };


    await dispatch({
      type: 'goods/queryCount',
      payload: { param: JSON.stringify(param) },
    });
    delete param.userMerchantId;
    delete param.userMerchantType;
    const { queryCount } = this.props?.goods;
    return {
      platform: 1,
      exportType,
      fileName: exportFileName,
      prefix,
      dataUrl: '/ht-mj-goods-server/exportTemplate/goods/exportData',
      param: {
        param,
        // skuId: 1,
        // prefixBusinessType: 1,
        // ...otherSearch,
      },
      totalCount: queryCount,
    };
  }

  render() {
    const { user, goods, loading, goodsCategory, searchDefault, audit } = this.props;
    const { modalAuditVisible, modalCopyVisible, modalImportVisible } = this.state;
    const goodsCategoryCascaderOptions = flat2nested(goodsCategory.list || [], { id: 'categoryId', parentId: 'parentId' });

    const userMerchantId = user.merchant?.merchantId; // 登录用户的商家id
    const userMerchantType = user.merchant?.merchantType; // 登录用户的商家类型
    const isFactory = userMerchantId && userMerchantType === 1; // 是厂家
    const isSmallBusiness = userMerchantId && userMerchantType === 3; // 是小商家

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
              {
                !audit
                  ? (
                    <Authorized authority={[OPERPORT_JIAJU_PRODUCTLIST_ADD]}>
                      <a href="#/goods/list/add/0" target="_blank">
                        <Button icon="plus" type="primary">新建</Button>
                      </a>
                    </Authorized>
                  )
                  : ''
              }
              {
                !audit && goods.list?.list?.length > 0
                  ? (
                    <Authorized authority={[OPERPORT_JIAJU_PRODUCTLIST_EXPORT]}>
                      <ModalExportBusiness
                        exportModalType={3}
                        prefix="804001"
                        title="商品"
                        btnTitle="按查询结果导出"
                        convertParam={this.convertExportParam}
                        onOk={this.handleExportOk}
                      />
                    </Authorized>
                  )
                  : ''
              }
              {
                isFactory || isSmallBusiness
                  ? <Button onClick={this.modalImportShow.bind(this)}>导入</Button>
                  : ''
              }
              {
                isFactory
                  ? (
                    <Batch.Item>
                      {
                        ({ rows }) => {
                          return rows.length > 0
                            ? <Button onClick={this.modalCopyShow.bind(this, rows)}>复制给经销商</Button>
                            : '';
                        }
                      }
                    </Batch.Item>
                  )
                  : ''
              }
              <Batch.Item>
                {
                  ({ rows }) => {
                    const uniqStatus = _.uniq(rows.map(r => r.status));
                    const uniqContent = (selectRows, selectUniqStatus) => {
                      const targetStatus = selectUniqStatus[0] === ONLINESTATUS.ON.value
                        ? ONLINESTATUS.OFF.value
                        : ONLINESTATUS.ON.value;
                      const targetText = `批量${Object.values(ONLINESTATUS).find(({ value }) => value === targetStatus).text}`;

                      const permission = targetStatus === ONLINESTATUS.ON.value
                        ? [OPERPORT_JIAJU_PRODUCTLIST_BATCHPUBLISH]
                        : targetStatus === ONLINESTATUS.OFF.value
                          ? [OPERPORT_JIAJU_PRODUCTLIST_BATCHUNPUBLISH]
                          : [];

                      return (
                        selectRows.length > 0
                          ? (
                            <Authorized authority={permission}>
                              <Popconfirm
                                placement="top"
                                title={`确认${targetText}？`}
                                onConfirm={handleOperate.bind(this, {
                                    goodsIds: selectRows.map(r => r.goodsId),
                                    status: targetStatus,
                                  },
                                  'goods',
                                  'batchOnline',
                                  targetText,
                                  () => {
                                    this.search?.props?.setSelectedRows([]);
                                  })}
                                okText="确认"
                                cancelText="取消"
                              >
                                <Button loading={loading.effects['goods/batchOnline']}>{targetText}</Button>
                              </Popconfirm>
                            </Authorized>
                          )
                          : ''
                      );
                    };

                    return (
                      !audit && uniqStatus.length > 1
                        ? (
                          <Authorized authority={[
                            OPERPORT_JIAJU_PRODUCTLIST_BATCHPUBLISH,
                            OPERPORT_JIAJU_PRODUCTLIST_BATCHUNPUBLISH]}
                          >
                            <Popover placement="right" title="" content="只能批量操作一种状态！" trigger="hover">
                              <Button disabled>
                                上/下架<Icon type="question-circle-o" style={{ color: '#000' }} />
                              </Button>
                            </Popover>
                          </Authorized>
                        )
                        : !audit && uniqStatus.length === 1
                          ? uniqContent(rows, uniqStatus)
                          : ''
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    // 待审核状态 + 非复制商品
                    const validRows = Object.values(rows).filter(r =>
                      r.auditStatus === 1 && r.isCopy === 1);
                    let content = '';

                    if (validRows.length > 1) {
                      content = (
                        <Authorized authority={[OPERPORT_JIAJU_TOAPPROVEPROLIST_BATCHAPPROVE]}>
                          <Button onClick={this.modalAuditShow.bind(this, rows)}>
                            审核
                            <Badge
                              count={validRows.length}
                              overflowCount={99}
                              style={{
                                padding: 0,
                                top: -2,
                                marginLeft: 4,
                              }}
                            />
                          </Button>
                        </Authorized>
                      );
                    }

                    return content;
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    const disabled = !(rows.length > 0);
                    return (
                      (
                        <Authorized authority="OPERPORT_JIAJU_PRODUCTLIST_RECOVER">
                          <Popconfirm
                            placement="top"
                            title="确认移至回收站?"
                            onConfirm={handleOperate.bind(this, {
                                goodsIds: rows?.map(r => r.goodsId),
                                isRecovery: 2,
                              },
                              'goods',
                              'recovery',
                              '移至回收站',
                              () => {
                                this.search?.props?.setSelectedRows([]);
                              })}
                            okText="确认"
                            cancelText="取消"
                          >
                            <Button disabled={disabled} loading={loading.effects['goods/recovery']}>移至回收站</Button>
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

          <ModalAudit
            ref={(inst) => { this.modalAuditRef = inst; }}
            visible={modalAuditVisible}
            onCancel={this.modalAuditCancel}
            onOk={this.modalAuditOk}
            loading={loading.effects['goods/audit']}
          />

          <ModalCopy
            ref={(inst) => { this.modalCopyRef = inst; }}
            visible={modalCopyVisible}
            onCancel={this.modalCopyCancel}
            onOk={this.modalCopyOk}
            unionMerchantId={userMerchantId}
          />

          <ModalImport
            dragger
            title="导入"
            templateLabel="模板"
            actionProps={{
              url: '/mj/ht-mj-goods-server/exportTemplate/goods/importData',
              params(file) {
                return {
                  uploadFileVo: {
                    fileUrl: file.url,
                    fileName: file.originalFileName,
                    prefixBusinessType: 1,
                  },
                };
              },
            }}
            templateUrlProps={{
              baseUrl: '/ht-mj-goods-server/exportTemplate/goods/exportTemplate',
              query: {
                bussinessType: 1,
              },
              title: '下载模板',
            }}
            uploadProps={{
              uploadType: 'excel',
              maxSize: 1024 * 5,
            }}
            visible={modalImportVisible}
            onCancel={this.modalImportCancel}
            // onOk={this.modalImportOk}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
