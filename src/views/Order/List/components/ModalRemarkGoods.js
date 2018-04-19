/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:24:04
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-16 20:47:15
 *
 * 备注商品弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal } from 'antd';

import ModalSelectGoods from './ModalSelectGoods';

class ModalRemarkGoods extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
  }

  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
    });
  }

  handleModalOk = () => {
    this.setState({
      showModal: false,
    });
  }

  render() {
    const { hideBtn } = this.props;
    const { showModal, loading } = this.state;

    const btnElm = <Button type="primary" onClick={this.handleButtonClick}>备注商品</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="备注商品"
        okText="保存"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <div>
          <ModalSelectGoods />
        </div>
      </Modal>,
    ];
  }
}

export default ModalRemarkGoods;
