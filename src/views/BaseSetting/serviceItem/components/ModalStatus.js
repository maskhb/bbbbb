import React, { PureComponent } from 'react';
import { message, Modal, Button } from 'antd';

const { confirm } = Modal;

class ModalStatus extends PureComponent {
  refreshRequestPage = async () => {
    const { dispatch } = this.props;

    await dispatch({
      type: 'serviceItem/page',
      payload: {
        currPage: 1,
        pageSize: 10,
        serviceItemVO: {},
      },
    });
  }

  submitStatus = async () => {
    const { dispatch, record } = this.props;
    const { status, serviceItemId } = record;

    const response = await dispatch({
      type: 'serviceItem/updateStatus',
      payload: {
        serviceItemId,
        status: status === 1 ? 2 : 1,
      },
    });

    if (response) {
      message.success(`${status === 1 ? '禁用' : '启用'}成功`, 3);

      this.refreshRequestPage();
    }
  }

  handleBtnStatus = () => {
    const { record } = this.props;
    const { status } = record;

    confirm({
      title: `确定要${status === 1 ? '禁用' : '启用'}该服务?`,
      okText: '确定',
      cancelText: '取消',
      onOk: this.submitStatus,
    });
  }

  render() {
    const { record } = this.props;
    const { status } = record;

    return (
      <Button
        size="small"
        style={{ marginRight: 10 }}
        onClick={this.handleBtnStatus}
      >
        { `${status === 1 ? '禁用' : '启用'}` }
      </Button>
    );
  }
}

export default ModalStatus;
