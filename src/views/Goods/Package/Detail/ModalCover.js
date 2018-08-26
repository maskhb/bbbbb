import React from 'react';
import { Modal } from 'antd';

export default class ModalCover extends React.Component {
  state = {
    modalGoodsListVisible: false,
  };
  modalGoodsListShow = () => {
    this.setState({ modalGoodsListVisible: true });
  }

  modalGoodsListCancel = () => {
    if (this.props.onCancel instanceof Function) {
      this.props.onCancel();
    }
    this.setState({ modalGoodsListVisible: false });
  }

  modalGoodsListOk = async () => {
    if (this.props.onOk instanceof Function) {
      const status = await this.props.onOk();
      if (status !== false) {
        this.modalGoodsListCancel();
      }
    }
  }

  render() {
    const { children, content, ...otherProps } = this.props;
    const { modalGoodsListVisible } = this.state;
    return (
      <span>
        {children instanceof Function && children(this.modalGoodsListShow)}
        <Modal
          visible={modalGoodsListVisible}
          {...otherProps}
          onCancel={this.modalGoodsListCancel}
          onOk={this.modalGoodsListOk}
        >
          {modalGoodsListVisible ? content : null}
        </Modal>
      </span>
    );
  }
}
