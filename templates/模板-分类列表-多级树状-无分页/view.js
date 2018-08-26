import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Card, Table, Button, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';
import { toTree } from '../../../utils/utils';
import ModalForm from './modalForm';

@connect(({ xxxCategory, loading }) => ({
  xxxCategory,
  loading: loading.models.xxxCategory,
}))
export default class View extends PureComponent {
  static defaultProps = {};

  state = {
    modalFormVisible: false,
    formTitle: '添加分类',
    editData: null,
  };

  componentDidMount() {
    this.reloadList();
  }

  /**
   * 获取父分类路径
   * @param parentId 当前父分类id
   * @returns {Array} 所有父分类的名称数组
   */
  getParents(parentId) {
    const { xxxCategory } = this.props;

    const { list } = xxxCategory;
    const parents = [];
    const record = list.filter((item) => {
      return item.categoryId === parentId;
    });
    if (record[0] && record[0].parentId) {
      parents.push(...(this.getParents(record[0].parentId)));
    }
    if (record[0]) {
      parents.push(record[0].categoryName);
    }
    return parents;
  }

  /**
   * 刷新当前页
   */
  reloadList() {
    const { dispatch } = this.props;
    return dispatch({
      type: 'xxxCategory/list',
    });
  }

  /**
   * 点击添加分类按钮操作
   * @param parentId 添加子分类时当前分类id
   */
  handleAdd(parentId = 0) {
    const editData = { parentId };
    if (parentId) {
      editData.parents = this.getParents(parentId).join(' / ');
    }
    this.setState({ modalFormVisible: true, formTitle: '添加分类', editData });
  }

  /**
   * 修改分类操作
   * @param record 当前分类对象
   */
  handleEdit(record = { parentId: 0 }) {
    const editData = record;
    if (editData.parentId) {
      editData.parents = this.getParents(editData.categoryId).join(' / ');
    }
    this.setState({ modalFormVisible: true, formTitle: '编辑分类', editData });
  }

  /**
   * 删除操作
   * @param ids 分类的id数组
   */
  handleRemove(ids = []) {
    const { dispatch } = this.props;
    const name = '删除';

    dispatch({
      type: 'xxxCategory/remove',
      payload: {
        categoryId: ids[0],
      },
    }).then(() => {
      const result = this.props.xxxCategory?.remove;
      if (result && !result.error) {
        message.success(`${name}成功`);
        this.reloadList();
      }
    });
  }

  /**
   * 新增、编辑弹框保存事件
   * @param item 编辑后的分类对象
   */
  modalFormOk = (item) => {
    const { dispatch } = this.props;
    const data = { ...item };

    const type = item.categoryId ? 'edit' : 'add';
    dispatch({
      type: item.categoryId ? 'xxxCategory/edit' : 'xxxCategory/add',
      payload: data,
    }).then(() => {
      const result = this.props.xxxCategory[type];
      if (result && !result.error) {
        message.success(item.categoryId ? '编辑成功' : '新增成功');
        this.reloadList();
        this.setState({
          modalFormVisible: false,
          editData: null,
        });
      }
    });
  }

  /**
   * 编辑、删除弹框取消事件
   */
  modalFormCancel = () => {
    this.setState({ modalFormVisible: false });
  }

  render() {
    const { loading, xxxCategory } = this.props;
    const { list } = xxxCategory;
    let dataList = _.isArray(list) ? list.slice(0) : [];
    /* 转换成树形数据 */
    dataList = toTree(dataList, { id: 'categoryId', pid: 'parentId' });

    return (
      <PageHeaderLayout>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>添加一级分类</Button>
          </div>
          <Table
            loading={loading}
            columns={getColumns(this)}
            dataSource={dataList}
            pagination={false}
            rowKey="categoryId"
          />
        </Card>

        <ModalForm
          data={this.state.editData}
          title={this.state.formTitle}
          visible={this.state.modalFormVisible}
          onOk={this.modalFormOk}
          onCancel={this.modalFormCancel}
        />

      </PageHeaderLayout>
    );
  }
}
