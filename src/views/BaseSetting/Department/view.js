
import React, { PureComponent } from 'react';
import { Batch } from 'components/PanelList';
import { Card, Button, Tree, Input, Modal, Message } from 'antd';
import { connect } from 'dva';
import Authorized from 'utils/Authorized';
import AddModal from './addModal';
import styles from './../view.less';
// import { departmentTree } from 'utils/attr/baseSetting';
import Common from './../common/common';

const { Search } = Input;

let dataList = [];

@connect(({ baseSetting }) => ({
  baseSetting,
}))

class View extends PureComponent {
   static defaultProps = {};

   state = {
     departmentTree: [],
     selectedNode: {},
     expandedKeys: [],
     searchValue: '',
     autoExpandParent: true,
     confirmLoading: false,
     modalType: '',
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
    const { departmentTree } = this.state;
    const nodeValue = e.target.value;
    const expandedKeys = dataList.map((item) => {
      if (item.title.indexOf(nodeValue) > -1) {
        return Common.getParentKey(item.key, departmentTree);
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
    const { departmentTree } = this.state;
    let sNode = {};
    const selectedKey = selectedKeys[0];
    dataList.map((v) => {
      if (v.key === selectedKey) {
        sNode = v;
        sNode.parentTitle = Common.getParentTitle(v.key, departmentTree);
        sNode.parentKey = Common.getParentKey(v.key, departmentTree);
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
      delete postData.keys;
      if (postData.parentId) {
        postData.parentId = parseInt(postData.parentId, 10);
      }
      if (localStorage.user) {
        const user = JSON.parse(localStorage.user);
        postData.orgId = user.orgIdSelected;
      }

      this.setState({ confirmLoading: true }, () => {
        /* 新增 */
        if (modalType === 'add') {
          dispatch({
            type: 'baseSetting/depListAdd',
            payload: postData,
          }).then((suc) => {
            if (suc) {
              Message.success('新增成功');
              this.query();
              this.setState({ confirmLoading: false, modalVisible: false });
            } else {
              this.setState({ confirmLoading: false });
            }
          });
        } else if (modalType === 'edit') {
          postData.depId = selectedNode.depId;
          dispatch({
            type: 'baseSetting/depSave',
            payload: postData,
          }).then((suc) => {
            if (suc) {
              Message.success('修改成功');
              this.query();
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
    let orgId = 0;
    if (localStorage.user) {
      const user = JSON.parse(localStorage.user);
      orgId = user.orgIdSelected;
    }
    dispatch({
      type: 'baseSetting/searchDepList',
      payload: orgId,
    }).then((suc) => {
      if (suc) {
        const departmentTree = Common.getDepTreeData(suc);
        dataList = Common.generateList(departmentTree, []);
        this.setState({
          selectedKeys: [],
          departmentTree,
          selectedNode: {},
        });
      }
    });
  };

  /* 新增部门 */
  addDepartment = () => {
    this.addModal.resetFields();
    this.setState({
      modalType: 'add',
      modalVisible: true,
    });
  };

  /* 修改部门 */
  editDepartment = () => {
    this.addModal.resetFields();
    this.setState({
      modalType: 'edit',
      modalVisible: true,
    });
  };

  /* 删除部门 */
  delDepartment = () => {
    const that = this;
    const { selectedNode } = this.state;
    const { dispatch } = this.props;
    Modal.confirm({
      title: '是否确定要删除该部门？',
      content: '',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'baseSetting/depDel',
          payload: selectedNode.depId,
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
    const { modalVisible, modalType, selectedNode, confirmLoading, departmentTree } = this.state;
    return (
      <AddModal
        ref={(inst) => { this.addModal = inst; }}
        departmentTree={departmentTree}
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
      searchValue, expandedKeys, autoExpandParent, selectedNode, departmentTree, selectedKeys,
    } = this.state;
    return (
      <Card>
        {this.renderModal()}
        <h3>
          <span>部门管理</span>
          <div className="fl_r">
            <Batch>
              <Authorized authority="PMS_BASICSETTING_DEPARTMENT_ADD">
                <Button type="gray" onClick={this.addDepartment}>+ 新增部门</Button>
              </Authorized>
            </Batch>
          </div>
        </h3>
        <div className={styles.organization}>
          <div className="organizeList">
            <h1 className="title">部门列表</h1>
            <div>
              <Search style={{ marginBottom: 8 }} placeholder="请输入部门名称" onChange={this.onChange} />
              <Tree
                showLine
                onExpand={this.onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onSelect={this.onSelect}
                selectedKeys={selectedKeys}
              >
                { Common.searchLoop(departmentTree, searchValue) }
              </Tree>
            </div>
          </div>
          <div className="organizeDetail">
            <h1 className="title">部门详情</h1>
            {
              selectedNode.key ? (
                <div>
                  <div className="detailTable">
                    <div><b>部门名称：</b><span>{selectedNode.title}</span></div>
                    <div><b>部门层级：</b><span>{selectedNode.level}</span></div>
                    {
                      selectedNode.level > 1 ? (<div><b>上级部门：</b><span>{selectedNode.parentTitle}</span></div>) : ''
                    }
                    <div><b>所属组织：</b><span>{selectedNode.orgName}</span></div>
                    <div><b>备注：</b><span>{selectedNode.memo}</span></div>
                  </div>
                  <div className="fl_r">
                    <Batch>
                      <Authorized authority="PMS_BASICSETTING_DEPARTMENT_EDIT">
                        <Button type="primary" onClick={this.editDepartment}>编辑部门</Button>
                      </Authorized>
                      <Authorized authority="PMS_BASICSETTING_DEPARTMENT_DELETE">
                        <Button onClick={this.delDepartment}>删除部门</Button>
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
