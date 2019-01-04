
import React, { PureComponent } from 'react';
import { Card, Input, Button, Modal, message } from 'antd';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import PanelList, { Search, Table } from 'components/PanelList';
import { connect } from 'dva';
import Authorized from 'utils/Authorized';

import AddModal from './component/AddModal';
import RoleGroupModal from './component/RoleGroupModal';
import Common from './../common/common';

import { getColumns } from './columns';

@connect(({ accountInfo, user, loading }) => ({
  accountInfo, user, loading: loading.models.accountInfo,
}))

class View extends PureComponent {
   static defaultProps = {};

   state = {
     organizeTree: [],
     formModalVisible: false,
     roleModalVisible: false,
     selectedRoleKeys: [],
     currentItem: {},
   };

   componentDidMount() {
     this.search.handleSearch();
     this.getOrglist();
   }

  onModalOk = async (value, cb) => {
    this.props.dispatch({
      type: value.accountId ? 'accountInfo/update' : 'accountInfo/add',
      payload: value,
    }).then((rs) => {
      if (rs) {
        message.success(value.accountId ? '编辑成功' : '新增成功');
        this.search.handleSearch();
        this.setState({
          formModalVisible: false,
        }, () => {
          this.state.currentItem = {};
          cb?.();
        });
      }
    });
  }

  onSetRole = () => {
    const params = this.state.selectedRoleKeys.map((k) => {
      const [orgId, roleId] = k.split('-');
      return {
        orgId,
        roleId,
        accountId: this.state.currentItem.accountId,
      };
    });
    if (params.length === 0) {
      params.push({
        orgId: null,
        roleId: null,
        accountId: this.state.currentItem.accountId,
      });
    }
    this.props.dispatch({
      type: 'accountInfo/setRole',
      payload: params,
    }).then((rs) => {
      if (rs || rs === undefined) {
        message.success('设置成功！');
      }
      this.search.handleSearch();
      this.setState({
        roleModalVisible: false,
      }, () => {
        this.state.currentItem = {};
        this.state.selectedRoleKeys = [];
      });
    });
  }
  getOrglist = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseSetting/searchOrgList',
      payload: 0,
    }).then((suc) => {
      if (suc) {
        const organizeTree = Common.getOrgTreeData(suc);
        this.setState({
          organizeTree,
        });
      }
    });
  };

  handleSearch = (values = {}) => {
    const { userName, loginName, ...other } = values;
    this.props.dispatch({
      type: 'accountInfo/list',
      payload: {
        ...other,
        accountInfoVO: {
          userName,
          loginName,
        },
      },
    });
  }


  handleAdd = () => {
    this.setState({
      formModalVisible: true,
      currentItem: {},
    });
  }

  handleEditItem = (item) => {
    this.setState({
      formModalVisible: true,
      currentItem: { ...item },
    });
  }

  handleToggleStatus = (item, status) => {
    Modal.confirm({
      title: status === 1 ? '确认要启用该用户？' : '确认要修改该用户？',
      onOk: () => {
        this.props.dispatch({
          type: 'accountInfo/changeStatus',
          payload: {
            ...item,
            status,
          },
        }).then((rs) => {
          if (rs) {
            message.success('状态修改成功！');
          }
          this.search.handleSearch();
        });
      },
    });
  }

  handleRemove = (item) => {
    Modal.confirm({
      title: '确认要删除该用户',
      onOk: () => {
        this.props.dispatch({
          type: 'accountInfo/remove',
          payload: item,
        }).then((rs) => {
          if (rs) {
            message.success('删除成功！');
          }
          this.search.handleSearch();
        });
      },
    });
  }
  handleSetRole = (item) => {
    this.props.dispatch({
      type: 'accountInfo/roleGroupsByAccount',
      payload: item,
    }).then(() => {
      const data = this.props.accountInfo.roleGroups?.[item.accountId] || [];
      const keys = [];
      data.forEach((d) => {
        d.rolesRelated.forEach((r) => {
          if (r.isSelected) {
            keys.push(`${d.orgId}-${r.roleId}`);
          }
        });
      });
      this.setState({
        currentItem: item,
        roleModalVisible: true,
        selectedRoleKeys: keys,
      });
    });
  }


  render() {
    const { accountInfo: { list, pagination }, user: { AccountOrgsInTree }, loading } = this.props;

    return (
      <PageHeaderLayout>
        <Card
          title="账号管理"
          extra={
            <Authorized authority="PMS_BASICSETTING_ACCOUNT_ADD">
              <Button onClick={this.handleAdd}>+新建账号</Button>
            </Authorized>
          }
        >
          <PanelList>
            <Search
              searchDefault={{ pageSize: 10, accountInfoVO: {} }}
              onSearch={this.handleSearch}
              ref={(inst) => { this.search = inst; }}
            >
              <Search.Item label="使用人姓名" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('userName', {
                    })(
                      <Input />
                    )
                  )
                }
              </Search.Item>
              <Search.Item label="登录账号" simple>
                {
                  ({ form }) => (
                    form.getFieldDecorator('loginName', {
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
              rowKey="accountId"
              dataSource={list}
              pagination={pagination}
              disableRowSelection
            />
          </PanelList>
        </Card>
        <AddModal
          visible={this.state.formModalVisible}
          AccountOrgsInTree={AccountOrgsInTree}
          onOk={this.onModalOk}
          data={this.state.currentItem}
          organizeTree={this.state.organizeTree}
          onCancel={() => {
             this.setState({
               formModalVisible: false,
             });
           }}
        />
        <RoleGroupModal
          visible={this.state.roleModalVisible}
          accountInfo={this.state.currentItem}
          selectedKeys={this.state.selectedRoleKeys}
          onCheck={(org, role, checked) => {
            const key = `${org.orgId}-${role.roleId}`;
            const { selectedRoleKeys } = this.state;
            if (checked) {
              selectedRoleKeys.push(key);
            } else {
              const i = selectedRoleKeys.indexOf(key);
              if (i > -1) {
                selectedRoleKeys.splice(i, 1);
              }
            }
            this.setState({
              selectedRoleKeys: [...selectedRoleKeys],
            });
          }}
          onCancel={() => {
            this.setState({
              roleModalVisible: false,
              currentItem: {},
            });
          }}
          onOk={this.onSetRole}
          data={this.props.accountInfo?.roleGroups?.[this.state.currentItem?.accountId]}
        />
      </PageHeaderLayout>
    );
  }
}

export default View;
