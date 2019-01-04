
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Tree, Input } from 'antd';
import request from 'utils/request';
import { orgId } from 'utils/getParams';

const { TreeNode } = Tree;
const { Search } = Input;

class DepartmentSelector extends Component {
  state = {
    infoModalShow: false,
  };


  componentDidMount() {
    this.init();
  }
  componentWillUnmount() {
    this.setState({ infoModalShow: false });
  }
  init= async () => {}


  showModal = () => {
    this.setState({ infoModalShow: true });
  }
  // 点击确定
  handleOk = () => {
    // do sth...
    this.props.okCallBack();
    this.setState({ infoModalShow: false });
  }

  // 点击取消
  handleCancel() {
    this.props.cancelCallBack();
    this.setState({ infoModalShow: false });
  }


  render() {
    const { infoModalShow } = this.state;
    const { text, buttonType } = this.props;

    return (
      <div>
        {buttonType === 'button' ? (
          <Button
            type="primary"
            onClick={this.showModal.bind(this)}
          >
            {text}
          </Button>
        ) : (
          <a onClick={this.showModal.bind(this)}>
            {text}
          </a>
          )}

        {infoModalShow ? (
          <Modal
            title="选择部门"
            visible={infoModalShow}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
          >

            12345

          </Modal>
        ) : ''}
      </div>
    );
  }
}
DepartmentSelector.defaultProps = {
  buttonType: 'button',
  text: '选择',
  cancelCallBack: () => {},
};

DepartmentSelector.propTypes = {
  buttonType: PropTypes.string,
  cancelCallBack: PropTypes.func,
  text: PropTypes.string,
  okCallBack: PropTypes.func.isRequired,
};

export default DepartmentSelector;
