/*
 * @Author: wuhao
 * @Date: 2018-09-21 11:07:46
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-25 20:07:49
 *
 * 房源管理 - 房型管理 - 启用房型
 */
import React, { PureComponent } from 'react';

import {
  Modal,
  message,
} from 'antd';

class ModalEnable extends PureComponent {
  static defaultProps = {};

  state = {}

  reqOk = async () => {
    const { record, dispatch, refreshTable } = this.props;

    const res = await dispatch({
      type: 'roomType/updateStatusForEnable',
      payload: {
        roomTypeId: record?.roomTypeId,
      },
    });

    if (res) {
      message.success('启用房型成功');
      if (refreshTable) { refreshTable(); }
    }
  }

  handleClick = () => {
    Modal.confirm({
      title: '确定要启用该房型？',
      okText: '确认',
      cancelText: '取消',
      onOk: this.reqOk,
    });
  }

  render() {
    return (
      <a onClick={this.handleClick}>启用</a>
    );
  }
}

export default ModalEnable;
