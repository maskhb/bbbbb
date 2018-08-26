import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import classNames from 'classnames';

import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Table } from 'components/PanelList';

import SearchHeader from './components/SearchHeader';

import getColumns from './columns';

import styles from './index.less';

@connect(({ aftersale, propertyKey, goods, loading }) => ({
  aftersale,
  propertyKey,
  goods,
  loading: loading.models.aftersale,
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

  handleResetCheckbox = () => {
    this.tableRef?.cleanSelectedKeys();
  }

  render() {
    const { aftersale, loading, searchDefault } = this.props;
    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_order_list)}>
        <Card>

          <PanelList>

            <SearchHeader {...this.props} handleResetCheckbox={this.handleResetCheckbox} />

            <Table
              loading={loading}
              searchDefault={searchDefault}
              columns={getColumns().columns}
              ref={(ref) => {
                this.tableRef = ref;
              }}
              // dataSource={transformOrderList(orders?.list?.list)}
              // fuck......
              dataSource={aftersale?.applyList?.list?.map((l) => {
                // eslint-disable-next-line
                l.disabled = l.shutDownStatus === 2;
                return l;
              })}
              pagination={aftersale?.applyList?.pagination}
              rowKey="applyOrderId"
            />

          </PanelList>

        </Card>
      </PageHeaderLayout>
    );
  }
}
