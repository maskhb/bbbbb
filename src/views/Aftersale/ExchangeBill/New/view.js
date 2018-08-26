/*
 * 新增换货单
 */

import { fenToYuan } from 'utils/money';
import React, { PureComponent } from 'react';
import { Form, Card, Table, Select, Message, InputNumber, Modal } from 'antd';
import { connect } from 'dva';
import { goTo } from 'utils/utils';
import classNames from 'classnames';
import { MonitorInput } from 'components/input';
import PageHeaderLayout from 'layouts/PageHeaderLayout';
import DetailFooterToolbar from 'components/DetailFooterToolbar';
import { goodsColumns } from './columns';

import styles from './index.less';
import AddressModal from './addressModal';
// import { mul } from '../../../../utils/number';

const { Option } = Select;


@connect(({ aftersale, member, loading }) => ({
  aftersale,
  member,
  loading: loading.effects['aftersale/goOpenExchangeOrder'],
}))
@Form.create()
export default class View extends PureComponent {
  static defaultProps = {};

  state = {
    hasInvoice: 1,
    invoiceType: 2,

    modalVisible: false,
  };


  componentDidMount = () => {
    this.initDetail();
  }

  onCancel() {
    this.setState({
      modalVisible: false,
    });
  }

  onOk() {
    const { dispatch, aftersale } = this.props;
    const { goOpenExchangeOrder } = aftersale || {};
    const { addressModal } = this;
    addressModal.validateFields((err, values) => {
      if (err) {
        return;
      }
      const addressVo = {
        id: goOpenExchangeOrder?.applyOrderId,
        deliveryContact: values.consigneeName,
        deliveryContactPhone: values.consigneeMobile,
        pickupAddress: values.detailedAddress,
        pickupProvinceId: values.area.value[0],
        pickupCityId: values.area.value[1],
        pickupAreaId: values.area.value[2],
      };
      dispatch({
        type: 'aftersale/updateAddress',
        payload: {
          addressVo,
        },
      }).then(() => {
        const res = this.props.aftersale.updateAddress;
        if (res) {
          Message.success('修改成功');
          this.goOpenExchangeOrder();
          this.setState({
            modalVisible: false,
          });
        }
      });
    });
  }

  editAddress() {
    this.setState({
      modalVisible: true,
    });
  }


  /* 是否需要发票 */
  changeHasInvoice(value) {
    this.setState({
      hasInvoice: value,
    });
  }

  /* 发票类型切换 */
  changeInvoiceType(value) {
    this.setState({
      invoiceType: value,
    });
  }

  goOpenExchangeOrder() {
    const { dispatch } = this.props;
    const { id: applyOrderSn } = this.props?.match?.params;
    dispatch({
      type: 'aftersale/goOpenExchangeOrder',
      payload: {
        applyOrderSn,
      },
    });
  }

  initDetail = async () => {
    const { dispatch } = this.props;

    const { id: applyOrderSn, accountId } = this.props?.match?.params;

    dispatch({
      type: 'aftersale/goOpenExchangeOrder',
      payload: {
        applyOrderSn,
      },
    });

    dispatch({
      type: 'aftersale/accountDetail',
      payload: {
        accountId,
      },
    });
  };

  /* 提交 */
  handleSubmit = () => {
    const that = this;
    const { dispatch, aftersale, form } = this.props;
    const { goOpenExchangeOrder } = aftersale || {};
    // 校验并滚动到错误位置
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const orderGoodsExchangePaymentVo = values;
      orderGoodsExchangePaymentVo.applyOrderId = goOpenExchangeOrder?.applyOrderId;
      // orderGoodsExchangePaymentVo.returnSn = goOpenExchangeOrder?.returnSn;
      if (orderGoodsExchangePaymentVo.hasInvoice === 1) {
        orderGoodsExchangePaymentVo.invoiceType = 1;
      }
      if (orderGoodsExchangePaymentVo.preBalance && orderGoodsExchangePaymentVo.preBalance > 0) {
        orderGoodsExchangePaymentVo.preBalance = parseInt(
          orderGoodsExchangePaymentVo.preBalance * 100, 10
        );
      } else {
        orderGoodsExchangePaymentVo.preBalance = 0;
      }
      if (orderGoodsExchangePaymentVo.walletBalance
        && orderGoodsExchangePaymentVo.walletBalance > 0) {
        orderGoodsExchangePaymentVo.walletBalance = parseInt(
          orderGoodsExchangePaymentVo.walletBalance * 100, 10
        );
      } else {
        orderGoodsExchangePaymentVo.walletBalance = 0;
      }
      delete orderGoodsExchangePaymentVo.hasInvoice;

      Modal.confirm({
        title: '确定新增换货订单吗？',
        content: '请确认信息填写无误',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'aftersale/addExchangeOrder',
            payload: {
              orderGoodsExchangePaymentVo,
            },
          }).then(() => {
            const res = that.props.aftersale.addExchangeOrder;
            if (res) {
              Message.success('新增成功');
              goTo('/aftersale/exchangebill');
            }
          });
        },
      });
    });
  };

  /* 弹出框 */
  renderModal() {
    const { modalVisible } = this.state;
    return (
      <AddressModal
        ref={(inst) => { this.addressModal = inst; }}
        visible={modalVisible}
        onCancel={this.onCancel.bind(this)}
        onOk={this.onOk.bind(this)}
      />
    );
  }

  render() {
    const { aftersale } = this.props;
    const { goOpenExchangeOrder, accountDetail } = aftersale || {};
    const { form } = this.props;
    const largeLayout = {
      labelCol: {
        xs: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 10 },
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 5 },
      },
    };
    let neetPaidAmount = (
      goOpenExchangeOrder?.totalExchangeAmount - goOpenExchangeOrder?.totalOriginAfterSaleAmount
    );
    if (neetPaidAmount < 0) {
      neetPaidAmount = 0;
    }
    return (
      <PageHeaderLayout wrapperClassName={classNames(styles.view_aftersale_returnbill_detail)}>
        { this.renderModal() }
        <Card title="基本信息" type="inner">
          <Form>
            <Form.Item label="收货地址" {...largeLayout} className={styles.mb_0}>
              <span>
                {goOpenExchangeOrder?.provinceName}
                {goOpenExchangeOrder?.cityName}
                {goOpenExchangeOrder?.areaName}{goOpenExchangeOrder?.detailedAddress}，
                {goOpenExchangeOrder?.consigneeMobile}，
                {goOpenExchangeOrder?.consigneeName}
                <a className={styles.ml_10} onClick={this.editAddress.bind(this)}>[修改]</a>
              </span>
            </Form.Item>
            <Form.Item label="用户名" {...formItemLayout} className={styles.mb_0}>
              <span>{goOpenExchangeOrder?.nickName}</span>
            </Form.Item>
            <Form.Item label="客户留言" {...formItemLayout} className={styles.mb_0}>
              <span>{goOpenExchangeOrder?.userRemark}</span>
            </Form.Item>
            <Form.Item label="换货订单金额" {...formItemLayout} className={styles.mb_0}>
              <span>{fenToYuan(goOpenExchangeOrder?.totalExchangeAmount || 0)}</span>
            </Form.Item>
            <Form.Item label="原商品售后总额" {...formItemLayout} className={styles.mb_0}>
              <span>{fenToYuan(goOpenExchangeOrder?.totalOriginAfterSaleAmount || 0)}</span>
            </Form.Item>
            <Form.Item label="应付金额" {...formItemLayout} className={styles.mb_0}>
              <span>
                {fenToYuan(neetPaidAmount)}
              </span>
            </Form.Item>
            <Form.Item label="订单备注" {...formItemLayout} className={styles.mb_0}>
              {form.getFieldDecorator('orderRemark', {
                // initialValue: 2,
              })(
                <MonitorInput />
              )}
            </Form.Item>
          </Form>
        </Card>

        <Card title="商品信息" type="inner">
          <Table
            columns={goodsColumns}
            dataSource={goOpenExchangeOrder?.orderGoodsList}
            pagination={false}
            rowKey="skuId"
          />
        </Card>
        <Card title="支付方式" type="inner">
          <Form>
            <Form.Item label="预存款金额" {...formItemLayout}>
              {form.getFieldDecorator('preBalance', {
                initialValue: 0,
              })(
                <InputNumber style={{ width: 200 }} />
              )}
              <div className={styles.red}>
                当前会员余额为：{fenToYuan(accountDetail?.preDepositVo?.balance)}元，
                可用余额：{fenToYuan(accountDetail?.preDepositVo?.balance)}元
              </div>
            </Form.Item>
            <Form.Item label="蜜家钱包金额" {...formItemLayout}>
              {this.props.form.getFieldDecorator('walletBalance', {
                initialValue: 0,
              })(
                <InputNumber style={{ width: 200 }} />
              )}
              <div className={styles.red}>
                当前会员余额为：{fenToYuan(accountDetail?.walletVo?.balance)}元
              </div>
            </Form.Item>
          </Form>
        </Card>
        <Card title="填写发票信息" type="inner">
          <Form>
            <Form.Item label="需要发票" {...formItemLayout}>
              {form.getFieldDecorator('hasInvoice', {
                initialValue: this.state.hasInvoice,
              })(
                <Select onChange={this.changeHasInvoice.bind(this)}>
                  <Option value={1}>不需要</Option>
                  <Option value={0}>需要</Option>
                </Select>
              )}
            </Form.Item>
            {
              this.state.hasInvoice === 0 ? (
                <div>
                  <Form.Item label="发票类型" {...formItemLayout}>
                    {form.getFieldDecorator('invoiceType', {
                      initialValue: this.state.invoiceType,
                    })(
                      <Select onChange={this.changeInvoiceType.bind(this)}>
                        <Option value={2}>个人</Option>
                        <Option value={3}>单位</Option>
                      </Select>
                    )}
                  </Form.Item>
                  <Form.Item label="发票抬头" {...formItemLayout}>
                    {form.getFieldDecorator('invoiceTitle', {
                      rules: [{ required: true, message: '请输入发票抬头' }],
                    })(
                      <MonitorInput />
                    )}
                  </Form.Item>
                  {
                    this.state.invoiceType === 3 ? (
                      <Form.Item label="纳税人识别号" {...formItemLayout}>
                        {form.getFieldDecorator('invoiceTaxId', {
                          rules: [{ required: true, message: '请输入纳税人识别号' }],
                        })(
                          <MonitorInput />
                        )}
                      </Form.Item>
                    ) : ''
                  }
                  <Form.Item label="发票内容" {...formItemLayout}>
                    {form.getFieldDecorator('invoiceContent', {
                      initialValue: '商品明细',
                    })(
                      <MonitorInput disabled />
                    )}
                  </Form.Item>
                </div>
              ) : ''
            }
          </Form>
        </Card>
        <DetailFooterToolbar
          submitBtnTitle="确认新增换货订单"
          form={form}
          submitting={this.state.loading}
          handleSubmit={this.handleSubmit}
        />
      </PageHeaderLayout>
    );
  }
}
