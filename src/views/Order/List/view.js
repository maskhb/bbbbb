import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import TableOrderList from 'components/TableOrderList';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import PanelList from '../../../components/PanelList';

import SearchHeader from './components/SearchHeader';
import BatchSearchList from './components/BatchSearchList';

import getColumns from './columns';
import { getStartTimeAndEndTimeFor6Months } from './attr';


@connect(({ orders, exports, loading }) => ({
  orders,
  exports,
  loading: loading.models.orders,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
      needInvoice: '',
      // orderSource: '',
      // orderStatus: '',
      // payStatus: '',
      // payType: '',
      shipType: '',
      invoiceType: '',
      excess: '',
      address: '',
      projectName: '',
      createTime: getStartTimeAndEndTimeFor6Months(),
      payTime: getStartTimeAndEndTimeFor6Months(),
      finishTime: getStartTimeAndEndTimeFor6Months(),
    },
  };

  render() {
    const { orders, loading, searchDefault } = this.props;

    return (
      <PageHeaderLayout>
        <Card>

          <PanelList>

            <SearchHeader {...this.props} />

            <BatchSearchList
              {...this.props}
              radioChange={this.handleRadioChange}
            />

            <TableOrderList
              isExpanded
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              dataSource={orders?.list?.list}
              pagination={orders?.list?.pagination}
            />

          </PanelList>

        </Card>
      </PageHeaderLayout>
    );
  }
}
