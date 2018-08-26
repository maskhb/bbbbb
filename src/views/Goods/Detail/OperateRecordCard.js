import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table } from 'antd';
import moment from 'moment';
// import TextBeyond from 'components/TextBeyond';

import { format } from 'components/Const';
import styles from './Detail.less';

@connect(({ goods, loading }) => ({
  goods,
  loading: loading.effects['goods/queryLog'],
}))
export default class View extends PureComponent {
  static defaultProps = {
  };

  state = {
  };

  componentDidMount() {
    this.handleSearch(1);
  }

  onChange = (currPage) => {
    this.handleSearch(currPage);
  }

  getColumns = () => {
    return [
      {
        title: '操作时间',
        dataIndex: 'createdTime',
        render: val => <span>{moment(val).format(format)}</span>,
      },
      {
        title: '操作人',
        dataIndex: 'loginName',
      },
      {
        title: '操作类型',
        dataIndex: 'subtypesName',
      },
      {
        title: '操作前',
        dataIndex: 'beforeOperation',
        width: 400,
        // render(val) {
        //   return (
        //     <TextBeyond content={val} maxLength="30" width="150px" />
        //   );
        // },
      },
      {
        title: '操作后',
        dataIndex: 'afterOperation',
        width: 400,
        // render(val) {
        //   return (
        //     <TextBeyond content={val} maxLength="30" width="150px" />
        //   );
        // },
      },
      {
        title: '备注',
        dataIndex: 'extendedInfo',
        width: 150,
        // maxWidth: 200,
        // render(val) {
        //   return (
        //     <TextBeyond content={val} maxLength="30" width="150px" />
        //   );
        // },
      },
    ];
  }

  handleSearch = (currPage, pageSize = 10) => {
    const { dispatch, goodsId } = this.props;

    dispatch({
      type: 'goods/queryLog',
      payload: {
        currPage,
        pageSize,
        passiveOperator: Number(goodsId),
      },
    });
  }

  render() {
    const { goods, loading } = this.props;

    return (
      <Card title="操作日志" className={styles.card} bordered={false}>
        <Table
          loading={loading}
          columns={this.getColumns()}
          dataSource={goods.queryLog?.list || []}
          pagination={{
            ...goods.queryLog?.pagination,
            onChange: this.onChange,
          } || {}}
          rowKey="logId"
        />
      </Card>
    );
  }
}
