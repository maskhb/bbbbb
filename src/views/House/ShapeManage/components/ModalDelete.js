/*
 * @Author: wuhao
 * @Date: 2018-09-21 10:55:47
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-25 20:09:11
 *
 * 房源管理 - 房型管理 - 删除房型
 */
import React, { PureComponent } from 'react';

import {
  Modal,
  message,
} from 'antd';

class ModalDelete extends PureComponent {
  static defaultProps = {};

  state = {}

  reqOk = async () => {
    const { record, dispatch, refreshTable } = this.props;

    const res = await dispatch({
      type: 'roomType/deleteRoomType',
      payload: {
        roomTypeId: record?.roomTypeId,
      },
    });

    if (res) {
      message.success('删除房型成功');
      if (refreshTable) { refreshTable(); }
    }
  }

  handleClick = () => {
    Modal.confirm({
      title: '确定要删除该房型？',
      okText: '确认',
      cancelText: '取消',
      onOk: this.reqOk,
    });
  }

  render() {
    return (
      <a onClick={this.handleClick}>删除</a>
    );
  }
}

export default ModalDelete;
