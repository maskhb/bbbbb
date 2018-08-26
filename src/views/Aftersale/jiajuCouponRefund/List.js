import React, { PureComponent } from 'react';
import { Card, Form, message } from 'antd';

import PanelList, { Table } from 'components/PanelList';
import SearchHeader from './components/SearchHeader';
import ApproveModal from './components/ApproveModal';
import { getListColumns } from './columns';

@Form.create()
export default class extends PureComponent {
  static defaultProps = {
    searchDefault: {
      orderTime: null, // getStartTimeAndEndTimeFor6Months(),
      pageInfo: {
        pageSize: 10,
      },
    },
  };
  state = {
    modalVisible: false,
    applyId: null,
  }

  handleApproveShow(record) {
    this.setState({
      modalVisible: true,
      applyId: record.applyId,
    });
  }

  handleApproveHide = () => {
    this.setState({
      modalVisible: false,
      applyId: null,
    });
  }

  handleApprove = (params) => {
    const { applyId } = this.state;
    this.props.dispatch({
      type: 'jiajuCoupon/approve',
      payload: {
        ...params,
        applyId,
      },
    }).then((res) => {
      // if(res )
      if (res.result) {
        message.success(res.msg || '审核成功');
      } else {
        message.error(res.msg || '审核失败');
      }
      this.searchHeader.search.handleSearch();
    });
    this.setState({
      modalVisible: false,
      applyId: null,
    });
  }

  handleSync(record) {
    this.props.dispatch({
      type: 'jiajuCoupon/sync',
      payload: {
        applyId: record.applyId,
      },
    }).then((res) => {
      // console.log(res);
      if (res && res.status) {
        message.success(res.errorMsg || '同步成功');
      } else {
        message.error(res.errorMsg || '同步失败');
      }
      this.searchHeader.search.handleSearch();
    });
  }

  render() {
    const { jiajuCoupon, loading, searchDefault } = this.props;

    return (
      <Card>

        <PanelList>

          <SearchHeader
            ref={(ref) => {
            this.searchHeader = ref;
          }}
            {...this.props}
          />

          <Table
            loading={loading}
            searchDefault={searchDefault}
            columns={getListColumns(this)}
            sele
            disableRowSelection
          // dataSource={transformOrderList(orders?.list?.list)}
          // fuck......
            dataSource={jiajuCoupon?.list?.list}
            pagination={jiajuCoupon?.list?.pagination}
            rowKey="applyId"
          />
        </PanelList>

        <ApproveModal
          visible={this.state.modalVisible}
          onCancel={this.handleApproveHide}
          onOk={this.handleApprove}
        />
      </Card>
    );
  }
}

