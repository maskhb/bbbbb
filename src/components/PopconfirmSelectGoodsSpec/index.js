/*
 * @Author: wuhao
 * @Date: 2018-04-17 15:20:39
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-12 13:08:05
 *
 * 商品规格选择
 */
import React, { PureComponent } from 'react';

import { Table, Popconfirm, message } from 'antd';

import './index.less';

class PopconfirmSelectGoodsSpec extends PureComponent {
  static defaultProps = {};

  state = {
    selectedRowKeys: [],
    selectedRows: [],
    visible: false,
  }

  getColumns = () => {
    return [
      {
        title: '规格',
        dataIndex: 'propertyValue',
      },
      {
        title: '库存',
        dataIndex: 'remainNum',
      },
    ];
  }

  handleTableSelectRowKeysChange = (selectedRowKeys, selectedRows) => {
    const [rowObj] = selectedRows;
    const { status } = rowObj || {};
    if (status !== 2) {
      message.error('非上架状态不能选择');
      return;
    }
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }

  handleConfirm = () => {
    const { onConfirm } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length < 1) {
      message.error('请选择选项后再进行此操作');
      return;
    }

    if (onConfirm) {
      onConfirm(selectedRows?.[0]);
    }

    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
    });
  }

  handleCancel = () => {
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
    });
  }

  handleClick = () => {
    this.setState({
      visible: true,
    });
  }

  render() {
    const { children, dataSource, columns = this.getColumns(), title = '选择规格', className = '', isMoreSelect = false } = this.props;
    const { selectedRowKeys, visible } = this.state;

    return (
      <Popconfirm
        overlayClassName={`${className} component_popconfirm_select_goods_spec`}
        onConfirm={this.handleConfirm}
        onCancel={this.handleCancel}
        visible={visible}
        title={(
          <Table
            key="jj_cc_psfs_table"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            size="small"
            title={() => title}
            rowSelection={{
              type: isMoreSelect ? 'checkbox' : 'radio',
              selections: true,
              selectedRowKeys,
              onChange: this.handleTableSelectRowKeysChange,
            }}
          />
        )}
      >
        {
          React.Children.map(children, child => React.cloneElement(child, {
            onClick: this.handleClick,
          }))
        }
      </Popconfirm>
    );
  }
}

export default PopconfirmSelectGoodsSpec;
