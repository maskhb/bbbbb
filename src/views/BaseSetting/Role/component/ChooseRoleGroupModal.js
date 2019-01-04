import React, { PureComponent } from 'react';
import { Modal, Table, Button, Input } from 'antd';

// import RoleGroupSelectModal from './RoleGroupSelectModal';
import './styles.less';

export default class ChooseRoleGroupModal extends PureComponent {
  state = {
    modalVisible: false,
    searchKey: '',
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'role/roleGroupList',
    });
  }

  onSelectChange = (selectedRowKeys) => {
    const { onSelectChange } = this.props;
    if (onSelectChange) {
      onSelectChange(selectedRowKeys);
    } else if (this.props.onChange) {
      this.props.onChange(selectedRowKeys);
    }
  }

  handleOk = () => {
    const { role: { roleGroupList }, value } = this.props;
    const { onOk } = this.props;
    if (onOk) {
      onOk(roleGroupList?.dataList?.filter(l => value.indexOf(l.roleGroupId) > -1));
    }
    this.handleCancel();
  }
  handleCancel = () => {
    const { onCancel } = this.props;
    this.setState({
      modalVisible: false,
    });
    if (onCancel) {
      onCancel();
    }
  }

  handleOpen = () => {
    const { onOpen } = this.props;
    if (onOpen) {
      onOpen();
    }
    this.setState({
      modalVisible: true,
    });
  }

  render() {
    const { role: { roleGroupList }, value = [] } = this.props;
    const rowSelection = {
      selectedRowKeys: value,
      onChange: this.onSelectChange,
    };
    return [
      <Button onClick={this.handleOpen}>
        选择
      </Button>,
      <Modal
        onCancel={this.handleCancel}
        onOk={this.handleOk}
        title="选择关联角色组"
        visible={this.state.modalVisible}
        scroll={{ y: 240 }}
      >
        <Input.Search
          style={{ marginBottom: 8 }}
          value={this.state.searchKey}
          placeholder="输入角色组搜索"
          onChange={e => this.setState({ searchKey: e.target.value })}
        />

        <Table
          rowKey="roleGroupId"
          className="choose-role-group-modal-table"
          rowSelection={rowSelection}
          pagination={false}
          dataSource={roleGroupList?.dataList.filter(d => (
            d.roleGroupName.indexOf(this.state.searchKey) > -1)
          )}
          columns={[
            { title: '角色组名称', dataIndex: 'roleGroupName' },
          ]}
        />
      </Modal>,
    ];
  }
}
