/*  树形展示所有省和省下的小区，并勾选  */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tree, Spin } from 'antd';
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
      checkType: props?.checkType || 1, // 初始化的时候，是否需要勾选内容
      checkedKeys: [],
      allCommunity: [], // 所有的小区信息集合
      expandAll: props?.expandAll || false,
      expandedKeys: [],
      checkedCommunityIds: props?.checkedCommunityIds || [],
      allCommunityCheckArr: [], // 所有小区节点的key的集合
      loading: false,
    };
  }
  componentDidMount() {
    const { checkType, checkedCommunityIds } = this.state;
    this.setState({ loading: true });
    commonApi.queryCommunityList({
      queryCondition: {
        isVirtual: 0,
      },
      pageSize: 0,
      currentPage: 0,
    }).then((res) => {
      this.setState({ loading: false });
      if (!res?.dataList) {
        return;
      }
      const { dataList } = res;
      const result = [];
      const existProvinceIdArr = [];
      const defaultCheckedArr = [];
      const defaultCheckedCommunityIds = [];
      const defaultExpandArr = []; // 默认自动展开的key值的集合
      const allCommunityArr = []; // 所有小区数组，包含Id，名称等
      const allCommunityCheckArr = [];// 所有小区节点Key的数组
      const allCommunityIdsArr = [];// 所有小区节点ID的数组
      const checkedCommunityArr = [];// 所有选中的小区节点Key的数组
      dataList.forEach((v) => {
        // 如果existProvinceIdArr中不存在当前provinceId，则在result数组中新加一个对象
        const checkResult = CommunitySelect.isExistInArr(existProvinceIdArr, v.provinceId);
        allCommunityArr.push({
          communityId: v.communityId,
          communityName: `${v.cityName} - ${v.communityName}`,
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
              title: `${v.cityName} - ${v.communityName}`, value: v.communityId, key: '', depth: 1, platformFieldList: v.platformFieldList,
            }],
          });
          existProvinceIdArr.push(v.provinceId);
        } else {
          // 如果当前provinceId已经存在，则找到相同对象，在其children中加入小区信息
          result[checkResult.index].children.push({
            title: `${v.cityName} - ${v.communityName}`, value: v.communityId, key: '', depth: 1, platformFieldList: v.platformFieldList,
          });
        }
      });
      // result.sort((a, b) => {
      //   if (a.title > b.title) {
      //     return 1;
      //   } else if (a.title < b.title) {
      //     return -1;
      //   } else {
      //     return 0;
      //   }
      // });
      result.forEach((v, i) => {
        result[i].key = `0-${i}`;
        defaultExpandArr.push(result[i].key);
        // result[i].children.sort((a, b) => {
        //   if (a.title > b.title) {
        //     return 1;
        //   } else if (a.title < b.title) {
        //     return -1;
        //   } else {
        //     return 0;
        //   }
        // });
        result[i].children.forEach((item, index) => {
          result[i].children[index].key = `${result[i].key}-${index}`;
          allCommunityCheckArr.push(result[i].children[index].key);
          allCommunityIdsArr.push(result[i].children[index].value);
          // 勾选checkedCommunityIds中对应的小区节点
          if (checkType === 4 && checkedCommunityIds.length > 0 &&
            checkedCommunityIds.indexOf(result[i].children[index].value) >= 0) {
            checkedCommunityArr.push(result[i].children[index].key);
          }
          // 若platformFieldList中存在3，则被勾选
          if (result[i].children[index].platformFieldList.indexOf(3) >= 0) {
            defaultCheckedArr.push(result[i].children[index].key);
            defaultCheckedCommunityIds.push(result[i].children[index].value);
          }
        });
      });
      let checkedKeys = [];
      let checkedIds = [];
      switch (checkType) {
        case 1:
          checkedKeys = defaultCheckedArr;
          checkedIds = defaultCheckedCommunityIds;
          break;
        case 2:
          checkedKeys = allCommunityCheckArr;
          checkedIds = allCommunityIdsArr;
          break;
        case 3:
          checkedKeys = [];
          checkedIds = [];
          break;
        case 4:
          checkedKeys = checkedCommunityArr;
          checkedIds = checkedCommunityIds;
          break;
        default:
      }
      this.setState({
        treeData: result,
        checkedKeys,
        allCommunity: allCommunityArr,
        expandedKeys: defaultExpandArr,
        allCommunityCheckArr,
        allCommunityIdsArr,
      });
      if (this.props?.onChange) {
        this.props.onChange({
          checkedCommunityIds: checkedIds,
          allCommunity: allCommunityArr,
        });
      }
      if (this.props?.handleChange) {
        this.props.handleChange({
          checkedCommunityIds: checkedIds,
          allCommunity: allCommunityArr,
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    const { checkType, allCommunityCheckArr, allCommunityIdsArr, allCommunity } = this.state;
    const newCheckType = nextProps?.checkType;
    if (checkType !== newCheckType && (newCheckType === 2 || newCheckType === 3)) {
      let checkedKeys = [];
      let checkedIds = [];
      switch (newCheckType) {
        case 2:
          checkedKeys = allCommunityCheckArr;
          checkedIds = allCommunityIdsArr;
          break;
        case 3:
          checkedKeys = [];
          checkedIds = [];
          break;
        default:
      }
      this.setState({
        checkedKeys,
        checkType: newCheckType,
      });
      if (this.props?.onChange) {
        this.props.onChange({
          checkedCommunityIds: checkedIds,
          allCommunity,
        });
      }
      if (this.props?.handleChange) {
        this.props.handleChange({
          checkedCommunityIds: checkedIds,
          allCommunity,
        });
      }
    }
  }
  onExpand(expandedKeys) {
    this.setState({
      expandedKeys,
    });
  }
  onCheck(keys, e) {
    const { allCommunity } = this.state;
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
        checkedCommunityIds, allCommunity,
      });
    }
    if (this.props?.handleChange) {
      this.props.handleChange({
        checkedCommunityIds, allCommunity,
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
    const { treeData, checkedKeys, expandAll, expandedKeys, loading } = this.state;
    return (
      <Spin spinning={loading} >
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
      </Spin>
    );
  }
}
CommunitySelect.propTypes = Object.assign({}, CommunitySelect.propTypes, {
  checkType: PropTypes.number.isRequired, // 初始化的时候，勾选规则 1：勾选开通的小区 2：勾选全部 3：全部不勾选 4：勾选传入的选项
  expandAll: PropTypes.bool, // 是否展开所有树
  handleChange: PropTypes.func, // 获取当前值的回调
  checkedCommunityIds: PropTypes.array, // 默认勾选的小区Id列表，checkType=4时有效
});
export default CommunitySelect;

// 返回值定义：
// {
//    allCommunity: 所有的小区信息，包括小区ID，小区名称，所属省份，省份ID，
//    checkedCommunityIds: 被选中的小区ID列表
// }
