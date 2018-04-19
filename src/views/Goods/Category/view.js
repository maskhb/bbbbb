import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';
import { toTreeData } from '../../../utils/utils';

@connect(({ goodsCategory, loading }) => ({
  goodsCategory,
  loading: loading.models.goodsCategory,
}))
export default class View extends PureComponent {
  static defaultProps = {};

  state = {
  };

  componentDidMount() {
    this.reloadList();
  }

  reloadList() {
    const { dispatch } = this.props;
    return dispatch({
      type: 'goodsCategory/list',
      payload: {},
    });
  }

  handleRemove(ids = [], namespace = '') {
    const { dispatch } = this.props;
    const name = '删除';

    dispatch({
      type: `${namespace}/remove`,
      payload: {
        ids,
      },
    }).then(() => {
      const { remove = {} } = this.props[namespace];
      if (remove.msgCode === 200 && remove.data) {
        message.success(`${name}成功`);
        this.reloadList();
      } else {
        message.error(`${name}失败, ${remove.message || '请稍后再试。'}`);
      }
    });
  }

  popConfirm = (val, record, confirmText) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsCategory/list',
      payload: {},
    });

    dispatch({
      type: 'goodsCategory/status',
      payload: {
        id: record.id,
        status: val,
      },
    }).then(() => {
      const { status } = this.props.goodsCategory;
      if (status.msgCode === 200 && status.data) {
        message.success(`${confirmText}成功`);
        this.reloadList();
      } else {
        message.error(`${confirmText}失败, ${status.message || '请稍后再试。'}`);
      }
    });
  }

  render() {
    const { loading, goodsCategory } = this.props;
    let { list } = goodsCategory;
    list = list ? (toTreeData(list.slice(0), { id: 'categoryId', pid: 'parentId' })) : list;
    return (
      <PageHeaderLayout>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <a href="#/goods/category/add/0">
              <Button icon="plus" type="primary">添加一级分类</Button>
            </a>
          </div>
          <Table
            loading={loading}
            columns={getColumns(this)}
            dataSource={list}
            pagination={false}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
