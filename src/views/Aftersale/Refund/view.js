import Authorized from 'utils/Authorized';
// import checkPermission from 'components/Authorized/CheckPermissions';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import { MonitorInput } from 'components/input';
import ModalExportBusiness from 'components/ModalExport/business';
import ProjectInput from 'components/ProjectInput/business.js';
import moment from 'moment';
// import { goTo } from 'utils/utils';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, DatePicker, Select, Modal, Message } from 'antd';
// import { getStartMillisecond, getEndMillisecond } from 'utils/datetime';
import getColumns from './columns';
// import { transformCommunityAll } from './utils';
import './view.less';

const { RangePicker } = DatePicker;

@connect(({ refound, loading }) => ({
  /* redux传入 @:装饰器 */
  refound,
  loading: loading.models.refound,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
    },
  };

  state = {
    pagination: {
      current: 1,
      total: 1,
      pageSize: 10,
      totalPage: 1,
    },
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  convertExportParam = () => {
    const { searchDefault, stateOfSearch } = this.search.props;
    const { refound } = this.props;
    const { pageInfo, ...otherSearch } = stateOfSearch || {};
    const param = {
      ...searchDefault,
      ...otherSearch,
    };
    return {
      param: { param },
      totalCount: refound?.queryList?.totalCount || 0,
      dataUrl: '/ht-mj-aftersale-server/aftersale/query/export/refundOrder',
      prefix: 807003,
    };
  }

  handleSearch = (values = {}) => {
    let { communityId, ArrayTime } = values;//eslint-disable-line
    if (communityId && Array.isArray(communityId)) {
      communityId = communityId[communityId.length - 1];
    }
    let startTime;
    let endTime;
    if (ArrayTime && Array.isArray(ArrayTime)) {
      if (ArrayTime.length) {
        [startTime, endTime] = ArrayTime;
        startTime = String(moment(startTime).unix()).padEnd(13, 0);
        endTime = String(moment(endTime).unix()).padEnd(13, 0);
      }
    }
    const newValues = { ...values, communityId, startTime, endTime };
    delete newValues.ArrayTime;
    const { dispatch } = this.props;
    return dispatch({
      type: 'refound/refundOrderList',
      payload: { refundOrderQueryVO: newValues },
    }).then((res1) => {
      if (res1) {
        const { currPage: current, totalCount: total, pageSize, totalPage } = res1;
        this.setState({
          pagination: {
            current,
            total,
            pageSize,
            totalPage,
          },
        });
        startTime = null;
        endTime = null;
      }
    });
  }
  handleSearchDateChange = (date, dateString) => {
    console.log(date, dateString) //eslint-disable-line
  }
  checkStatus = (val = {}) => {
    /*
      审核状态 afterSaleStatus（0：待审核；2：同意退款；4：已取消）
      关闭状态 shutDownStatus  (1：未关闭；2：已关闭)
      退款状态 refundStatus  (0：未退款；1：退款中；2：已退款；3：无需退款；4：已取消；5：已退款（系统））
      三者来判断
     */
    const { afterSaleStatus, shutDownStatus, refundStatus } = val;
    const isApprove = afterSaleStatus !== 0 && afterSaleStatus !== 4;
    const isShutdown = shutDownStatus === 2;

    /* eslint-disable-next-line */
    const flagDo = isApprove && !isShutdown && [0, 1].includes(refundStatus); // (shutDownStatus === 1 && afterSaleStatus !== 0 && afterSaleStatus !== 4 && refundStatus === 0) || (shutDownStatus === 1 && afterSaleStatus === 2 && refundStatus === 1);
    const flagAgree = afterSaleStatus === 0 && !isShutdown && refundStatus === 0;
    // (afterSaleStatus === 0 && shutDownStatus === 1 && refundStatus === 0);
    /* eslint-disable-next-line */
    const flagCancel = flagDo ||  flagAgree
    /* eslint-disable-next-line */
    // (afterSaleStatus === 2 && (refundStatus === 0 || refundStatus === 1) && shutDownStatus === 1) || (afterSaleStatus === 0 && shutDownStatus === 1 && refundStatus === 0);
    return { flagDo, flagAgree, flagCancel };
  }

  handleBathOperating = (rows, type) => {
    const [row] = rows;
    const { flagAgree, flagCancel } = this.checkStatus(row) || {};
    if (type === 'agree') {
      if (flagAgree) {
        this.handleAgreeRefund(row);
      } else {
        Modal.error({
          title: '系统错误提示',
          content: '该退款单不允许再修改审核！',
        });
      }
    } else if (flagCancel) {
      this.handleCancelRefund(row);
    } else {
      Modal.error({
        title: '系统错误提示',
        content: '该退款单不允许再取消!',
      });
    }
  }

  handleAgreeRefund = (row) => {
    const { dispatch } = this.props;
    Modal.confirm({
      content: (
        <div>
          <p>
          确定审核该单同意退款吗?
          </p>
          <p style={{ color: 'red' }}>
          审核同意后才可执行退款操作。
          </p>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await dispatch({
          type: 'refound/agreeRefund',
          payload: { refundId: row.refundId },
        });
        if (this.props.refound.agreeRefundRes) {
          Message.success('操作成功');
          this.search.handleSearch();
        } else {
          Message.error('操作失败');
        }
      },

    });
  }

  handleCancelRefund = (row) => {
    const { dispatch } = this.props;
    Modal.confirm({
      content: (
        <div>
          <p>
           确定要取消该退款单吗？
          </p>
          <p style={{ color: 'red' }}>
            取消后此退款单将不可再操作，请谨慎处理。
          </p>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await dispatch({
          type: 'refound/cancelRefund',
          payload: { refundId: row.refundId },
        });
        console.log(this.props.refound.cancelRefundRes) //eslint-disable-line
        if (this.props.refound.cancelRefundRes) {
          Message.success('操作成功');
          this.search.handleSearch();
        } else {
          Message.error('操作失败');
        }
      },
    });
  }


  render() {
    const { loading, searchDefault, refound } = this.props;
    const { Option } = Select;

    // console.log('refund ...', refound);
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
              <Search.Item md={6} label="子订单编号" simple className="col-6">
                {
                  ({ form }) => (
                    form.getFieldDecorator('orderSn', { })(
                      <MonitorInput maxLength={30} simple />
                    )
                  )
                }
              </Search.Item>

              <Search.Item md={6} label="母订单编号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('parentOrderSn', {
                    })(
                      <MonitorInput maxLength={30} simple />
                    )
                  )
                }
              </Search.Item>

              <Search.Item md={6} label="退货单号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('returnSn', {
                    })(
                      <MonitorInput maxLength={30} simple />
                    )
                  )
                }
              </Search.Item>

              <Search.Item md={6} label="所属商家" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('merchantName', {
                    })(
                      <MonitorInput maxLength={30} simple />
                    )
                  )
                }
              </Search.Item>
              <Search.Item md={6} label="所属厂家" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('factoryName', {
                    })(
                      <MonitorInput maxLength={30} simple />
                    )
                  )
                }
              </Search.Item>

              <Search.Item md={6} label="所属项目" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('communityId', {
                    })(
                      <ProjectInput style={{ width: '100%' }} />
                    )
                  )
                }
              </Search.Item>

              <Search.Item md={6} label="申请时间" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('ArrayTime', {
                    })(
                      <RangePicker onChange={this.handleSearchDateChange.bind(this)} />
                    )
                  )
                }
              </Search.Item>
              <Search.Item md={6} label="服务类型" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('serviceTypeList', {
                      // initialValue: ['全部'],
                    })(
                      <Select
                        mode="tags"
                        placeholder="全部"
                        style={{ width: '100%' }}
                      >
                        {/* <Option value="0">全部</Option> */}
                        <Option value="1">退货退款</Option>
                        <Option value="2">换货</Option>
                        <Option value="3">仅退款</Option>
                        <Option value="4">仅退款(超额支付))</Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item md={6} label="审核状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('afterSaleStatusList', {
                    })(
                      <Select
                        mode="tags"
                        placeholder="全部"
                        style={{ width: '100%' }}
                      >
                        {/* <Option value="0">全部</Option> */}
                        <Option value="2">同意退款</Option>
                        <Option value="3">待审核</Option>
                        <Option value="4">已取消</Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item md={6} label="退款状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('refundStatusList', {

                    })(
                      <Select
                        mode="tags"
                        placeholder="全部"
                        style={{ width: '100%' }}
                      >
                        {/* <Option value="">全部</Option> */}
                        <Option value="0">未退款</Option>
                        <Option value="1">退款中</Option>
                        <Option value="2">已退款</Option>
                        <Option value="3">无需退款</Option>
                        <Option value="4">已取消</Option>
                        <Option value="5">已退款(系统)</Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
              <Search.Item md={6} label="关闭状态" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('shutDownStatusList', {
                    })(
                      <Select
                        mode="tags"
                        placeholder="全部"
                        style={{ width: '100%' }}
                      >
                        {/* <Option value="0">全部</Option> */}
                        <Option value="1">是</Option>
                        <Option value="2">否</Option>
                      </Select>
                    )
                  )
                }
              </Search.Item>
            </Search>

            <Batch>


              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Authorized authority={
                        ['OPERPORT_JIAJU_REFUNDLIST_AGREE']
                      }
                      >
                        <Button
                          type="primary "
                          onClick={this.handleBathOperating.bind(this, rows, 'agree')}
                          disabled={rows.length !== 1}
                        >同意退款
                        </Button>
                      </Authorized>
                    );
                  }
                }
              </Batch.Item>
              <Batch.Item>
                {
                  ({ rows }) => {
                    return (
                      <Authorized authority={
                        ['OPERPORT_JIAJU_REFUNDLIST_CANCEL']
                      }
                      >
                        <Button
                          type="primary "
                          onClick={this.handleBathOperating.bind(this, rows, 'cancel')}
                          disabled={rows.length !== 1}
                        >取消退款单(慎用)
                        </Button>
                      </Authorized>
                    );
                  }
                }
              </Batch.Item>

              <Authorized authority={
                ['OPERPORT_JIAJU_REFUNDLIST_EXPORTREPORT']
              }
              >
                <ModalExportBusiness
                  {...this.props}
                  title="商家"
                  params={{}}
                  convertParam={this.convertExportParam}
                  exportModalType={2}
                  simple
                />
              </Authorized>

            </Batch>

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={refound?.queryList?.dataList}
              pagination={this.state.pagination}
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
