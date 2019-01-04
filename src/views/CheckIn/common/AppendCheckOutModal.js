import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Radio, message } from 'antd';
import ModalCover from './ModalCover';
import SelectSource from './SelectSource';
import { CHECKOUT_STATE, GRES_STATE } from './status';
import { fenToYuan } from 'utils/money';

@Form.create()
export default class AppendCheckOutModal extends React.Component {
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
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    record: {},
  };

  state = {
    value: 0,
  };

  // 获取结账信息
  fetchPreCheckOutInfo = () => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'checkIn/gresPreCheckOut',
      payload: {
        gresId: record.gresId,
      },
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
          this.remoteCheckout(values);
          resolve(true);
        }
      });
    });
  }

  // 发请求退房
  remoteCheckout = (values) => {
    const { dispatch, record } = this.props;
    const { payWay, companyId = -1 } = values;
    dispatch({
      type: 'checkIn/gresAppendCheckOut',
      payload: {
        gresId: record.gresId,
        payWay,
      },
    }).then((res) => {
      if (res) {
        message.success('补结账成功');
        this.updateRoomState(record.gresId);
      }
    });
  }

  // 更新对应账单的房态
  updateRoomState(gresId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/updateRoomState',
      payload: {
        gresId,
        status: GRES_STATE.checkOut.value,
      },
    });
  }

  // 渲染header
  renderHeaderInfo = (gresPreCheckOut) => {
    const { receivableAmount = '', totalFee = '', totalReceipt = '', totalRefund='' } = gresPreCheckOut;
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
    const arr = CHECKOUT_STATE.slice(0, 1);

    return (
      <Radio.Group onChange={this.handleRadioChange}>
        {arr.map(item => <Radio value={item.value} key={item.value}>{item.label}</Radio>)}
      </Radio.Group>
    );
  }

  renderForm() {
    const { form, record, checkIn, dispatch } = this.props;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

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
        title="补结账"
        onOk={this.handleModalCheckOut.bind(this)}
      >
        {modalShow => (
          <a
            href="javascript:;"
            onClick={(e) => {
              modalShow();
              this.fetchPreCheckOutInfo();
            }}
          >
            补结账
          </a>
        ) }
      </ModalCover>
    );
  }
}
