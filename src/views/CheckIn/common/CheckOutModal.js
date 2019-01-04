import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Radio, message } from 'antd';
import ModalCover from './ModalCover';
import SelectSource from './SelectSource';
import SelectAccountReceivable from './SelectAccountReceivable';

import { CHECKOUT_STATE, GRES_STATE, RES_TYPE } from './status';
import { fenToYuan } from 'utils/money';

@Form.create()
export default class CheckOutModal extends React.Component {
  static propTypes = {
    record: PropTypes.shape({
      gresId: PropTypes.number,
      gresPreCheckOut: PropTypes.shape({
        receivableAmount: PropTypes.number,
        totalFee: PropTypes.number,
        totalReceipt: PropTypes.number,
      }),
      roomId: PropTypes.number,
    }),
    cashier: PropTypes.any, // modal cashier
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    record: {},
  };

  state = {
    value: 0,
    record: {
      gresPreCheckOut: null,
    },
    confirmLoading: false,
  };

  componentDidMount() {
    this.setState({
      record: this.props.record,
    });
  }

  // 获取结账信息
  fetchPreCheckOutInfo = () => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'checkIn/gresPreCheckOut',
      payload: {
        gresId: record.gresId,
      },
    })
      .then((res) => {
        this.setState({
          ...this.state,
          record: {
            ...this.state.record,
            gresPreCheckOut: res,
          },
        });
      });
  }

  handleRadioChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  handleModalCheckOut = () => {
    const { form } = this.props;
    return new Promise((resolve) => {
      form?.validateFields((err, values) => {
        if (!err) {
          this.setState({ confirmLoading: true });
          this.remoteCheckout(values, resolve);
        }
      });
    });
  }

  // 发请求退房
  remoteCheckout = (values, resolve) => {
    const { payWay } = values;
    switch (payWay) {
      case CHECKOUT_STATE[0].value: this.gresCheckOut(values, resolve); break;
      case CHECKOUT_STATE[1].value: this.returnHouseCredit(values, resolve); break;
      case CHECKOUT_STATE[2].value: this.returnHouseProtocol(values, resolve); break;
    }
  }

  // 现结
  gresCheckOut = (values, resolve) => {
    const { dispatch, record } = this.props;
    const { payWay, companyId = -1 } = values;
    dispatch({
      type: 'checkIn/gresCheckOut',
      payload: {
        gresId: record.gresId,
        roomId: record.roomId,
        payWay,
        companyId,
      },
    }).then((res) => {
      this.setState({ confirmLoading: false });
      if (res) {
        // message.success('现结成功');
        this.updateRoomState(record.gresId);
        resolve();
      }
    }).catch(() => {
      this.setState({ confirmLoading: false });
    });
  }

  // 退房-临时挂账
  returnHouseCredit =(values, resolve) => {
    const { dispatch, record } = this.props;
    const tempAccountRegVO = {
      accountBalance: this.state.record?.gresPreCheckOut?.receivableAmount,
      checkInDate: record.arrivalDate,
      checkOutDate: record.departureDate,
      gresId: record.gresId,
      owner: record.guestName,
      regNo: record.gresNo,
      regTime: new Date().getTime(),
      remark: record.memo || '',
      roomNo: record.roomNo,
      roomType: record.roomTypeId,
      roomTypeName: record.roomTypeNo,
      sourceName: record.salesDeptId,
    };

    dispatch({
      type: 'nightCheck/returnHouseCredit',
      payload: { tempAccountRegVO },
    }).then((res) => {
      this.setState({ confirmLoading: false });
      if (res) {
        // message.success('临时挂账成功');
        this.updateRoomState(record.gresId);
        resolve();
      }
    }).catch(() => {
      this.setState({ confirmLoading: false });
    });
  }

  // 退房-协议单位挂账
  returnHouseProtocol=(values) => {
    const { dispatch, record } = this.props;
    const { companyId = -1 } = values;

    dispatch({
      type: 'nightCheck/returnHouseProtocol',
      payload: {
        agreementUnitAccountVO: {
          gresId: record.gresId,
          accountId: companyId,
        },
      },
    }).then((res) => {
      this.setState({ confirmLoading: false });
      if (res) {
        // message.success('协议单位挂账成功');
        this.updateRoomState(record.gresId);
        resolve();
      }
    }).catch(() => {
      this.setState({ confirmLoading: false });
    });
  }

  // 更新对应账单的房态
  updateRoomState(gresId) {
    const { dispatch } = this.props;
    message.success('退房成功');
    dispatch({
      type: 'checkIn/updateRoomState',
      payload: {
        gresId,
        status: GRES_STATE.checkOut.value,
      },
    });
  }

  // 渲染header totalRefund
  renderHeaderInfo = (gresPreCheckOut) => {
    const { receivableAmount = '', totalFee = '', totalReceipt = '', totalRefund = '' } = gresPreCheckOut;
    return (
      <div>
        当前总消费：￥{fenToYuan(totalFee)},
        总收款：￥{fenToYuan(totalReceipt)},
        总退款：￥{fenToYuan(totalRefund)},
        应收客人：<span style={{ color: 'red' }}>￥{fenToYuan(receivableAmount)}</span>
      </div>
    );
  }

  // 渲染radio group
  renderRadioGroup = () => {
    const { record } = this.props;
    let arr = CHECKOUT_STATE.slice();

    if (record.resType == RES_TYPE.team.value) {
      arr = [CHECKOUT_STATE[0], CHECKOUT_STATE[2]];
    }

    return (
      <Radio.Group onChange={this.handleRadioChange}>
        {arr.map(item => <Radio value={item.value} key={item.value}>{item.label}</Radio>)}
      </Radio.Group>
    );
  }

  renderForm() {
    const { form, checkIn, dispatch } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const { record } = this.state;

    return (
      record.gresPreCheckOut
        ? (
          <div>
            {this.renderHeaderInfo(record.gresPreCheckOut)}
            <br />
            <Form>
              <Form.Item label="结账方式" {...formItemLayout}>
                {form.getFieldDecorator('payWay', {
                initialValue: CHECKOUT_STATE[0].value,
                rules: [{
                  required: true,
                  message: '选择结账方式',
                }, {
                  validator: (rule, value, callback) => {
                    if (value == CHECKOUT_STATE[0].value && record.gresPreCheckOut.receivableAmount) {
                      callback('请先处理该房间的应收款/退款');
                    }
                    callback();
                  },
                }],
              })(this.renderRadioGroup())}
              </Form.Item>

              {(this.state.value === 3) ? (
                <Form.Item label="协议单位" {...formItemLayout}>
                  {form.getFieldDecorator('companyId', {
                  rules: [{
                    required: this.state.value === 3,
                    message: '选择协议单位',
                  }],
                })(
                  <SelectAccountReceivable dispatch={dispatch} style={{ minWidth: '80px' }} />
                )}
                </Form.Item>
            ) : ''}
            </Form>
          </div>
        )
        : <div>正在获取账单信息...</div>
    );
  }

  // 渲染modal层
  render() {
    return (
      <ModalCover
        content={this.renderForm()}
        title="退房"
        onOk={this.handleModalCheckOut.bind(this)}
        confirmLoading={this.state.confirmLoading}
      >
        {modalShow => (
          <a
            href="javascript:;"
            onClick={(e) => {
              this.fetchPreCheckOutInfo();
              modalShow();
            }}
          >
            退房
          </a>
        ) }
      </ModalCover>
    );
  }
}
