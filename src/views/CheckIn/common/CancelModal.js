import React from 'react';
import PropTypes from 'prop-types';
import { Form, message, Input, DatePicker, Select } from 'antd';
import ModalCover from './ModalCover';
import _ from 'lodash';
import { GRES_STATE } from './status';
import { fenToYuan } from 'utils/money';
@Form.create()
export default class CancelModal extends React.Component {
  static propTypes = {
    gresId: PropTypes.number.isRequired, // 单号
    dispatch: PropTypes.func.isRequired, // dispatch
    checkIn: PropTypes.any.isRequired,
    onOk: PropTypes.func, // 是否需要更新房态,
  };

  static defaultProps = {
  };

  state = {
    depostAmount: 0,
    refundAmount: 0,
  };

  handleOkBtn() {
    const { dispatch, gresId, onOk } = this.props;
    return new Promise((resolve) => {
      this.validInvoiceForm()
        .then((res) => {
          dispatch({
            type: 'checkIn/gresCancel',
            payload: {
              gresId,
              ...res,
            },
          }).then((res) => {
            if (res) {
              onOk ? onOk() : this.updateRoomState(gresId);
              message.success('取消成功');
              resolve();
            }
          });
        });
    });
  }

  // 更新对应账单的房态
  updateRoomState(gresId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'checkIn/updateRoomState',
      payload: {
        gresId,
        status: GRES_STATE.cancel.value,
      },
    });
  }

  validInvoiceForm = () => {
    return new Promise((resolve) => {
      const { form } = this.props;
      form?.validateFields((err, values) => {
        if (!err) {
          resolve(values);
        }
      });
    });
  }

  // /gres/getDepositInfo 获取客单的已付定金已退金额信息
  fetchCancelInfo() {
    const { dispatch, gresId } = this.props;
    dispatch({
      type: 'checkIn/gresGetDepositInfo',
      payload: {
        gresId,
      },
    }).then((res) => {
      this.setState(res);
    });
  }

  renderForm() {
    const { form } = this.props;
    const formItemStyle = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div>
        <div>
          已付订金：￥{fenToYuan(this.state.depostAmount)}，
          已退金额：￥{fenToYuan(this.state.refundAmount)}
        </div>
        <br />
        <Form>
          <Form.Item label="备注" {...formItemStyle}>
            {form.getFieldDecorator('remark', {
              rules: [{
                required: true,
                message: '请输入备注',
              }, {
                max: 200,
                message: '不允许录入超过200个字符',
              }],
            })(
              <Input.TextArea autosize={{ minRows: 2, maxRows: 6 }} />
            )}
          </Form.Item>
        </Form>
      </div>
    );
  }

  render() {
    return (
      <ModalCover
        title="取消"
        content={this.renderForm()}
        onOk={this.handleOkBtn.bind(this)}
      >
        {modalShow => (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              modalShow();
              this.fetchCancelInfo.call(this);
            }}
          >
            取消
          </a>
) }
      </ModalCover>
    );
  }
}
