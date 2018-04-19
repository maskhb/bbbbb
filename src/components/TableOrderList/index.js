/*
 * @Author: wuhao
 * @Date: 2018-04-10 10:33:30
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-17 18:41:35
 *
 * 订单表格
 */
import React, { PureComponent } from 'react';

import { Table } from 'antd';
import classNames from 'classnames';

import { Table as PanelTable } from '../PanelList';

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
    const { columns = {} } = this.props;
    const { columns: headColumns = [], parentRender = () => {} } = columns;

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
            children: parentRender(text, row, idx),
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

  /**
   * 表格展开渲染
   */
  reanderTableRows = (record) => {
    const { columns = {} } = this.props;
    const { columns: bodyColumns = [], childrenDataSource = () => {} } = columns;

    const newColums = [];

    bodyColumns.forEach((item) => {
      newColums.push({
        ...item,
        ...item.render ? {
          render: (text, row, idx) => {
            return item.render(text, row, idx, record);
          },
        } : {},

      });
    });

    return (
      <Table
        dataSource={childrenDataSource(record)}
        bordered
        showHeader={false}
        pagination={false}
        columns={newColums}
      />
    );
  }

  render() {
    const { className = '', rowKey = this.state.rowKey, isExpanded = false } = this.props;
    const { expandedRowKeys } = this.state;
    return (
      <PanelTable
        {...this.props}
        className={classNames(className,
                              styles.component_order_table,
                              isExpanded ? null : styles.component_order_table_noexpanded
                            )}
        columns={this.getOrderTableColumns()}
        disableRowSelection
        // defaultExpandAllRows
        expandedRowRender={this.reanderTableRows}
        rowKey={rowKey}
        onExpandedRowsChange={this.handleExpandedRowsChange}
        expandedRowKeys={expandedRowKeys}
      />
    );
  }
}

export default TableOrderList;
