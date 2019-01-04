/*
 *
 * 房间管理 - 房型管理 - 操作结果表格
 */
import React, { PureComponent } from 'react';

import emitter from 'utils/events';

import Table from 'components/TableStandard';

import getColumns from './columns';

class OperTable extends PureComponent {
  static defaultProps = {};

  state = {}

  /**
   * 刷新列表
   */
  refreshTable = () => {
    const { stateOfSearch, uuid } = this.props || {};
    emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
  }

  render() {
    const { searchDefault, loading, data } = this.props;
    return (
      <Table
        {...this.props}
        loading={loading}
        columns={getColumns(this)}
        searchDefault={searchDefault}
        disableRowSelection
        rowKey="roomId"
        dataSource={data?.list}
        pagination={data?.pagination}
      />
    );
  }
}

export default OperTable;
