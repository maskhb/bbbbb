/*
 * @Author: wuhao
 * @Date: 2018-06-13 14:37:17
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-06-22 11:28:59
 *
 * 确认签收弹框组件
 */
import React, { PureComponent } from 'react';

import { Button, Modal, message } from 'antd';

class ModalSignInReturnGoods extends PureComponent {
  static defaultProps = {};

  state = {}

  handleConfirmOk = async () => {
    const { dispatch, params, refresh } = this.props;
    const { applyOrderId } = params || {};

    await dispatch({
      type: 'aftersale/confirmReceiptForReturnOrder',
      payload: {
        applyOrderId,
      },
    });

    const { aftersale } = this.props;
    const { confirmReceiptForReturnOrder } = aftersale || {};

    if (confirmReceiptForReturnOrder) {
      message.success('确认签收成功');
    }

    if (refresh) {
      refresh();
    }
  }

  handleButtonClick = () => {
    Modal.confirm({
      title: '确定要签收入库操作吗?',
      content: '请确认已收到退货商品。',
      okText: '确认',
      cancelText: '取消',
      onOk: this.handleConfirmOk,
    });
  }

  render() {
    return (
      <Button type="primary" onClick={this.handleButtonClick}>确认签收</Button>
    );
  }
}

export default ModalSignInReturnGoods;
