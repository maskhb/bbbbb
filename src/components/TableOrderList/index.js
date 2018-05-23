/*
 * @Author: wuhao
 * @Date: 2018-04-10 10:33:30
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-15 15:39:05
 *
 * 订单表格
 */
import React, { PureComponent } from 'react';

import { Table, Pagination } from 'antd';
import classNames from 'classnames';

import { Table as PanelTable } from '../PanelList';

import emitter from '../../utils/events';

import styles from './index.less';

class TableOrderList extends PureComponent {
  static defaultProps = {};

  state = {
    rowKey: 'orderId',
    expandedRowKeys: [],
  }

  componentWillMount() {
    const { dataSource, getInitExpandedRowKeys } = this.props;
    if (dataSource) {
      this.setState({
        expandedRowKeys: (getInitExpandedRowKeys || this.getInitExpandedRowKeys)(dataSource) || [],
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { getInitExpandedRowKeys } = this.props;
    const { dataSource } = nextProps;
    if (dataSource) {
      this.setState({
        expandedRowKeys: (getInitExpandedRowKeys || this.getInitExpandedRowKeys)(dataSource) || [],
      });
    }
  }

  getInitExpandedRowKeys= (dataSource = []) => {
    const { initExpandEdRowKey } = this.props;
    if (initExpandEdRowKey) {
      return initExpandEdRowKey(dataSource);
    }

    const { rowKey } = this.state;

    const expandedRowKeys = [];
    dataSource.forEach((item) => {
      expandedRowKeys.push(item[rowKey]);
    });

    return expandedRowKeys;
  }

  /**
   * 表格标题和行内容
   */
  getOrderTableColumns = () => {
    const { columns = {}, isColumnSame = false } = this.props;
    const { columns: headColumns = [], parentRender = () => {} } = columns;

    if (isColumnSame) { return columns?.columns; }

    const newColums = [];

    headColumns.forEach((item, index) => {
      newColums.push({
        title: item.title,
        ...item.width ? {
          width: item.width,
        } : {},
        dataIndex: `key_${index}`,
        render: (text, row, idx) => {
          return {
            children: parentRender(text, row, idx, this.props, this.refreshTableOrderList),
            props: {
              colSpan: index === 0 ? headColumns.length : 0,
            },
          };
        },
      });
    });

    return newColums;
  }

  handleExpandedRowsChange = (expandedRowKeys) => {
    this.setState({
      expandedRowKeys: expandedRowKeys || [],
    });
  }

  handleTableChange = (current, pageSize) => {
    const { stateOfSearch, uuid } = this.props;


    const params = {
      ...stateOfSearch,
      // 兼容,不单只有列表页的table,还有许多非列表页的table
      pageInfo: {
        currPage: current,
        pageSize,
      },
    };

    emitter.emit(`panellist.search.${uuid}`, null, params);
  }

  /**
   * 刷新
   */
  refreshTableOrderList = () => {
    const { stateOfSearch, uuid } = this.props;
    emitter.emit(`panellist.search.${uuid}`, null, stateOfSearch);
  }

  /**
   * 表格展开渲染
   */
  reanderTableRows = (record) => {
    const { columns = {}, expandedRowKey = this.state.rowKey } = this.props;
    const {
      columns: bodyColumns = [],
      childrenDataSource = () => {},
      childrenTableRemarks,
    } = columns;

    const newColums = [];

    bodyColumns.forEach((item) => {
      newColums.push({
        ...item,
        ...item.render ? {
          render: (text, row, idx) => {
            return item.isNoChildShow ? '' : item.render(text, row, idx, record, this.props, this.refreshTableOrderList);
          },
        } : {},

      });
    });

    const childDataSource = childrenDataSource(record) || [];
    return childDataSource && childDataSource.length > 0 ? (
      <div>
        <Table
          dataSource={childDataSource}
          bordered
          showHeader={false}
          pagination={false}
          columns={newColums}
          rowKey={expandedRowKey}
        />

        {
        (childrenTableRemarks && childrenTableRemarks(record)) ? (
          <div className="component_order_table_remarks">
            {childrenTableRemarks(record)}
          </div>
        ) : null
      }

      </div>
    ) : (
      <div className="component_order_table_nodata">
        <span>暂无数据</span>
      </div>
    );
  }

  renderNoExpandedHeader = (columns) => {
    return (
      <Table
        columns={columns}
        footer={null}
        pagination={null}
      />
    );
  }

  render() {
    const { className = '', rowKey = this.state.rowKey, isExpanded = false, isColumnSame = false, expandedTotal } = this.props;
    const { expandedRowKeys } = this.state;
    const columns = this.getOrderTableColumns();
    return (
      <div className={classNames(className, styles.component_order_table_div)}>
        {
          isExpanded ? null : this.renderNoExpandedHeader(columns)
        }

        <PanelTable
          {...this.props}
          showHeader={isExpanded}
          className={classNames(styles.component_order_table,
                              isExpanded ? null : styles.component_order_table_noexpanded
                            )}
          columns={columns}
          disableRowSelection
        // defaultExpandAllRows
          expandedRowRender={this.reanderTableRows}
          rowKey={rowKey}
          onExpandedRowsChange={this.handleExpandedRowsChange}
          expandedRowKeys={expandedRowKeys}
          pagination={isExpanded && !isColumnSame ? null : this.props?.pagination}
          totalCount={expandedTotal || this.props?.pagination?.total || 0}
        />

        {
          isExpanded && !isColumnSame ? (
            <div style={{ textAlign: 'right', margin: '16px 0' }}>
              <Pagination
                {...this.props.pagination}
                showQuickJumper
                showSizeChanger
                onChange={this.handleTableChange}
                onShowSizeChange={this.handleTableChange}
              />
            </div>
          ) : null
        }

      </div>
    );
  }
}

export default TableOrderList;
