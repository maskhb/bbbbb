/*
 * @Author: wuhao
 * @Date: 2018-04-12 10:28:03
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-12 18:47:14
 *
 * 确认收货弹框
 */
import React, { PureComponent } from 'react';

import { Button, Modal, Row, Col, Icon } from 'antd';

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

  handleModalOk = async () => {
    const { onOk, params } = this.props;
    if (onOk) {
      this.setState({
        loading: true,
      });
      await onOk({ ...params });
    }
    this.setState({
      showModal: false,
      loading: false,
    });
  }

  render() {
    const { hideBtn } = this.props;
    const { showModal, loading } = this.state;

    const btnElm = <Button type="primary" onClick={this.handleButtonClick}>确认收货</Button>;

    return [
      {
        ...(hideBtn ? null : btnElm),
      },
      <Modal
        visible={showModal}
        confirmLoading={loading}
        destroyOnClose
        title="确认收货"
        width="600px"
        onCancel={this.handleModalCanale}
        onOk={this.handleModalOk}
      >
        <Row type="flex">
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
      </Modal>,
    ];
  }
}

export default ModalConfirmReceipt;
