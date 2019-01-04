
import React, { PureComponent } from 'react';
import { Batch } from 'components/PanelList';
import { Card, Button, Tree, Input, Modal, Message } from 'antd';
import { connect } from 'dva';
import Authorized from 'utils/Authorized';
// import { organizeTree } from 'utils/attr/baseSetting';
import AddModal from './addModal';
import Common from './../common/common';
import styles from './../view.less';

const { Search } = Input;

let dataList = [];

@connect(({ baseSetting, user }) => ({
  baseSetting,
  user,
}))

class View extends PureComponent {
   static defaultProps = {};

   state = {
     organizeTree: [],
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
  };

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = (e) => {
    const { organizeTree } = this.state;
    const nodeValue = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(nodeValue) > -1) {
        return Common.getParentKey(item.key, organizeTree);
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
    const { organizeTree } = this.state;
    let sNode = {};
    const selectedKey = selectedKeys[0];
    dataList.map((v) => {
      if (v.key === selectedKey) {
        sNode = v;
        sNode.parentTitle = Common.getParentTitle(v.key, organizeTree);
        sNode.parentKey = Common.getParentKey(v.key, organizeTree);
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
      if (postData.parentId) {
        postData.parentId = parseInt(postData.parentId, 10);
      }
      if (postData.region && postData.region.value.length === 4) {
        [, , , postData.regionId] = postData.region.value;
        postData.regionPath = postData.region.value.join('_');
        postData.regionNamePath = '';
        postData.region.selectedOptions.map((v, i) => {
          postData.regionNamePath += v.label;
          if (i < postData.region.selectedOptions.length - 1) {
            postData.regionNamePath += '_';
          }
          return v;
        });
        delete postData.region;
      }
      this.setState({ confirmLoading: true }, () => {
        /* 新增 */
        if (modalType === 'add') {
          dispatch({
            type: 'baseSetting/orgSave',
            payload: postData,
          }).then((suc) => {
            if (suc) {
              Message.success('新增成功');
              this.query();
              this.updateTopTree();
              this.setState({ confirmLoading: false, modalVisible: false });
            } else {
              this.setState({ confirmLoading: false });
            }
          });
        } else if (modalType === 'edit') {
          postData.orgId = selectedNode.orgId;
          dispatch({
            type: 'baseSetting/orgSave',
            payload: postData,
          }).then((suc) => {
            if (suc) {
              Message.success('修改成功');
              this.query();
              this.updateTopTree();
              this.setState({ confirmLoading: false, modalVisible: false });
            } else {
              this.setState({ confirmLoading: false });
            }
          });
        }
      });
    });
  };

  query = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseSetting/searchOrgList',
      payload: 0,
    }).then((suc) => {
      if (suc) {
        const organizeTree = Common.getOrgTreeData(suc);
        dataList = Common.generateList(organizeTree, []);
        this.setState({
          organizeTree,
          selectedKeys: [],
          selectedNode: {},
        });
      }
    });
  };

  /* 更新顶部组织树 */
  updateTopTree = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getAccountOrgsInTree',
      payload: {},
    });
  };

  /* 新增组织 */
  addOrganize = () => {
    this.addModal.resetFields();
    this.setState({
      modalType: 'add',
      modalVisible: true,
    });
  };

  /* 修改组织 */
  editOrganize = () => {
    this.addModal.resetFields();
    this.setState({
      modalType: 'edit',
      modalVisible: true,
    });
  };


  /* 启用禁用 */
  changeStatus = () => {
    const that = this;
    const { selectedNode } = this.state;
    const { dispatch } = this.props;
    const { status } = selectedNode;
    // 1=>0 禁用
    Modal.confirm({
      title: `是否确定要${status === 1 ? '禁用' : '启用'}该组织？`,
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        await dispatch({
          type: 'baseSetting/orgSave',
          payload: {
            orgId: selectedNode.orgId,
            status: status === 1 ? 2 : 1,
          },
        }).then((suc) => {
          if (suc) {
            that.query();
            that.updateTopTree();
            Message.success('操作成功!');
          } else if (suc === false) {
            Message.success('操作失败!');
          }
        });
      },
    });
  };

  /* 删除组织 */
  delOrganize = () => {
    const that = this;
    const { selectedNode } = this.state;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '是否确定要删除该组织？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'baseSetting/orgDel',
          payload: selectedNode.orgId,
        }).then((suc) => {
          if (suc) {
            that.query();
            Message.success('操作成功!');
          } else if (suc === false) {
            Message.success('操作失败!');
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
      searchValue, expandedKeys, autoExpandParent, selectedNode, organizeTree, selectedKeys,
    } = this.state;
    return (
      <Card>
        {this.renderModal()}
        <h3>
          <span>组织管理</span>
          <div className="fl_r">
            <Batch>
              <Authorized authority="PMS_BASICSETTING_ORGANIZATION_ADD">
                <Button type="gray" onClick={this.addOrganize}>+ 新增组织</Button>
              </Authorized>
            </Batch>
          </div>
        </h3>
        <div className={styles.organization}>
          <div className="organizeList">
            <h1 className="title">组织列表</h1>
            <div>
              <Search style={{ marginBottom: 8 }} placeholder="请输入组织名称" onChange={this.onChange} />
              <Tree
                showLine
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={this.onSelect}
                selectedKeys={selectedKeys}
              >
                { Common.searchLoop(organizeTree, searchValue) }
              </Tree>
            </div>
          </div>
          <div className="organizeDetail">
            <h1 className="title">组织详情</h1>
            {
              selectedNode.key ? (
                <div>
                  <div className="detailTable">
                    <div><b>组织名称：</b><span>{selectedNode.title}</span></div>
                    <div><b>状态：</b><span>{Common.getStatusStr(selectedNode.status)}</span></div>
                    <div><b>组织类型：</b><span>{Common.getOrgTypeStr(selectedNode.orgType)}</span></div>
                    <div><b>组织层级：</b><span>{selectedNode.level}</span></div>
                    {
                      selectedNode.level > 1 ? (<div><b>上级组织：</b><span>{selectedNode.parentTitle}</span></div>) : ''
                    }
                    {
                      selectedNode.orgType === 1 ? (
                        <div>
                          <div>
                            <b>四级地址：</b>
                            <span>{Common.regionNamePathChange(selectedNode.regionNamePath)}</span>
                          </div>
                          <div><b>详细地址：</b><span>{selectedNode.address}</span></div>
                          <div><b>经度：</b><span>{selectedNode.lng}</span></div>
                          <div><b>纬度：</b><span>{selectedNode.lat}</span></div>
                        </div>
                      ) : ''
                    }
                    <div><b>备注：</b><span>{selectedNode.memo}</span></div>
                  </div>
                  <div className="fl_r">
                    <Batch>
                      {
                        selectedNode.level > 1 ? (
                          <Authorized authority="PMS_BASICSETTING_ORGANIZATION_EDIT">
                            <Button type="primary" onClick={this.editOrganize}>编辑组织</Button>
                          </Authorized>
                        ) : ''
                      }
                      {
                        selectedNode.level > 1 ? (
                          selectedNode.status === 1 ? (
                            <Authorized authority="PMS_BASICSETTING_ORGANIZATION_DISABLE">
                              <Button onClick={this.changeStatus}>禁用组织</Button>
                            </Authorized>
                          ) : (
                            <Authorized authority="PMS_BASICSETTING_ORGANIZATION_ENABLED">
                              <Button onClick={this.changeStatus}>启用组织</Button>
                            </Authorized>
                          )
                        ) : ''
                      }
                      {
                        selectedNode.level > 1 && selectedNode.status === 2 ? (
                          <Authorized authority="PMS_BASICSETTING_ORGANIZATION_DELETE">
                            <Button onClick={this.delOrganize}>删除组织</Button>
                          </Authorized>
                        ) : ''
                      }
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
