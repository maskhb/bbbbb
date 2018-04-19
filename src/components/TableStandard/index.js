import React, { PureComponent } from 'react';
import { Table, Alert } from 'antd';
import emitter from '../../utils/events';
import './index.less';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class TableStandard extends PureComponent {
  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedRows?.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { setSelectedRows } = this.props;
    setSelectedRows(selectedRows);
    this.setState({ selectedRowKeys });
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { stateOfSearch, searchDefault, uuid } = this.props;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]) || searchDefault[key];
      return newObj;
    }, {});

    const params = {
      ...stateOfSearch,
      ...filters,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    emitter.emit(`panellist.search.${uuid}`, null, params);

    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, this.props, params);
    }
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys } = this.state;
    const { batch, hideColumns = [], selectedRows, disableRowSelection } = this.props;

    const columns = this.props.columns?.filter(col => (
      col.hide || hideColumns.includes(col.dataIndex) ? null : col
    ));

    const pagination = this.props.pagination
      ? {
        showSizeChanger: true,
        showQuickJumper: true,
        ...this.props.pagination,
      }
      : false;

    const footer = () => (
      <span>
        共搜索到<span styleName="bold">{pagination?.total || 0}</span>条数据
      </span>
    );

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div styleName="TableStandard">
        {
          !disableRowSelection && selectedRows
            ? (
              <Alert
                message={(
                  <div>
                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                    <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
                  </div>
                )}
                type="info"
                showIcon
              />
            )
            : ''
        }
        <div styleName="tableAlert">
          {batch}
        </div>
        <Table
          {...this.props}
          rowSelection={disableRowSelection ? null : selectedRows ? rowSelection : null}
          onSelectRow={this.handleSelectRows}
          columns={columns}
          pagination={pagination}
          footer={footer}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default TableStandard;
