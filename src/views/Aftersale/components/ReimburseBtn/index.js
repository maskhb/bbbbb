import React, { PureComponent } from 'react';
import { MonitorTextArea } from 'components/input';
import { format } from 'components/Const';
import { fenToYuan } from 'utils/money';
import { mul } from 'utils/number';
import moment from 'moment';

import PropTypes from 'prop-types';
import { message, Button, Modal, Form, Select, Input } from 'antd';
import styles from './style.less';

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
@Form.create()
class ReimburseBtn extends PureComponent {
  state = {
    infoModalShow: false,
  };
  // 点击确定
  handleOk = (typeA = true) => {
    const { data, dispatch, form, match: { params: { refundSn } } } = this.props;
    const editData = form.getFieldsValue();
    if (editData.realRefundAmount && mul(editData?.realRefundAmount, 100) > data?.intentRefundAmount) {
      return message.error(' 实际退款金额不得大于剩余意向金额');
    }
    // 校验并滚动到错误位置
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log('Received values of form: ', values);//eslint-disable-line
      } else {
        if (typeA) {
          if (!editData.realRefundAmount) { editData.realRefundAmount = data.intentRefundAmount; }
        } else {
          editData.realRefundAmount *= 100;
        }
        const newData = { ...data, ...editData };
        const {
          accountName,
          applyOrderId,
          bankAccount,
          bankName,
          createdBy,
          createdTime,
          expiryTime,
          hasRefundAmount,
          intentRefundAmount,
          isDelete,
          paidAmount,
          paymentMethodCode,
          paymentMethodName,
          realRefundAmount,
          refundIntentionId,
          refundStatus,
          refundTime,
          remark,
          transactionId,
        } = newData;
        const refundIntentionVo = {
          accountName,
          applyOrderId,
          bankAccount,
          bankName,
          createdBy,
          createdTime,
          expiryTime,
          hasRefundAmount,
          intentRefundAmount,
          isDelete,
          paidAmount,
          paymentMethodCode,
          paymentMethodName,
          realRefundAmount,
          refundIntentionId,
          refundStatus,
          refundTime,
          remark,
          transactionId,
        };

        return dispatch({
          type: 'refound/executeRefund',
          payload: { refundIntentionVo },
        }).then((res) => {
          if (res) {
            message.success('提交成功');
            dispatch({
              type: 'refound/refundOrderDetail',
              payload: { refundSn },
            });
          } else {
            message.error('提交失败');
          }
        });
      }
    });
  }

  // 点击取消
  cancelModal() {
    this.setState({ infoModalShow: false });
  }

  showModal = () => {
    this.setState({ infoModalShow: true });
  }

  /* 退款金额显示逻辑 */
  money = (data = this.props.data) => {
    const { paymentMethodCode } = data;
    /*  '预存款/蜜家钱包/优惠券'  */
    /* eslint-disable-next-line */
    // const typeA = !['ali_wap', 'ali_pc', 'wx_jsapi', 'wx_native', 'wx_pc', 'lakala_pos', 'lakala_pos_pc'].includes(paymentMethodCode);
    const typeA = ['pre_deposit', 'coupon', 'wallet'].includes(paymentMethodCode);
    const { intentRefundAmountFormat, intentRefundAmount, couponAmount, couponExpiryDate } = data;
    let money;
    let time;
    let SpeRemark;
    let noInfo;
    if (typeA) {
      switch (paymentMethodCode.toUpperCase()) {
        case 'PRE_DEPOSIT':
          /* 预存款支付 */
          money = intentRefundAmountFormat;
          time = moment().add(90, 'days').format(format);
          break;
        case 'COUPON':
        /* 优惠券退款 */
          if (couponAmount !== intentRefundAmount) {
            money = 0;
            noInfo = true;
            SpeRemark = '该优惠券不支持退回';
          } else {
            money = fenToYuan(couponAmount);
          }
          time = moment(couponExpiryDate).format(format);
          break;
        case 'WALLET':
          /* 钱包退款 */
          money = intentRefundAmountFormat;
          time = '';
          break;
        default:
          money = intentRefundAmountFormat;
          time = '';
          break;
      }
    }
    return { money, time, SpeRemark, noInfo };
  }


  render() {
    const { infoModalShow } = this.state;
    const { text, buttonType, form, data } = this.props;
    const { paymentMethodCode } = data;
    /*  '预存款/蜜家钱包/优惠券'  */
    const typeA = ['pre_deposit', 'coupon', 'wallet'].includes(paymentMethodCode);
    /* eslint-disable-next-line */
    // const typeA = !['ali_wap', 'ali_pc', 'wx_jsapi', 'wx_native', 'lakala_pos', 'lakala_pos_pc'].includes(paymentMethodCode);
    const { money, time, SpeRemark, noInfo } = this.money(data);
    return (
      <div className={styles.box}>
        {buttonType === 'button' ? (
          <Button onClick={() => this.showModal()}>
            {text}
          </Button>
        ) : (
          <a onClick={this.showModal.bind(this)}>
            {text}
          </a>
          )}

        { infoModalShow ? (
          <Modal
            title="执行退款"
            visible={infoModalShow}
            onOk={this.handleOk.bind(this, typeA)}
            onCancel={this.cancelModal.bind(this)}
          >
            <Form>
              { /*
              ALI_WAP("ali_wap", "支付宝手机支付"),

              WX_JSAPI("wx_jsapi", "微信手机支付"),

              LAKALA_POS("lakala_pos", "T-拉卡拉POS机刷卡支付（移动端）"),

              JJQ_H5("jjq_h5", "品牌家居券手机支付"),

              PRE_DEPOSIT("pre_deposit", "预存款支付"),


              WALLET("wallet", "钱包支付"),

              JJQ_PC("jjq_pc", "品牌家居券电脑支付"),

              LAKALA_POS_PC("lakala_pos_pc", "拉卡拉POS机刷卡支付（PC）"),


              ALI_PC("ali_pc", "支付宝电脑支付"),

              WX_NATIVE("wx_native", "微信扫码支付"),

              UNION_PAY("union_pay", "银联全渠道网关支付"),

              CASH_OFFLINE("cash_offline", "线下现金转账"),

              COUPON("coupon", "优惠券");
            */}

              <Form.Item
                {...formItemLayout}
                label="退款方式："
              >
                {
                  typeA ? '预存款/蜜家钱包/优惠券' : '支付宝/微信/拉卡拉'
                }
              </Form.Item>

              <Form.Item
                {...formItemLayout}
                label="意向金额："
              >
                {form.getFieldDecorator('intentRefundAmountFormat', {
                  initialValue: data.intentRefundAmountFormat,
                })(
                  <span>{data.intentRefundAmountFormat}</span>
                )}

              </Form.Item>

              {
                typeA ? (
                  <Form.Item
                    {...formItemLayout}
                    label="实际退款金额："
                  >
                    {form.getFieldDecorator('intentRefundAmountFormat', {
                      initialValue: data.intentRefundAmountFormat,
                    })(
                      <span className={styles.red} >
                        {money}
                      </span>
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item
                    {...formItemLayout}
                    label="实际退款金额："
                  >
                    {form.getFieldDecorator('realRefundAmount', {
                        rules: [{
                          required: true, message: '请选择退款状态',
                        }],
                        initialValue: data.realRefundAmount,
                      })(
                        <Input />
                      )}
                  </Form.Item>

                  )
              }


              {
                typeA ? (!time ? '' : (

                  <Form.Item
                    {...formItemLayout}
                    label="失效日期："
                  >

                    <span >
                      {time}
                    </span>

                  </Form.Item>

                  )
                ) : ''
              }
              {
                typeA ? (
                  <Form.Item
                    {...formItemLayout}
                    label="退款状态："
                  >
                    {form.getFieldDecorator('refundStatus', {
                      rules: [{
                        required: true, message: '请选择退款状态',
                      }],
                      initialValue: (noInfo ? 3 : ''),
                })(
                  <Select>
                    <Option value={2}>已退款</Option>
                    <Option value={3}>无需退款</Option>
                  </Select>
                )}

                  </Form.Item>

                ) : (
                  <Form.Item
                    {...formItemLayout}
                    label="退款状态："
                  >
                    {form.getFieldDecorator('refundStatus', {
                  rules: [{
                    required: true, message: '请选择退款状态',
                  }],
                  initialValue: (SpeRemark ? 3 : 2),
                })(
                  <Select>
                    <Option value={2}>已退款</Option>
                    <Option value={3}>无需退款</Option>
                    <Option value={1}>退款中</Option>
                  </Select>
                )}

                  </Form.Item>
                )
              }


              <Form.Item
                {...formItemLayout}
                label="退款备注："
              >
                {form.getFieldDecorator('remark', {
                  initialValue: SpeRemark || data.remark,
                })(
                  <MonitorTextArea
                    datakey="remark"
                    rows={5}
                    maxLength={200}
                    form={this.props.form}
                    simple
                  />
                )}
              </Form.Item>
            </Form>
            {typeA ? (
              <p className={styles.info}>*预存款、蜜家钱包、优惠券只支持全额退款</p>
            ) : ''}
          </Modal>
        ) : ''}
      </div>
    );
  }
}
ReimburseBtn.defaultProps = {
  text: '执行退款',
  buttonType: 'button',
};

ReimburseBtn.propTypes = {
  text: PropTypes.string,
  buttonType: PropTypes.string,
};

export default ReimburseBtn;
