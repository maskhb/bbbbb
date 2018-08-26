/*
 * @Author: wuhao
 * @Date: 2018-04-20 10:32:47
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-29 15:53:39
 *
 * 操作日志
 */
import React, { PureComponent } from 'react';
import moment from 'moment';

import { Card, Tabs, Table } from 'antd';

const { TabPane } = Tabs;

class OperationLog extends PureComponent {
  static defaultProps = {};

  state = {
    pageSize: 10,
    payStateTableLoading: false,
    receiptInfoTableLoading: false,
    goodsInfoTableLoading: false,
  }

  componentDidMount() {
    const init = async () => {
      await this.reqPayStateLogs({ current: 1 });
      await this.reqReceiptInfoLogs({ current: 1 });
      await this.reqGoodsInfoLogs({ current: 1 });
    };

    init();
  }

  getColumns = () => {
    return [
      {
        title: '操作时间',
        width: '180px',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render(val) {
          return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : '';
        },
      },
      {
        title: '操作人',
        width: '120px',
        dataIndex: 'loginName',
        key: 'loginName',
      },
      {
        title: '修改前',
        dataIndex: 'beforeOperation',
        key: 'beforeOperation',
        render(val) {
          return <div dangerouslySetInnerHTML={{ __html: `${(val || '').replace(/\n/g, '<br />')}` }} />;// eslint-disable-line
        },
      },
      {
        title: '修改后',
        dataIndex: 'afterOperation',
        key: 'afterOperation',
        render(val) {
          return <div dangerouslySetInnerHTML={{ __html: `${(val || '').replace(/\n/g, '<br />')}` }} />;// eslint-disable-line
        },
      },
      {
        title: '描述',
        width: '180px',
        dataIndex: 'remarks',
        key: 'remarks',
      },
    ];
  }

  getTableElm = (type, resObj = {}, columns, loading) => {
    const { pageSize } = this.state;
    return (
      <Table
        dataSource={resObj?.list}
        columns={columns}
        onChange={(pagination) => {
         this.handlePageChange(pagination, type);
        }}
        loading={loading}
        pagination={{
          defaultPageSize: pageSize,
          ...resObj?.pagination,
        }}
      />
    );
  }

  handlePageChange = (pagination, type) => {
    switch (`${type}`) {
      case '1':
        this.reqPayStateLogs(pagination);
        break;
      case '2':
        this.reqReceiptInfoLogs(pagination);
        break;
      case '3':
        this.reqGoodsInfoLogs(pagination);
        break;
      default:
        break;
    }
  }

  reqPayStateLogs = async ({ current }) => {
    const { dispatch, orderSn } = this.props;
    const { pageSize } = this.state;

    this.setState({
      payStateTableLoading: true,
    });

    await dispatch({
      type: 'orders/queryOrderRelatedLogs',
      payload: {
        pageInfo: {
          currPage: current,
          pageSize,
        },
        orderSn,
        type: 'mj-orderPayment',
      },
    });

    this.setState({
      payStateTableLoading: false,
    });
  }

  reqReceiptInfoLogs = async ({ current }) => {
    const { dispatch, orderSn } = this.props;
    const { pageSize } = this.state;

    this.setState({
      receiptInfoTableLoading: true,
    });

    await dispatch({
      type: 'orders/queryOrderRelatedLogs',
      payload: {
        pageInfo: {
          currPage: current,
          pageSize,
        },
        orderSn,
        type: 'mj-orderReceipt',
      },
    });

    this.setState({
      receiptInfoTableLoading: false,
    });
  }

  reqGoodsInfoLogs = async ({ current }) => {
    const { dispatch, orderSn } = this.props;
    const { pageSize } = this.state;

    this.setState({
      goodsInfoTableLoading: true,
    });

    await dispatch({
      type: 'orders/queryOrderRelatedLogs',
      payload: {
        pageInfo: {
          currPage: current,
          pageSize,
        },
        orderSn,
        type: 'mj-orderGoods',
      },
    });

    this.setState({
      goodsInfoTableLoading: false,
    });
  }
  render() {
    const { className, orders } = this.props;

    const {
      payStateTableLoading,
      receiptInfoTableLoading,
      goodsInfoTableLoading,
    } = this.state;

    return (
      <Card title="操作日志" className={`${className}`} >
        <Tabs size="small">
          <TabPane tab="支付状态日志" key="1">
            {
              this.getTableElm(1, orders?.['orderRelatedLogs-mj-orderPayment'], this.getColumns(), payStateTableLoading)
            }
          </TabPane>
          <TabPane tab="收货信息日志" key="2">
            {
              this.getTableElm(2, orders?.['orderRelatedLogs-mj-orderReceipt'], this.getColumns(), receiptInfoTableLoading)
            }
          </TabPane>
          <TabPane tab="商品信息日志" key="3">
            {
              this.getTableElm(3, orders?.['orderRelatedLogs-mj-orderGoods'], this.getColumns(), goodsInfoTableLoading)
            }
          </TabPane>
        </Tabs>

      </Card>
    );
  }
}

export default OperationLog;
