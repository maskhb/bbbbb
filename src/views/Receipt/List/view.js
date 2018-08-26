import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, DatePicker, Button } from 'antd';
import Input from 'components/input/DecorateInput';
import ModalExportBusiness from 'components/ModalExport/business';
import PanelList, { Search, Batch, Table } from 'components/PanelList';
import moment from 'moment/moment';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';

const { RangePicker } = DatePicker;
const labelCol = {
  sm: 24,
  md: 5,
};


@connect(({ receipt, loading }) => ({
  receipt,
  loading: loading.effects['receipt/queryList'],
}))
export default class View extends PureComponent {
  static handleTimeStr(timestamp, type) { // type 1:到00:00:00   2：到23:59:59
    let result = '';
    if (type === 1) {
      result = new Date(timestamp).setHours(0, 0, 0);
    } else if (type === 2) {
      result = new Date(timestamp).setHours(23, 59, 59);
    }
    return result;
  }
  state = {};
  componentDidMount() {
    this.search.handleSearch();
  }

  handleSearch = (values = {}) => {
    const { dispatch } = this.props;
    const params = {
      ...values,
    };
    if (values.collectionDays?.[0]) {
      params.collectionDaysBegin = moment(values.collectionDays?.[0]).valueOf();
    }
    if (values.collectionDays?.[1]) {
      params.collectionDaysEnd = moment(values.collectionDays?.[1] + 1000).valueOf();
    }
    delete params.collectionDays;

    return dispatch({
      type: 'receipt/queryList',
      payload: params,
    });
  };
  /**
   * 导出参数转换
   */
  convertExportParam = async () => {
    const { searchDefault, receipt } = this.props;
    const { stateOfSearch } = this.search.props;
    const { pageInfo, ...otherSearch } = stateOfSearch || {};
    const { queryList } = receipt || {};

    const reqParam = {
      ...searchDefault,
      ...otherSearch,
    };

    console.log(reqParam);
    return {
      param: {
        param: {
          ...reqParam,
        },
      },
      totalCount: queryList?.pagination?.total || 0,
      dataUrl: '/ht-mj-order-server/order/eleReceipt/list/export',
      prefix: 801005,
    };
  }
  render() {
    const { receipt, loading, searchDefault } = this.props;
    const { queryList } = receipt;
    return (
      <PageHeaderLayout>
        <Card>
          <PanelList>
            <Search
              ref={(inst) => {
                this.search = inst;
              }}
              searchDefault={this.searchDefault}
              onSearch={this.handleSearch}
            >
              <Search.Item {...labelCol} label="订单号" simple>
                {({ form }) => (form.getFieldDecorator('orderSn', {})(<Input placeholder="" />))}
              </Search.Item>
              <Search.Item {...labelCol} label="收据编号" simple>
                {({ form }) => (form.getFieldDecorator('eleReceiptSn', {})(<Input placeholder="" />))}
              </Search.Item>
              <Search.Item {...labelCol} label="收货人手机号" simple>
                {({ form }) => (form.getFieldDecorator('consigneeMobile', {})(<Input placeholder="" />))}
              </Search.Item>
              <Search.Item {...labelCol} label="收货人姓名" simple>
                {({ form }) => (form.getFieldDecorator('consigneeName', {})(<Input placeholder="" />))}
              </Search.Item>
              <Search.Item label="收款日期" simple>
                {({ form }) => (form.getFieldDecorator('collectionDays', {
                  })(<RangePicker
                    showTime
                    format="YYYY-MM-DD"
                    placeholder={['开始时间', '结束时间']}
                  />))}
              </Search.Item>
            </Search>
            <Batch>
              <Authorized authority={[permission.OPERPORT_JIAJU_ECRECEIPT_RECEIPT]}>
                <Link target="_blank" to="/receipt/list/add">
                  <Button type="primary ">开具收据</Button>
                </Link>
              </Authorized>
              <Authorized authority={['OPERPORT_JIAJU_ECRECEIPT_EXPORT']}>
                <ModalExportBusiness
                  {...this.props}
                  title="收据导出"
                  btnTitle="导出"
                  convertParam={this.convertExportParam}
                  exportModalType={0}
                />
              </Authorized>
            </Batch>
            <Table
              loading={loading}
              rowKey="orderSn"
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={queryList?.list}
              pagination={queryList?.pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
