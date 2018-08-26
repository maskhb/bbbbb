import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, message, Select } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import AUDITSTATUS from 'components/AuditStatus/PackageAuditStatus';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import getColumns from './columns';
import { arrTop, arrStatus, arrAuditStatus } from './status';
import BatchButton from './BatchButton';

const canOperateBatch = (audit) => {
  return audit === AUDITSTATUS.WAIT.value;
};

@connect(({ goodsPackage, loading }) => ({
  goodsPackage,
  loading: loading.models.goodsPackage,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
      status: '',
      auditStatus: Object.values(AUDITSTATUS).map(({ value }) => value).join(),
    },
  };

  state = {
    // selectedRows: [],
  };

  componentDidMount() {
    const { goodsPackage, dispatch, audit } = this.props;

    let auditStatus;

    if (goodsPackage?.linkState !== undefined && goodsPackage?.linkState !== null) {
      auditStatus = String(goodsPackage?.linkState);
    } else {
      auditStatus = audit || arrAuditStatus.map((item) => {
        return String(item.value);
      }).join(',');
      if (audit === 0) {
        auditStatus = 0;
      }
    }

    this.search.props.setStateOfSearch({
      auditStatus,
    }, () => {
      dispatch({
        type: 'goodsPackage/deleteLinkAuditStatus',
        payload: {},
      });

      this.search.handleSearch();
    });
  }

  handleSearch = async ({ pageInfo, ...query } = {}) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'goodsPackage/list',
      payload: {
        pageInfo,
        ...query,
      },
    });

    this.table?.cleanSelectedKeys();
  }

  popConfirm = async (val, record, confirmText) => {
    const { dispatch } = this.props;

    if (record.auditStatus === 2 && val === 1) {
      return message.error('当前套餐审核不通过，不允许上架');
    }

    await dispatch({
      type: 'goodsPackage/shelf',
      payload: {
        packageId: record.packageId,
        isShelf: val,
      },
    });

    const { goodsPackage } = this.props;

    if (goodsPackage?.shelf === 'success') {
      message.success(`${confirmText}成功`);
      this.search.handleSearch();
    }
  }

  popAuditConfirm = async (val, { packageIds, auditOpinion }, confirmText) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'goodsPackage/audit',
      payload: {
        packageIds,
        status: val,
        auditOpinion,
      },
    });

    const { goodsPackage } = this.props;
    const { success, fail, total } = goodsPackage?.audit || {};
    if (packageIds?.length === success) {
      message.success(`${confirmText}成功`);
    } else if (packageIds?.length > 1 && fail > 0) {
      message.warning(`本次批量审核${total}个，成功${success}个，失败${fail}个`);
    }

    this.search.handleSearch();
  }

  topConfirm = async (val, record, confirmText) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'goodsPackage/top',
      payload: {
        packageId: record.packageId,
      },
    });

    const { goodsPackage } = this.props;

    if (goodsPackage?.top === 'success') {
      message.success(`${confirmText}成功`);
      this.search.handleSearch();
    }
  }

  cancelTopConfirm = async (val, record, confirmText) => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'goodsPackage/cancelTop',
      payload: {
        packageId: record.packageId,
      },
    });

    const { goodsPackage } = this.props;

    if (goodsPackage?.cancelTop === 'success') {
      message.success(`${confirmText}成功`);
      this.search.handleSearch();
    }
  }

  handleBathOperating = (rows) => {
    return new Promise((resolve) => {
      this.auditForm?.validateFields((err, values) => {
        if (!err) {
          this.popAuditConfirm(values.status, {
            packageIds: rows.map(item => item.packageId), auditOpinion: values.auditOpinion,
          }, '审核');
          resolve(true);
        }
        resolve(false);
      });
    });
  }

  render() {
    const { loading, goodsPackage, searchDefault, audit } = this.props;

    return (
      <PageHeaderLayout>

        <Card>
          <PanelList>
            <Search
              ref={(inst) => {
                this.search = inst;
              }}
              searchDefault={{
                ...searchDefault,
                auditStatus: audit === 0
                  ? audit
                  : audit || Object.values(AUDITSTATUS).map(({ value }) => value).join(),
              }}
              onSearch={this.handleSearch}
            >
              <Search.Item label="所属商家：" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('merchantName')(
                      <Input maxLength="20" placeholder="请输入所属商家" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="套餐名称：" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('packageName')(
                      <Input maxLength="20" placeholder="请输入套餐名称" />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="状态：" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('status')(
                      <Select placeholder="请选择" allowClear>
                        {
                          arrStatus?.map(item => (
                            <Select.Option value={item.value} key={item.value}>
                              {item.label}
                            </Select.Option>
                          ))
                        }
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="是否置顶：" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('isTop')(
                      <Select placeholder="请选择" allowClear>
                        {
                          arrTop?.map(item => (
                            <Select.Option value={item.value} key={item.value}>
                              {item.label}
                            </Select.Option>
                          ))
                        }
                      </Select>
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>
              <BatchButton
                handleBathOperating={this.handleBathOperating}
                getSelectedRows={this.getSelectedRows}
                listInst={this}
                audit={audit}
              />

              {
                !audit && audit !== 0
                  ? (
                    <Authorized authority={[permission.OPERPORT_JIAJU_PACKAGELIST_ADD]}>
                      <Button icon="plus" type="primary" href="#/goods/package/list/add">新建</Button>
                    </Authorized>
                  )
                  : ''
              }
            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault, audit)}
              dataSource={goodsPackage?.list?.list}
              pagination={goodsPackage?.list?.pagination}
              disableRowSelection={!canOperateBatch(audit)}
              rowKey="packageId"
              ref={(inst) => {
                this.table = inst;
              }}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
