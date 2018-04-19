import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree } from 'antd';
import commonApi from '../../services/common';
import styles from './index.less';

class CommunitySelect extends Component {
  static isExistInArr(arr, value) {
    let result = { isExist: false, index: 0 };
    arr.forEach((v, i) => {
      if (v === value) {
        result = { isExist: true, index: i };
      }
    });
    return result;
  }
  constructor(props) {
    super(props);
    this.state = {
      treeData: [],
      needInitCheck: props?.needInitCheck || false, // 初始化的时候，是否需要勾选内容
      checkedKeys: [],
      allCommunityIds: [], // 所有的小区Id
      expandAll: props?.expandAll || false,
      expandedKeys: [],
    };
  }
  componentWillMount() {
    const { needInitCheck } = this.state;
    commonApi.queryCommunityList({
      queryCondition: {
        platformField: 3,
      },
      pageSize: 0,
      currentPage: 0,
    }).then((res) => {
      if (!res?.data?.result?.dataList) {
        return;
      }
      const { dataList } = res.data.result;
      const result = [];
      const existProvinceIdArr = [];
      const defaultCheckedArr = [];
      const defaultCheckedCommunityIds = [];
      const defaultExpandArr = []; // 默认自动展开的key值的集合
      const allCommunityIdsArr = [];
      dataList.forEach((v) => {
        // 如果existProvinceIdArr中不存在当前provinceId，则在result数组中新加一个对象
        const checkResult = CommunitySelect.isExistInArr(existProvinceIdArr, v.provinceId);
        allCommunityIdsArr.push({
          communityId: v.communityId,
          communityName: v.communityName,
          provinceId: v.provinceId,
          provinceName: v.provinceName,
        });
        if (!checkResult.isExist) {
          result.push({
            title: v.provinceName,
            value: v.provinceId,
            key: '',
            depth: 0,
            children: [{
              title: v.communityName, value: v.communityId, key: '', depth: 1, platformFieldList: v.platformFieldList,
            }],
          });
          existProvinceIdArr.push(v.provinceId);
        } else {
          // 如果当前provinceId已经存在，则找到相同对象，在其children中加入小区信息
          result[checkResult.index].children.push({
            title: v.communityName, value: v.communityId, key: '', depth: 1, platformFieldList: v.platformFieldList,
          });
        }
      });
      result.sort((a, b) => {
        if (a.title > b.title) {
          return 1;
        } else if (a.title < b.title) {
          return -1;
        } else {
          return 0;
        }
      });
      result.forEach((v, i) => {
        result[i].key = `0-${i}`;
        defaultExpandArr.push(result[i].key);
        result[i].children.sort((a, b) => {
          if (a.title > b.title) {
            return 1;
          } else if (a.title < b.title) {
            return -1;
          } else {
            return 0;
          }
        });
        result[i].children.forEach((item, index) => {
          result[i].children[index].key = `${result[i].key}-${index}`;
          // 若platformFieldList中存在3，则被勾选
          if (result[i].children[index].platformFieldList.indexOf(3) >= 0) {
            defaultCheckedArr.push(result[i].children[index].key);
            defaultCheckedCommunityIds.push(result[i].children[index].value);
          }
        });
      });
      this.setState({
        treeData: result,
        checkedKeys: needInitCheck ? defaultCheckedArr : [],
        allCommunityIds: allCommunityIdsArr,
        expandedKeys: defaultExpandArr,
      });
      if (this.props?.onChange) {
        this.props.onChange({
          checkedCommunityIds: needInitCheck ? defaultCheckedCommunityIds : [],
          allCommunityIds: allCommunityIdsArr,
        });
      }
      if (this.props?.handleChange) {
        this.props.handleChange({
          checkedCommunityIds: needInitCheck ? defaultCheckedCommunityIds : [],
          allCommunityIds: allCommunityIdsArr,
        });
      }
    });
  }
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
    });
  }
  onCheck(keys, e) {
    const { allCommunityIds } = this.state;
    const checkedResult = e.checkedNodes;
    const checkedCommunityIds = [];
    checkedResult.forEach((v) => {
      if (!v?.props?.dataRef) {
        checkedCommunityIds.push(v.props.value);
      }
    });
    this.setState({
      checkedKeys: keys,
    });
    if (this.props?.onChange) {
      this.props.onChange({
        checkedCommunityIds, allCommunityIds,
      });
    }
    if (this.props?.handleChange) {
      this.props.handleChange({
        checkedCommunityIds, allCommunityIds,
      });
    }
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <Tree.TreeNode
            title={item.title}
            key={item.key}
            dataRef={item}
            className={styles.fatherNode}
          >
            {this.renderTreeNodes(item.children)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          {...item}
          className={item.depth === 1 ? styles.childrenNode : styles.fatherNode}
        />
      );
    });
  }
  render() {
    const { treeData, checkedKeys, expandAll, expandedKeys } = this.state;

    return (
      <div>
        <Tree
          checkable
          expandedKeys={expandAll ? expandedKeys : []}
          onExpand={this.onExpand.bind(this)}
          onCheck={this.onCheck.bind(this)}
          checkedKeys={checkedKeys}
          className={styles.treeTotal}
        >
          {this.renderTreeNodes(treeData)}
        </Tree>
      </div>
    );
  }
}
CommunitySelect.propTypes = Object.assign({}, CommunitySelect.propTypes, {
  needInitCheck: PropTypes.bool.isRequired, // 初始化的时候，是否需要勾选内容
  expandAll: PropTypes.bool, // 是否展开所有树
  handleChange: PropTypes.func, // 获取当前值的回调
});
export default CommunitySelect;

// 返回值定义：
// {
//    allCommunityIds: 所有的小区信息，包括小区ID，小区名称，所属省份，省份ID，
//    checkedCommunityIds: 被选中的小区ID列表
// }
