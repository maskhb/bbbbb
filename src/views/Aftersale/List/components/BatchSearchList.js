/*
 * @Author: wuhao
 * @Date: 2018-04-08 16:18:03
 * @Last Modified by: fuanzhao
 * @Last Modified time: 2018-07-16 14:14:12
 *
 * 订单列表操作和过滤组件
 */


import React, { PureComponent } from 'react';
import { Button, Modal, message } from 'antd';
import Authorized from 'utils/Authorized';
// import { Link } from 'dva/router';

import { Batch } from 'components/PanelList';

import ModalAddLink from './ModalAddLink';

class BatchSearchList extends PureComponent {
  state = {
    ModalAddLinkVisible: false,
  }

  handleBathOperating = (rows) => {
    if (rows?.length > 1) {
      message.error('不支持多选!');
      return;
    }
    Modal.confirm({
      title: '确定要关闭该售后申请单?',
      content: (<div style={{ color: 'red' }}>关闭手此售后申请单将作废</div>),
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'aftersale/applyOrderShutdownApplyOrder',
          payload: rows[0],
        }).then(() => {
          if (this.props.onFetch) {
            this.props.onFetch();
            this.props?.handleResetCheckbox();
          }
        });
      },
    });
  }

  render() {
    return (
      <Batch {...this.props}>
        <Batch.Item>
          {
            () => {
              return (
                <Authorized authority={['OPERPORT_JIAJU_AFTERSERVICELIST_ADD']}>
                  {/* <Link to="/business/list/add/0"> */}
                  <Button
                    type="primary"
                    onClick={() => this.setState({
                    ModalAddLinkVisible: true,
                  })}
                  >新增售后申请单
                  </Button>
                  <ModalAddLink
                    visible={this.state.ModalAddLinkVisible}
                    onCancel={() => {
                    this.setState({
                      ModalAddLinkVisible: false,
                    });
                  }}
                  />
                  {/* </Link> */}
                </Authorized>
              );
            }
          }
        </Batch.Item>
        <Batch.Item>
          {
            ({ rows }) => {
              return (
                <Authorized authority={['OPERPORT_JIAJU_AFTERSERVICELIST_CLOSE']}>
                  <Button type="primary" disabled={rows?.length !== 1} onClick={this.handleBathOperating.bind(this, rows)}>关闭售后申请单</Button>
                </Authorized>
              );
            }
          }
        </Batch.Item>
      </Batch>
    );
  }
}

export default BatchSearchList;
