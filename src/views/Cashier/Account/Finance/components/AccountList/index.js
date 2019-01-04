import React, { PureComponent } from 'react';
import { Table, Spin } from 'antd';
import { connect } from 'dva';
import getColumns from './columns';
import getChildColumns from './childrenColumns';


@connect(({ cashier }) => ({
  cashier,
}))
class view extends PureComponent {
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [], // regNo [list]
      selectRowKeyMap: {}, // regNo_${row.regNo} === 需要的id
    };
  }


  expandedRowRender = (record, index, indent, expanded) => {
    const data = record.creditAccountDetailsList;

    return (
      <Table
        columns={getChildColumns(this)}
        dataSource={data}
        pagination={false}
        rowSelection={this.handleRowSelection(record)}
        rowKey="creditAccountId"
      />
    );
  };

  handleSelectChildren = (fromParentRecord, cselectedRowKeys = []) => {
    const { regNo, creditAccountDetailsList = [] } = fromParentRecord;
    const { selectedRowKeys = [], selectRowKeyMap = {} } = this.state;
    selectRowKeyMap[`regNo_${regNo}`] = cselectedRowKeys;
    const res = {
      selectRowKeyMap: {
        ...selectRowKeyMap,
      },
      selectedRowKeys: [
        ...selectedRowKeys.filter(item => item !== regNo),
        ...cselectedRowKeys.length > 0 && cselectedRowKeys.length === creditAccountDetailsList.length ? [regNo] : [],
      ],
    };
    this.setState(res);
    this.props.dispatch({ type: 'cashier/saveSelectedInfo', payload: res });
    // console.log('props', this.props.cashier.Selected);
  }

  handleRowSelection=(fromParentRecord) => {
    const { selectedRowKeys = [], selectRowKeyMap = {} } = this.state;
    const self = this;
    if (fromParentRecord) {
      // 内层操作
      return {
        selectedRowKeys: selectRowKeyMap[`regNo_${fromParentRecord.regNo}`] || [],
        onChange: (cselectedRowKeys, cselectedRows) => { self.handleSelectChildren(fromParentRecord, cselectedRowKeys, cselectedRows); },
      };
    } else {
      // 外层操作
      return {
        selectedRowKeys,
        onSelect: this.handleOnParentSelect,
        onSelectAll: this.handleOnParentSelectAll,
        onSelectInvert: this.handleOnParentSelectInvert,
      };
    }
  }

  handleOnParentSelect = (record, selected, selectedRows = []) => {
    const { creditAccountDetailsList } = record || {};

    const { selectRowKeyMap } = this.state;
    if (selected) {
      selectRowKeyMap[`regNo_${record.regNo}`] = (creditAccountDetailsList || []).map(item => item.creditAccountId);
    } else {
      selectRowKeyMap[`regNo_${record.regNo}`] = [];
    }

    const selectedRowKeys = selectedRows?.map(item => item.regNo) || [];
    const res = {
      selectRowKeyMap: {
        ...selectRowKeyMap,
      },
      selectedRowKeys: [
        ...selectedRowKeys,
      ],
    };
    this.setState(res);
    this.props.dispatch({ type: 'cashier/saveSelectedInfo', payload: res });
    // console.log('props', this.props.cashier.Selected);
  }

  handleOnParentSelectAll = (selected, selectedRows = []) => {
    const selectRowKeyMap = {};
    if (selected) {
      for (let i = 0, len = selectedRows.length; i < len; i++) {
        const row = selectedRows[i];
        const { creditAccountDetailsList } = row || {};
        selectRowKeyMap[`regNo_${row.regNo}`] = (creditAccountDetailsList || []).map(item => item.creditAccountId);
      }
    }

    const selectedRowKeys = selectedRows.map(item => item.regNo) || [];
    const res = {
      selectRowKeyMap: {
        ...selectRowKeyMap,
      },
      selectedRowKeys: [
        ...selectedRowKeys,
      ],
    };
    this.setState(res);
    this.props.dispatch({ type: 'cashier/saveSelectedInfo', payload: res });
    // console.log('props', this.props.cashier.Selected);
  }

  handleOnParentSelectInvert = (selectedRows) => {
    this.handleOnParentSelectAll(true, selectedRows);
  }

  render() {
    const { loading = false, sourseData } = this.props;

    return (
      <Spin spinning={loading}>
        <Table
          className="components-table-demo-nested"
          columns={getColumns(this)}
          expandedRowRender={this.expandedRowRender}
          dataSource={sourseData?.list}
          bordered
          rowSelection={this.handleRowSelection()}
          rowKey="regNo"
          // expandRowByClick
        />
      </Spin>
    );
  }
}

export default view;
