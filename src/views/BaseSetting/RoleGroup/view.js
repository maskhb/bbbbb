
import React, { PureComponent } from 'react';
import { Batch } from 'components/PanelList';
import { Card, Button, Tree, Input, Modal, Message } from 'antd';
import { connect } from 'dva';
import Authorized from 'utils/Authorized';
import AddModal from './addModal';
import styles from './../view.less';
// import { roleGroupTree } from 'utils/attr/baseSetting';
import Common from './../common/common';

const { Search } = Input;

let dataList = [];

@connect(({ baseSetting }) => ({
  baseSetting,
}))

class View extends PureComponent {
   static defaultProps = {};

   state = {
     organizeTree: [],
     roleGroupTree: [],
     selectedNode: {},
     expandedKeys: [],
     searchValue: '',
     autoExpandParent: true,
     confirmLoading: false,
     modalType: 'add',
     modalVisible: false,
     selectedKeys: [],
   };

  componentWillMount = () => {
    this.query();
    this.getOrglist();
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const { roleGroupTree } = this.state;
    const nodeValue = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(nodeValue) > -1) {
        return Common.getParentKey(item.key, roleGroupTree);
      }
      return null;
    }).filter((item, i, self) => item && self.indexOf(item) === i);
    this.setState({
      expandedKeys,
      searchValue: nodeValue,
      autoExpandParent: true,
    });
  };

  onSelect = (selectedKeys) => {
    const { roleGroupTree } = this.state;
    let sNode = {};
    const selectedKey = selectedKeys[0];
    dataList.map((v) => {
      if (v.key === selectedKey) {
        sNode = v;
        sNode.parentTitle = Common.getParentTitle(v.key, roleGroupTree);
        sNode.parentKey = Common.getParentKey(v.key, roleGroupTree);
      }
      return v;
    });
    this.setState({
      selectedKeys,
      selectedNode: sNode,
    });
  };

  onCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  onOk = () => {
    const { dispatch } = this.props;
    const { modalType, selectedNode } = this.state;
    const { addModal } = this;
    addModal.validateFields((err, values) => {
      if (err) {
        return;
      }
      const postData = Object.assign({}, values);
      if (postData.orgsRelated) {
        const orgsRelated = [];
        postData.orgsRelated.map((v) => {
          orgsRelated.push({ orgId: parseInt(v.value, 10) });
          return v;
        });
        postData.orgsRelated = orgsRelated;
      }
      if (postData.rolesRelated) {
        const rolesRelated = [];
        postData.rolesRelated.map((v) => {
          rolesRelated.push({ roleId: parseInt(v, 10) });
          return v;
        });
        postData.rolesRelated = rolesRelated;
      }
      this.setState({ confirmLoading: true }, () => {
        /* 新增 */
        if (modalType === 'add') {
          dispatch({
            type: 'baseSetting/roleGroupSave',
            payload: postData,
          }).then((suc) => {
            if (suc) {
              Message.success('新增成功');
              this.query();
              this.getOrglist();
              this.setState({ confirmLoading: false, modalVisible: false });
            } else {
              this.setState({ confirmLoading: false });
            }
          });
        } else if (modalType === 'edit') {
          postData.roleGroupId = selectedNode.roleGroupId;
          dispatch({
            type: 'baseSetting/roleGroupSave',
            payload: postData,
          }).then((suc) => {
            if (suc) {
              Message.success('修改成功');
              this.query();
              this.getOrglist();
              this.setState({ confirmLoading: false, modalVisible: false });
            } else {
              this.setState({ confirmLoading: false });
            }
          });
        }
      });
    });
  };


  /* 获取列表内容字符串 */
  getListStr = (list, key) => {
    let str = '';
    if (list) {
      list.map((v, i) => {
        str += v[key];
        if (i < list.length - 1) {
          str += '，';
        }
        return v;
      });
    }
    return str;
  };

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

  query = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseSetting/searchRoleGroupList',
      payload: 0,
    }).then((suc) => {
      if (suc && suc.dataList) {
        const roleGroupTree = Common.getRoleGroupTreeData(suc.dataList);
        dataList = Common.generateList(roleGroupTree, []);
        this.setState({
          selectedKeys: [],
          selectedNode: {},
          roleGroupTree,
        });
      }
    });
  };

  /* 新增角色组 */
  addRoleGroup = () => {
    this.addModal.resetFields();
    this.setState({
      modalType: 'add',
      modalVisible: true,
    });
  };

  /* 修改角色组 */
  editRoleGroup = () => {
    this.addModal.resetFields();
    this.setState({
      modalType: 'edit',
      modalVisible: true,
    });
  };


  /* 删除角色组 */
  delRoleGroup = () => {
    const that = this;
    const { selectedNode } = this.state;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '是否确定要删除该角色组？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'baseSetting/roleGroupDel',
          payload: selectedNode.roleGroupId,
        }).then((suc) => {
          if (suc) {
            that.query();
            Message.success('操作成功!');
          } else if (suc === false) {
            Message.error('操作失败!');
          }
        });
      },
    });
  };

  /* 弹出框 */
  renderModal = () => {
    const { modalVisible, modalType, selectedNode, confirmLoading, organizeTree } = this.state;
    return (
      <AddModal
        ref={(inst) => { this.addModal = inst; }}
        organizeTree={organizeTree}
        selectedNode={selectedNode}
        modalType={modalType}
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onCancel={this.onCancel.bind(this)}
        onOk={this.onOk.bind(this)}
      />
    );
  };

  render() {
    const {
      searchValue, expandedKeys, autoExpandParent, selectedNode, roleGroupTree, selectedKeys,
    } = this.state;
    return (
      <Card>
        {this.renderModal()}
        <h3>
          <span>角色组管理</span>
          <div className="fl_r">
            <Batch>
              <Authorized authority="PMS_BASICSETTING_CHARACTERGROUP_ADD">
                <Button type="gray" onClick={this.addRoleGroup}>+ 新增角色组</Button>
              </Authorized>
            </Batch>
          </div>
        </h3>
        <div className={styles.organization}>
          <div className="organizeList">
            <h1 className="title">角色组列表</h1>
            <div>
              <Search style={{ marginBottom: 8 }} placeholder="请输入角色组名称" onChange={this.onChange} />
              <Tree
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={this.onSelect}
                selectedKeys={selectedKeys}
              >
                { Common.searchLoop(roleGroupTree, searchValue)}
              </Tree>
            </div>
          </div>
          <div className="organizeDetail">
            <h1 className="title">角色组详情</h1>
            {
              selectedNode.key ? (
                <div>
                  <div className="detailTable largeLabel">
                    <div><b>角色组名称：</b><span>{selectedNode.title}</span></div>
                    <div><b>角色组关联组织：</b><span>{this.getListStr(selectedNode.orgsRelated, 'orgName')}</span></div>
                    <div><b>角色组关联角色：</b><span>{this.getListStr(selectedNode.rolesRelated, 'roleName')}</span></div>
                  </div>
                  <div className="fl_r">
                    <Batch>
                      <Authorized authority="PMS_BASICSETTING_CHARACTERGROUP_EDIT">
                        <Button type="primary" onClick={this.editRoleGroup}>编辑角色组</Button>
                      </Authorized>
                    </Batch>
                  </div>
                </div>
              ) : ''
            }
          </div>
        </div>
      </Card>
    );
  }
}

export default View;
