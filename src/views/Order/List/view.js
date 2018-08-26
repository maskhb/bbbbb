import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import classNames from 'classnames';
import TableOrderList from 'components/TableOrderList';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList from 'components/PanelList';

import SearchHeader from './components/SearchHeader';
import BatchSearchList from './components/BatchSearchList';

import getColumns from './columns';
// import { getStartTimeAndEndTimeFor6Months } from '../attr';
import {
  // transformOrderList,
  transformExpandEdRowKey,
} from '../transform';

import styles from './index.less';

@connect(({ orders, propertyKey, goods, loading }) => ({
  orders,
  propertyKey,
  goods,
  loading: loading.models.orders,
}))
export default class View extends PureComponent {
  static defaultProps = {
    searchDefault: {
      orderTime: null, // getStartTimeAndEndTimeFor6Months(),
      pageInfo: {
        pageSize: 20,
      },
    },
  };

  render() {
    const { orders, loading, searchDefault } = this.props;

    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_order_list)}>
        <Card>

          <PanelList>

            <SearchHeader {...this.props} />

            <BatchSearchList
              {...this.props}
              radioChange={this.handleRadioChange}
            />

            <TableOrderList
              {...this.props}
              isExpanded
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns(this, searchDefault)}
              // dataSource={transformOrderList(orders?.list?.list)}
              dataSource={orders?.list?.list}
              pagination={orders?.list?.pagination}
              initExpandEdRowKey={(dataSource) => {
                return transformExpandEdRowKey(dataSource);
              }}
              rowKey="orderId"
              expandedRowKey="orderGoodsId"
              expandedTotal={orders?.queryOrdeListTotalCount || 0}
            />

          </PanelList>

        </Card>
      </PageHeaderLayout>
    );
  }
}
