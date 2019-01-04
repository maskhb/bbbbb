import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';
import { connect } from 'dva';

import { Table } from 'components/PanelList';

import { getColumns } from './columns';

@connect(({ loading, serviceItem }) => ({
  loading: loading.effects['serviceItem/stockLogPage'],
  serviceItem,
}))
class ModalStockLog extends PureComponent {
  state = {
    visibleStockLog: false,
  }

  initRequestPage = async () => {
    const { dispatch, record } = this.props;
    const { serviceItemId } = record;

    await dispatch({
      type: 'serviceItem/stockLogPage',
      payload: {
        currPage: 1,
        pageSize: 10,
        serviceItemLogVO: {
          serviceItemId,
        },
      },
    });
  }

  handleBtnStockLog = () => {
    this.setState({
      visibleStockLog: true,
    }, this.initRequestPage);
  }

  handleCancle = () => {
    this.setState({
      visibleStockLog: false,
    });
  }

  render() {
    const { visibleStockLog } = this.state;
    const { loading, serviceItem: { stockLogPage } } = this.props;

    return (
      <div>
        <Button
          size="small"
          style={{ marginRight: 10 }}
          onClick={this.handleBtnStockLog}
        >
          编辑日志
        </Button>
        <Modal
          centered
          title="库存编辑日志"
          closable={false}
          visible={visibleStockLog}
          onCancel={this.handleCancle}
          cancleText="取消"
          okText="确定"
          onOk={this.handleCancle}
        >
          <Table
            loading={loading}
            columns={getColumns()}
            dataSource={stockLogPage?.list}
            pagination={stockLogPage?.pagination}
            disableRowSelection
          />
        </Modal>
      </div>
    );
  }
}

export default ModalStockLog;
