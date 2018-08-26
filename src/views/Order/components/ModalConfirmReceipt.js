/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:28:03
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-18 08:56:40
 *
 * 确认收货弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal, Row, Col, Icon, message } from 'antd';

class ModalConfirmReceipt extends PureComponent {
  static defaultProps = {};

  state = {
    showModal: false,
    loading: false,
  }

  handleButtonClick = () => {
    this.setState({
      showModal: true,
    });
  }

  handleModalCanale = () => {
    this.setState({
      showModal: false,
    });
  }

  handleDefaultOk = async ({ orderSn }) => {
    const { dispatch, refresh } = this.props;
    await dispatch({
      type: 'orders/receipt',
      payload: {
        orderSn,
      },
    });

    const { orders } = this.props;
    if (orders?.receipt === null) {
      throw new Error();
    }

    message.success('确认收货成功');

    if (refresh) {
      refresh();
    }
  }

  handleModalOk = async () => {
    const { onOk, params } = this.props;
    this.setState({
      loading: true,
    });

    try {
      if (onOk) {
        await onOk({ ...params });
      } else {
        await this.handleDefaultOk({ ...params });
      }
      this.setState({
        showModal: false,
        loading: false,
      });
    } catch (e) {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { hideBtn } = this.props;
    const { showModal, loading } = this.state;

    const btnElm = <Button key="c_c_mcr_btn" type="primary" onClick={this.handleButtonClick}>确认收货</Button>;

    return [
      hideBtn ? null : btnElm,
      <Modal
        key="c_c_mcr_modal"
        visible={showModal}
        destroyOnClose
        title="确认收货"
        width="500px"
        footer={null}
        onCancel={this.handleModalCanale}
      >
        <Row type="flex" style={{ padding: '15px 0' }}>
          <Col offset={4}>
            <Icon
              type="question-circle"
              style={{
                fontSize: '30px',
                color: '#FFD700',
              }}
            />
          </Col>
          <Col offset={1}>
            <span style={{
              fontSize: '14px',
              fontWeight: 'bold',
            }}
            >
              确认收货前，请先联系用户确认已经收到货！
            </span>
            <br />
            <span style={{
              fontSize: '12px',
              color: '#cccccc',
            }}
            >
              确认收货后，用户自己将不能操作确认收货。
            </span>
          </Col>
        </Row>
        <div style={{
          textAlign: 'right',
          padding: '25px 0 0 0',
        }}
        >
          <Button onClick={this.handleModalCanale} style={{ marginRight: '8px' }}>取消</Button>
          <Button type="primary" onClick={this.handleModalOk} loading={loading}>确定</Button>
        </div>
      </Modal>,
    ];
  }
}

export default ModalConfirmReceipt;
