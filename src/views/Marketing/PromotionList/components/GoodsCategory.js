import React, { PureComponent } from 'react';
import { Tree, Modal, Button, Spin } from 'antd';
import { connect } from 'dva';

const { TreeNode } = Tree;

@connect(({ common }) => ({
  common,
}))


export default class GoodsCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: [],
      visible: false,
    };
  }

  componentWillMount() {
  }

  onCheck = (_checkedKeys) => {
    const checkedKeys = _checkedKeys.filter((v) => {
      if (!this.optionsDic[v]?.children) return true;
      return false;
    });
    this.setState({ checkedKeys: checkedKeys.map((v) => {
      return { label: this.optionsDic[v].title, value: v };
    }),
    });
  }

  async queryList() {
    const { dispatch, merchantId, belongType } = this.props;
    const type = (merchantId && belongType === 2) ? 'goodsCategoryListByMerchantId' : 'goodsSaleCategoryList';
    let payload = {};
    if (merchantId && belongType === 2) {
      payload = {
        merchantId,
      };
    } else {
      payload = {
        parentId: 0,
      };
    }
    await dispatch({
      type: `common/${type}`,
      payload,
    });

    const { common: {
      goodsSaleCategoryList: commonRes, goodsCategoryListByMerchantId: merchantRes,
    } } = this.props;

    console.log(this.props);
    const res = (merchantId && belongType === 2) ? merchantRes : commonRes;
    if (res && res.length > 0) {
      const options = [];
      const optionsDic = {};
      this.optionsDic = optionsDic;
      res.forEach((v) => {
        optionsDic[v.categoryId] = {
          title: v.categoryName,
          key: v.categoryId,
          parentId: v.parentId,
        };
      });

      res.forEach((v) => {
        if (v.parentId === 0) {
          options.push(optionsDic[v.categoryId]);
        } else {
          optionsDic[v.parentId].children = optionsDic[v.parentId].children || [];
          optionsDic[v.parentId].children.push(optionsDic[v.categoryId]);
        }
      });

      this.setState({ treeData: options });
    } else {
      this.setState({ treeData: [] });
    }
  }

renderTreeNodes = (data) => {
  return data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  });
}

render() {
  const showBtn = (
    <Button
      type="primary"
      onClick={() => {
        this.setState({ visible: true });
        this.queryList();
    }}
    >选择
    </Button>
  );
  return (
    [this.props.showBtn ? showBtn : '',
      <Modal
        width={700}
        height={500}
        style={{ top: 0 }}
        title="指定分类"
        visible={this.state.visible}
        onCancel={() => { this.setState({ visible: false }); }}
        onOk={() => {
        this.setState({ visible: false });
        this.props.onChange(this.state.checkedKeys);
      }}
      >
        <Spin spinning={this.props.loading}>
          <div style={{ height: '500px', overflow: 'auto' }}>
            {this.state.treeData ?
          (
            <Tree
              checkable
              onCheck={this.onCheck}
              onSelect={this.onSelect}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          ) : ''}
          </div>
        </Spin>
      </Modal>,
    ]);
}
}
