
import React, { PureComponent } from 'react';
import { Card, Input, Button, Modal, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Table } from 'components/PanelList';
import { connect } from 'dva';
import Authorized from 'utils/Authorized';

import { getColumns } from './columns';
import ModalForm from './component/ModalForm';
import RoleGroupSelectModal from './component/RoleGroupSelectModal';

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))

class View extends PureComponent {
  static defaultProps = {};

  state = {
    modalVisible: false,
    currentItem: {},
    roleModalVisible: false,
    roleModalType: null,
    selectedAuths: [],
  };

  componentDidMount() {
    this.search.handleSearch();
  }

  onUpdateRole = () => {
    this.props.dispatch({
      type: 'role/setRoleAuths',
      payload: {
        roleId: this.state.currentItem.roleId,
        authIds: this.state.selectedAuths.map(l => Number(l)).filter(l => !!l),
      },
    }).then((rs) => {
      if (rs) {
        message.success('设置权限成功！！');
        this.setState({
          roleModalVisible: false,
        }, () => {
          this.state.currentItem = {};
        });
      }
    });
  }

  onUpdateOrSave = (value, cb) => {
    this.props.dispatch({
      type: value?.roleVO?.roleId ? 'role/update' : 'role/add',
      payload: {
        ...value,
      },
    }).then((rs) => {
      if (rs) {
        message.success(value?.roleVO?.roleId ? '修改成功！！' : '新建成功！！');
        this.search.handleSearch();
        this.setState({
          modalVisible: false,
        }, () => {
          this.state.currentItem = {};
          cb?.();
        });
      }
    });
  }


  handleSearch = (values = {}) => {
    // this.props.dispatch({
    //   type: 'role/getAuths',
    // });
    const { roleName, ...other } = values;
    this.props.dispatch({
      type: 'role/list',
      payload: {
        ...other,
        roleVO: {
          roleName,
        },
      },
    });
  }

  handleShowRole = (item, action) => {
    this.props.dispatch({
      type: 'role/getAuthsOfRole',
      payload: {
        roleId: item.roleId,
      },
    }).then(() => {
      const { role: { auths = {} } } = this.props;
      const selectedAuths = [];
      auths[item.roleId]?.forEach((group) => {
        group.authModuleVOs.forEach((mod) => {
          mod.authVOs.forEach((auth) => {
            if (auth.isSelected) {
              selectedAuths.push(`${auth.authId}`);
            }
          });
        });
      });
      this.setState({
        currentItem: item,
        roleModalVisible: true,
        roleModalType: action,
        selectedAuths,
      });
    });
  }

  handleAdd = () => {
    this.setState({
      modalVisible: true,
      currentItem: {},
      roleModalVisible: false,
    });
  }

  handleRoleCheck = (keys) => {
    this.setState({
      selectedAuths: keys,
    });
  }

  handleEditItem = (item) => {
    this.setState({
      modalVisible: true,
      currentItem: item,
    });
  }

  handleRemove = (item) => {
    Modal.confirm({
      content: '是否确认要删除该角色？',
      onOk: () => {
        this.props.dispatch({
          type: 'role/remove',
          payload: item,
        }).then((rs) => {
          if (rs) {
            message.success('删除成功！！');
            this.search.handleSearch();
          }
        });
      },
    });
  }

  render() {
    // const { baseSetting } = this.props;
    // const { queryList } = baseSetting || {};
    const { role: { list, pagination, auths = {} }, loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card
          title="角色管理"
          extra={
            <Authorized authority="PMS_BASICSETTING_CHARACTER_ADD">
              <Button onClick={this.handleAdd}>+新建角色</Button>
            </Authorized>
          }
        >
          <PanelList>
            <Search
              onSearch={this.handleSearch}
              ref={(inst) => { this.search = inst; }}
            >
              <Search.Item label="角色名称" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('roleName', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
            </Search>
            {/* <Divider /> */}
            <Table
              loading={!!loading}
              columns={getColumns(this)}
              rowKey="roleId"
              dataSource={list}
              pagination={pagination}
              disableRowSelection
            />
          </PanelList>
          <ModalForm
            visible={this.state.modalVisible}
            dispatch={this.props.dispatch}
            role={this.props.role}
            onOk={this.onUpdateOrSave}
            onCancel={() => this.setState({ modalVisible: false, currentItem: {} })}
            data={this.state.currentItem}
          />
          <RoleGroupSelectModal
            onCancel={() => {
              this.setState({
                roleModalVisible: false,
                currentItem: {},
              });
            }}
            selectedAuths={this.state.selectedAuths}
            onOk={this.onUpdateRole}
            data={auths[this.state.currentItem.roleId]}
            onCheck={this.handleRoleCheck}
            role={this.state.currentItem}
            visible={this.state.roleModalVisible}
            type={this.state.roleModalType}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}

export default View;
