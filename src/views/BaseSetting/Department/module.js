import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, TreeSelect } from 'antd';
import { orgId } from 'utils/getParams';
import Common from './../common/common';

@Form.create()
@connect(({ baseSetting }) => ({
  baseSetting,
}))
class DepartmentModal extends PureComponent {
  state = {
    departmentTree: [],
    value: this.props.value,
  };
  componentDidMount = () => {
    this.init();
  }

  componentWillUpdate = () => {
    const { departmentTree } = this.state;
    const { baseSetting } = this.props;
    const { searchDepList } = baseSetting || {};
    if (searchDepList && departmentTree.length === 0) {
      const tree = Common.getDepTreeData(searchDepList);
      if (tree.length !== 0) {
        this.setState({
          departmentTree: tree,
        });
      }
    }
  };
  onChange = (depId, depName) => {
    console.log({ depId, depName });
    this.props.onSel(depId, depName);
    this.setState({ value: [depId, depName] });
    this.props.onChange(depId);
  }
  init = async () => {
    console.log('props', this.props);
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'baseSetting/searchDepList',
      payload: orgId(),
    });
    if (res) {
      const departmentTree = Common.getDepTreeData(res);
      this.setState({
        departmentTree,
      });
    }
  }


  render() {
    const { departmentTree } = this.state;

    return (
      <TreeSelect
        showSearch
        value={Array.isArray(this.state.value) ? (this.state.value[0] !== 0 ? [this.state.value[0]] : '') : ''}
        treeNodeFilterProp="title"
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
      >
        {Common.loop(departmentTree)}
      </TreeSelect>
    );
  }
}

export default DepartmentModal;
