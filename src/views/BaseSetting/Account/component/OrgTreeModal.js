import React from 'react';
import { Tree, Input, Modal } from 'antd';
import { Button } from 'antd/lib/radio';

const { TreeNode } = Tree;
const { Search } = Input;

const findItemByLinkKey = (data, key) => {
  const ids = key.split('-');
  let item;
  ids.forEach((id) => {
    if (item) {
      item = item.childOrgs?.find(it => it.orgId === parseInt(id, 10));
    } else {
      item = data.find(it => it.orgId === parseInt(id, 10));
    }
  });
  return item;
};

export default class SearchTree extends React.Component {
  state = {
    modalVisible: false,
    expandedKeys: [],
    searchValue: '',
    checkedKeys: [],
    autoExpandParent: true,
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: !(expandedKeys?.length > 0),
    });
  }

  onCheck = (checkedKeys) => {
    this.setState({
      checkedKeys,
    });
  }

  onOk = () => {
    const { data, onOk, onChange } = this.props;
    const values = this.state.checkedKeys.map(
      k => findItemByLinkKey(data, k)
    ).filter(it => !it.childOrgs);
    if (onOk) {
      onOk(values);
    } else if (onChange) {
      onChange(values);
    }
    this.onCancel();
  }

  onCancel = () => {
    this.setState({
      modalVisible: false,
      checkedKeys: [],
      searchValue: '',
    });
  }

  onSearch = (e) => {
    const { target: { value } } = e;
    const { data } = this.props;

    const expandedKeys = this.getExpandKeysBySearch(value, data);
    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  }

  onOpen = () => {
    const { value = [], data } = this.props;
    // const selectedKeys = value.map(v => v.toString())
    const checkedKeys = new Set();
    const loop = (children, pId = []) => {
      children.forEach((dt) => {
        if (value.indexOf(dt.orgId) > -1) {
          if (pId.length > 0 && !checkedKeys.has(pId.join('-'))) {
            let k = '';
            pId.forEach((id) => {
              if (k) {
                k = `${k}-${id}`;
              }
              checkedKeys.add(k);
            });
          }
          let key = dt.orgId;
          if (pId.length > 0) {
            key = `${pId.join('-')}-${key}`;
          }
          checkedKeys.add(key);
        }

        if (dt.childOrgs) {
          loop(dt.childOrgs, [...pId, dt.orgId]);
        }
      });
    };
    loop(data);
    this.setState({
      modalVisible: true,
      checkedKeys: [...checkedKeys],
    });
  }

  getExpandKeysBySearch = (query, item, parent, expandedKeys = []) => {
    if (!query) {
      return [];
    }
    let children;
    if (Array.isArray(item)) {
      children = item;
    } else {
      children = [item];
    }

    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child.orgName.indexOf(query) > -1 && parent) {
          expandedKeys.push(parent.orgId);
        }
        if (child.childOrgs && child.childOrgs.length > 0) {
          this.getExpandKeysBySearch(query, child.childOrgs, child, expandedKeys);
        }
      });
    }
    return expandedKeys;
  }

  renderTree() {
    const { searchValue, checkedKeys, expandedKeys, autoExpandParent } = this.state;
    const loop = (data, pId = []) => data.map((item) => {
      const index = item.orgName.indexOf(searchValue);
      const beforeStr = item.orgName.substr(0, index);
      const afterStr = item.orgName.substr(index + searchValue.length);
      let key = `${item.orgId}`;
      if (pId.length > 0) {
        key = `${pId.join('-')}-${item.orgId}`;
      }
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.orgName}</span>;
      if (item.childOrgs) {
        const pids = [...pId];
        pids.push(item.orgId);
        return (
          <TreeNode key={key} title={item.orgName}>
            {loop(item.childOrgs, pids)}
          </TreeNode>
        );
      }
      return <TreeNode key={key} title={title} />;
    });
    return (
      <div>
        <br />
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onSearch} />
        <Tree
          checkable
          defaultExpandAll
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
          onExpand={this.onExpand}
          onSelect={false}
        >
          {loop(this.props.data)}
        </Tree>
      </div>
    );
  }

  render() {
    return [
      <Button onClick={this.onOpen}>
        选择
      </Button>,
      <Modal
        visible={this.state.modalVisible}
        onOk={this.onOk}
        onCancel={this.onCancel}
      >
        {this.renderTree()}
      </Modal>,
    ];
  }
}
