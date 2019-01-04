import React from 'react';
import { TreeSelect, Tree, Select } from 'antd';
import { organizeTypeOptions } from 'utils/attr/baseSetting';

const TreeSelectNode = TreeSelect.TreeNode;
const TreeNode = Tree.TreeNode;
const SelectOption = Select.Option;

class Common {
  /* 弹框不过滤节点树 */
  loop = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeSelectNode key={item.key} value={item.key} title={item.title}>
          {this.loop(item.children)}
        </TreeSelectNode>
      );
    }
    return (
      <TreeSelectNode
        key={item.key}
        value={item.key}
        title={item.title}
      />
    );
  });

  /* 弹框过滤节点树 */
  specialLoop = (data, values) => data.map((item) => {
    let disabled = !!item.disabled;
    if (values) {
      values.map((v) => {
        if (v.value === item.orgId) {
          disabled = false;
        }
        return v;
      });
    }
    if (item.children) {
      return (
        <TreeSelectNode key={item.key} disabled={disabled} value={item.key} title={item.title}>
          {this.specialLoop(item.children, values)}
        </TreeSelectNode>
      );
    }
    return (
      <TreeSelectNode
        key={item.key}
        disabled={disabled}
        value={item.key}
        title={item.title}
      />
    );
  });


  /* 搜索树 */
  searchLoop = (data, searchValue) => data.map((item) => {
    const index = item.title.indexOf(searchValue);
    const beforeStr = item.title.substr(0, index);
    const afterStr = item.title.substr(index + searchValue.length);
    const title = index > -1 ? (
      <span>
        {beforeStr}
        <span style={{ color: '#f50' }}>{searchValue}</span>
        {afterStr}
      </span>
    ) : <span>{item.title}</span>;
    if (item.children) {
      return (
        <TreeNode key={item.key} title={<span style={{ color: item.status === 2 ? '#bbb' : '#666' }}>{title}</span>}>
          {this.searchLoop(item.children, searchValue)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} title={<span style={{ color: item.status === 2 ? '#bbb' : '#666' }}>{title}</span>} />;
  });

  /**
   * 返回Select元素的公共方法
   */
  getSearchOptionsElm = (options = [], isMore = false, placeholder = '请选择', disabled = false) => {
    const params = isMore ? {
      mode: 'multiple',
      disabled,
    } : { disabled };

    return (
      <Select placeholder={placeholder} {...params} optionFilterProp="children">
        {
          options.map((item) => {
            return <SelectOption key={item.value} value={item.value}>{item.label}</SelectOption>;
          })
        }
      </Select>
    );
  };

  /* 获取状态 */
  getStatusStr = (status) => {
    let str = status;
    switch (status) {
      case 1:
        str = '启用';
        break;
      case 2:
        str = '禁用';
        break;
      default:
        break;
    }
    return str;
  };

  /* 获取组织类型 */
  getOrgTypeStr = (type) => {
    let str = type;
    organizeTypeOptions.map((v) => {
      if (v.value === type) {
        str = v.label;
      }
      return '';
    });
    return str;
  };

  /* 地址字符转化 */
  regionNamePathChange = (path) => {
    return path.replace(/_/g, '/');
  };

  /* 获取组织树 */
  getOrgTreeData = data => data.map((item) => {
    const newItem = item;
    newItem.key = newItem.orgId.toString();
    newItem.title = newItem.orgName;
    newItem.disabled = newItem.isRoleRelated;
    if (newItem.childOrgs) {
      newItem.children = newItem.childOrgs;
      delete newItem.childOrgs;
      this.getOrgTreeData(newItem.children);
    }
    return newItem;
  });

  /* 获取部门树 */
  getDepTreeData = data => data.map((item) => {
    const newItem = item;
    newItem.key = newItem.depId.toString();
    newItem.title = newItem.depName;
    if (newItem.childDeps) {
      newItem.children = newItem.childDeps;
      delete newItem.childDeps;
      this.getDepTreeData(newItem.children);
    }
    return newItem;
  });

  /* 获取角色组树 */
  getRoleGroupTreeData = data => data.map((item) => {
    const newItem = item;
    newItem.key = newItem.roleGroupId.toString();
    newItem.title = newItem.roleGroupName;
    return newItem;
  });

  generateList = (data, dataList) => {
    for (let i = 0; i < data.length; i += 1) {
      const node = data[i];
      const newNode = Object.assign({}, node);
      delete newNode.children;
      dataList.push(newNode);
      if (node.children) {
        this.generateList(node.children, dataList);
      }
    }
    return dataList;
  };

  /* 获取key */
  getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i += 1) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (this.getParentKey(key, node.children)) {
          parentKey = this.getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  /* 获取title */
  getParentTitle = (key, tree) => {
    let parentTitle;
    for (let i = 0; i < tree.length; i += 1) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentTitle = node.title;
        } else if (this.getParentTitle(key, node.children)) {
          parentTitle = this.getParentTitle(key, node.children);
        }
      }
    }
    return parentTitle;
  };
}
export default new Common();
