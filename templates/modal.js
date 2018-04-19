import React, { Component } from 'react';
import { Modal } from 'antd';
import ModalXXX from './ModalXXX';

export default class Demo extends Component {
  state = {
    modalXXXVisible: false,
  };

  modalXXXShow = () => {
    this.setState({ modalXXXVisible: true });
  }
  modalXXXCancel = () => {
    this.setState({ modalXXXVisible: false });
  }
  modalXXXOk = () => {
    this.modalXXXCancel();
  }

  render() {
    return (
      <Modal
        title="title"
        visible={this.state.modalXXXVisible}
        onOk={this.modalXXXOk}
        onCancel={this.modalXXXCancel}
        width="45%"
      >
        <ModalXXX ref={(inst) => { this.modalXXX = inst; }} />
      </Modal>
    );
  }
}
