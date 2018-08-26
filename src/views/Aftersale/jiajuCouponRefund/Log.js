import React, { PureComponent } from 'react';
import { Card } from 'antd';

import PanelList, { Table } from 'components/PanelList';
import SearchHeader from './components/LogSearchHeader';
import { getLogColumns as getListColumns } from './columns';

export default class extends PureComponent {
  static defaultProps = {
    searchDefault: {
      orderTime: null, // getStartTimeAndEndTimeFor6Months(),
      pageInfo: {
        pageSize: 10,
      },
    },
  };
  render() {
    const { jiajuCoupon, loading, searchDefault } = this.props;
    return (
      <Card>

        <PanelList>

          <SearchHeader {...this.props} />

          <Table
            loading={loading}
            searchDefault={searchDefault}
            columns={getListColumns(this)}
            sele
            disableRowSelection
          // dataSource={transformOrderList(orders?.list?.list)}
          // fuck......
            dataSource={jiajuCoupon?.logList?.list}
            pagination={jiajuCoupon?.logList?.pagination}
            rowKey="logId"
          />
        </PanelList>

      </Card>
    );
  }
}
