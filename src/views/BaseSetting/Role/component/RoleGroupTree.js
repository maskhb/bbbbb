import React from 'react';
import { Tree } from 'antd';

import './styles.less';

const { TreeNode } = Tree;

export default class RoleGroupTree extends React.PureComponent {
  getTreeData = () => {
    const { data = [] } = this.props;
    return data?.map(roleGroup => ({
      title: roleGroup.groupName,
      key: roleGroup.groupCode,
      children: roleGroup.authModuleVOs.map((mod) => {
        return {
          title: mod.moduleName,
          key: `${roleGroup.groupCode}-${mod.moduleCode}`,
          children: mod.authVOs?.map(auth => ({
            title: auth.authName,
            key: `${auth.authId}`,
            // key: `${roleGroup.groupCode}-${mod.moduleCode}-${auth.authId}`,
          })),
        };
      }),
    }));
  }

  handleCheck = (keys) => {
    const { onCheck } = this.props;
    if (onCheck) {
      onCheck(keys);
    }
  }

  renderTreeNodes = (data) => {
    return data?.map((item) => {
      if (item.children) {
        return (
          <TreeNode selectable={false} title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode selectable={false} {...item} />;
    });
  }

  render() {
    const { selectedAuths, disabled } = this.props;
    return (
      <Tree
        checkable
        checkedKeys={selectedAuths}
        onCheck={this.handleCheck}
        disabled={disabled}
        defaultExpandAll
      >
        {this.renderTreeNodes(this.getTreeData())}
      </Tree>
    );
  }
}
