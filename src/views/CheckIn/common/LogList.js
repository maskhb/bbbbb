import React from 'react';
import { Table } from 'antd';
import '../index.less';

export default class LogList extends React.Component {
  columns = () => {
    return [{
      title: '操作人',
      dataIndex: 'userName',
    }, {
      title: '操作时间',
      dataIndex: 'timeFormat',
    }, {
      title: '操作类型',
      dataIndex: 'typeFormat',
    }, {
      title: '操作内容',
      dataIndex: 'content',
    }];
  }

  render() {
    const { checkIn: { gresDetails }, style } = this.props;

    return (
      <Table
        className="tanant-info"
        columns={this.columns()}
        dataSource={gresDetails?.gresLogVOs}
        bordered
        pagination={false}
        style={style}
        rowKey="id"
      />
    );
  }
}
