import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

export default class ModalCover extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }


  state = {
    modalVisible: false,
  };
  modalShow = () => {
    this.setState({ modalVisible: true });
  }

  modalCancel = () => {
    if (this.props.onCancel instanceof Function) {
      this.props.onCancel();
    }
    this.setState({ modalVisible: false });
  }

  modalOk = async () => {
    if (this.props.onOk instanceof Function) {
      const status = await this.props.onOk();
      if (status !== false) {
        this.modalCancel();
      }
    }
  }

  render() {
    const { children, content, ...otherProps } = this.props;
    const { modalVisible } = this.state;
    return (
      <span>
        {children instanceof Function && children(this.modalShow)}
        <Modal
          visible={modalVisible}
          {...otherProps}
          onCancel={this.modalCancel}
          onOk={this.modalOk}
        >
          {content}
        </Modal>
      </span>
    );
  }
}
