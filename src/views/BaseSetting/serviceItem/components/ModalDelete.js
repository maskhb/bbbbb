import React, { PureComponent } from 'react';
import { message, Modal, Button } from 'antd';

const { confirm } = Modal;

class ModalDelete extends PureComponent {
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

  submitDelete = async () => {
    const { dispatch, record } = this.props;
    const { serviceItemId } = record;

    const response = await dispatch({
      type: 'serviceItem/deleteItem',
      payload: {
        serviceItemId,
      },
    });

    if (response) {
      message.success('删除成功', 3);

      this.refreshRequestPage();
    }
  }

  handleBtnDelete = () => {
    confirm({
      title: '确定要删除该服务?',
      okText: '确定',
      cancelText: '取消',
      onOk: this.submitDelete,
    });
  }

  render() {
    return (
      <Button
        size="small"
        style={{ marginRight: 10 }}
        onClick={this.handleBtnDelete}
      >
        删除
      </Button>
    );
  }
}

export default ModalDelete;
