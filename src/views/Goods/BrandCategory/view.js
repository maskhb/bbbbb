import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Card, Table, Button, message } from 'antd';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';
import { toTree } from '../../../utils/utils';
import ModalForm from './modalForm';

@connect(({ brandCategory, loading }) => ({
  brandCategory,
  loading: loading.models.brandCategory,
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

  getParents(parentId) {
    const { brandCategory } = this.props;

    const { list } = brandCategory;
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
  reloadList() {
    const { dispatch } = this.props;
    return dispatch({
      type: 'brandCategory/list',
    });
  }
  handleAdd(parentId = 0) {
    const editData = { parentId };
    if (parentId) {
      editData.parents = this.getParents(parentId).join(' / ');
    }
    this.setState({ modalFormVisible: true, formTitle: '添加分类', editData });
  }

  handleEdit(record = { parentId: 0 }) {
    const editData = record;
    if (editData.parentId) {
      editData.parents = this.getParents(editData.parentId).join(' / ');
    }
    this.setState({ modalFormVisible: true, formTitle: '编辑分类', editData });
  }

  modalFormOk = (item) => {
    const { dispatch } = this.props;
    const data = { ...item };

    const type = item.categoryId ? 'edit' : 'add';
    dispatch({
      type: item.categoryId ? 'brandCategory/edit' : 'brandCategory/add',
      payload: data,
    }).then(() => {
      const result = this.props.brandCategory[type];
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
  modalFormCancel = () => {
    this.setState({ modalFormVisible: false });
  }
  handleRemove(ids = [], namespace = '') {
    const { dispatch } = this.props;
    const name = '删除';

    dispatch({
      type: `${namespace}/remove`,
      payload: {
        categoryId: ids[0],
      },
    }).then(() => {
      const result = this.props.brandCategory?.remove;
      if (result && !result.error) {
        message.success(`${name}成功`);
        this.reloadList();
      }
    });
  }

  render() {
    const { loading, brandCategory } = this.props;
    const { list } = brandCategory;
    let dataList = _.isArray(list) ? list.slice(0) : [];

    // dataList = addKey(list);
    dataList = toTree(dataList, { id: 'categoryId', pid: 'parentId' });

    return (
      <PageHeaderLayout>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Authorized authority={[permission.OPERPORT_JIAJU_BRANDCATEGORYLIST_ADDCAT]}>
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>添加一级分类</Button>
            </Authorized>
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
