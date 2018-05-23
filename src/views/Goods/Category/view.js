import React, { PureComponent } from 'react';
import _ from 'lodash';
import { connect } from 'dva';
import { Card, Table, Button, message } from 'antd';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import getColumns from './columns';
import { toTreeData } from '../../../utils/utils';

// const addKey = (list = []) => {
// //   let newList = [];
// //   if (list && list.length > 0) {
// //     newList = list.map((item, i) => {
// //       const newItem = item;
// //       newItem.key = i;
// //       return newItem;
// //     });
// //   }
// //   return newList;
// // };

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

  handleRemove(id = 0, namespace = '') {
    const { dispatch } = this.props;
    const name = '删除';

    dispatch({
      type: `${namespace}/remove`,
      payload: {
        categoryId: id,
      },
    }).then(() => {
      const { remove = {} } = this.props[namespace];
      // console.log(remove);
      if (remove && !remove.error) {
        message.success(`${name}成功`);
        this.reloadList();
      }
    });
  }

  popConfirm = (val, record, confirmText) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goodsCategory/status',
      payload: {
        categoryId: record.categoryId,
        status: val,
      },
    }).then(() => {
      const { status } = this.props.goodsCategory;
      if (status && !status.error) {
        message.success(`${confirmText}成功`);
        this.reloadList();
      }
    });
  }

  render() {
    const { loading, goodsCategory } = this.props;
    const { list } = goodsCategory;
    // console.log(list);
    let dataList = _.isArray(list) ? list.slice(0) : [];
    // dataList = addKey(dataList);
    dataList = dataList ? (toTreeData(dataList.slice(0), { id: 'categoryId', pid: 'parentId' })) : dataList;
    return (
      <PageHeaderLayout>
        <Card>
          <div style={{ marginBottom: '16px' }}>
            <Authorized authority={[permission.OPERPORT_JIAJU_PROCATEGORYLIST_ADDCAT]}>
              <a href="#/goods/category/add/0">
                <Button icon="plus" type="primary">添加一级分类</Button>
              </a>
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
      </PageHeaderLayout>
    );
  }
}
