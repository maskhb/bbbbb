/*
 * @Author: wuhao
 * @Date: 2018-09-21 11:07:37
 * @Last Modified by: nic
 * @Last Modified time: 2018-10-08 17:37:55
 *
 * 房源管理 - 房型管理 - 禁用房型
 */
import React, { PureComponent } from 'react';

import {
  Modal,
  message,
} from 'antd';

class ModalDisable extends PureComponent {
  static defaultProps = {};

  state = {}

  reqOk = async () => {
    const { record, dispatch, refreshTable } = this.props;

    const res = await dispatch({
      type: 'room/updateStatusForDisable',
      payload: {
        roomId: record?.roomId,
      },
    });

    if (res) {
      message.success('禁用房间成功');
      if (refreshTable) { refreshTable(); }
    }
  }

  handleClick = () => {
    Modal.confirm({
      title: '确定要禁用该房间？',
      okText: '确认',
      cancelText: '取消',
      onOk: this.reqOk,
    });
  }

  render() {
    return (
      <a onClick={this.handleClick}>禁用</a>
    );
  }
}

export default ModalDisable;
