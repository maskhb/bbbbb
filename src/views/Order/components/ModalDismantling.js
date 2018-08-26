/*
 * @Author: wuhao
 * @Date: 2018-08-10 14:57:42
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-10 15:08:56
 *
 * 拆单
 */
import React, { PureComponent } from 'react';

import { Modal, Button, message } from 'antd';

class ModalDismantling extends PureComponent {
  static defaultProps = {};

  state = {}

  reqCreateSubOrder = async () => {
    const { dispatch, params, refresh } = this.props;
    const res = await dispatch({
      type: 'orders/createSubOrder',
      payload: {
        orderSn: params?.orderSn,
      },
    });

    if (res) {
      message.success('生成子单成功！');

      if (refresh) {
        refresh();
      }
    }
  }

  handleButtonClick = () => {
    Modal.confirm({
      title: '您确认要进行生成子单操作么?',
      content: (<span style={{ color: 'red' }}>请仔细确认，操作后不能还原</span>),
      cancelText: '取消',
      okText: '生成子单',
      onOk: this.reqCreateSubOrder,
    });
  }

  render() {
    return (
      <Button type="primary" onClick={this.handleButtonClick}>生成子单</Button>
    );
  }
}

export default ModalDismantling;
