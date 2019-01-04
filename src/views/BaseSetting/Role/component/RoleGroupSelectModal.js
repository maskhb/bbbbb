import React from 'react';
import { Modal, Row } from 'antd';
import RoleGroupTree from './RoleGroupTree';
// const { Search } = Input;
import './styles.less';


export default class RoleGroupSelectModal extends React.Component {
  onOk = () => {
    this.setState({
    });
  }

  onCancel = () => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
    }
  }

  onOk = () => {
    const { onOk } = this.props;
    if (onOk) {
      onOk();
    }
  }

  renderRoleGroupSelect = () => {
    const { data = [], selectedAuths, onCheck, type } = this.props;
    return (
      <Row gutter={8} className="role-group-select-modal-container">
        <RoleGroupTree
          data={data}
          selectedAuths={selectedAuths}
          onCheck={onCheck}
          disabled={type !== 'edit'}
        />
      </Row>
    );
  }

  render() {
    const { visible, type } = this.props;
    const defaultProps = {};
    if (type !== 'edit') {
      defaultProps.footer = false;
    }
    return (
      <Modal
        {...defaultProps}
        title={type === 'edit' ? '设置权限' : '查看权限'}
        width={880}
        visible={visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        {this.renderRoleGroupSelect()}
      </Modal>
    );
  }
}
