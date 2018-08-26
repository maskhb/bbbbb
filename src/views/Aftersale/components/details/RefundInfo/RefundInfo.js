/**
 * 退款意向/退款信息
 */
import React from 'react';
import { Table, Button, Modal, message, Checkbox } from 'antd';
import { mul, div, sub, add } from 'utils/number';
import { RefundInfoColumns } from '../../../columns';

// export default function () {
//   return <div>退款意向/退款信息</div>;
// }
import { getRefundByOrderInfo } from '../../../List/Detail/utils';
import RefundModal from './RefundModal';

export default class extends React.Component {
  // eslint-disable-next-line
  state = {
    visibleForm: false,
    hasRefund: true,
    orderSn: '',
    data: [
    ],
    selectedRows: [],
    maxAmount: 0,
    // hasChange: true
    inited: false,
  }

  constructor(props) {
    super(props);
    props.form?.getFieldDecorator('refundIntentionList', { initialValue: [] });
    props.form?.getFieldDecorator('hasRefund', { initialValue: true });
    props.form?.getFieldDecorator('hasRefundChange', { initialValue: false });
  }

  // componentDidMount()

  getDataList() {
    // console.log('refund props receive Props', this.props);
    const { form, isEdit = true, detailVO } = this.props;
    const { goodsList, exchangeGoddsList, orderInfoVo } = form.getFieldsValue();
    const sumPrice = (goodsList || detailVO?.orderGoodsList)?.reduce((pval, val) => {
      const newVal = add(pval, (mul(val.afterSaleNum, val.afterSaleUnitPrice || 0) || 0));
      return newVal;
    }, 0);

    const exchangeSumPrice = (
      exchangeGoddsList || detailVO?.exchangeGoddsList
    )?.reduce((pval, val) => {
      const newVal = add(pval, (mul(val.exchangeNum, val.exchangeUnitPrice || 0) || 0));
      return newVal;
    }, 0) || 0;

    const diffPrice = sub(sumPrice, exchangeSumPrice);

    // console.log('detail...', detailVO);
    if (!isEdit) {
      return this.props.refundIntentionList || detailVO?.refundIntentionList;
    } else if (!this.state.inited && detailVO?.orderSn) {
      this.state.inited = true;
      // let data;
      this.state.maxAmount = diffPrice;
      this.state.uuid = `${detailVO?.orderSn}-${diffPrice}`;
      this.state.orderSn = detailVO?.orderSn;
      const data = detailVO?.refundIntentionList || [];
      // if (data.findIndex((d) => {
      //   return d.paymentMethodCode === 'pre_deposit';
      // }) > 0) {
      this.state.data = data;
      this.state.selectedRows = data;
      form.setFieldsValue({ refundIntentionList: data });
      return data;
      // return this.state.data;
      // }

      // data = this.getInitRefundLists(
      //   sub(sumPrice, exchangeSumPrice), detailVO?.paymentRecordVOList
      // );
      // this.state.data = data;
      // this.state.selectedRows = data;
      // form.setFieldsValue({ refundIntentionList: data });
      // return data;
    }

    const { paymentRecordVOList = [] } = orderInfoVo;

    // console.log('jifjdos fjdosf', this, goodsList, orderInfoVo);
    if (orderInfoVo) {
      const { orderSn = detailVO?.orderSn } = orderInfoVo;
      const uuid = `${orderSn}-${diffPrice}`;
      // console.log('fjdsoijfosdj goodslist', goodsList, this.state, uuid);
      if (this.state.uuid !== uuid && this.state.hasRefund) {
        // console.log('fjdsoijfosdj goodslist ---', goodsList);
        this.state.uuid = uuid;
        let { data } = this.state;
        // console.log('get refund list', this.state, goodsList, data.findIndex((d) => {
        //   return d.paymentMethodCode === 'pre_deposit';
        // }), data.findIndex((d) => {
        //   return d.paymentMethodCode === 'pre_deposit';
        // }) < 0 || data.length === paymentRecordVOList?.length);
        // if (data.findIndex((d) => {
        //   return d.paymentMethodCode === 'pre_deposit';
        // }) < 0 || data.length === paymentRecordVOList?.length
        // ) {
        data = this.getInitRefundLists(sub(sumPrice, exchangeSumPrice), paymentRecordVOList);
        this.state.selectedRows = data;
        // }
        this.state.uuid = uuid;
        this.state.orderSn = orderSn;
        this.state.maxAmount = sub(sumPrice, exchangeSumPrice);
        this.state.data = data;
        form.setFieldsValue({ refundIntentionList: data });
        return data;
      }
    }
    return this.state.data;
    // this.state.uuid;
  }

  getCurrentRefundAmount() {
    return this.state.data.reduce((pval, val) => {
      if (val.paymentMethodCode !== 'coupon') {
        const newVal = pval + val.intentRefundAmount;
        return newVal;
      }
      return pval;
    }, 0);
  }

  getInitRefundLists = (sumPrice, paymentList) => {
    return getRefundByOrderInfo(paymentList, sumPrice);
    // console.log('sumPrice', sumPrice, paymentList);
  }

  getMaxLeaveAmount = () => {
    return this.state.maxAmount - this.getCurrentRefundAmount();
  }

  rowSelection = {
    onChange: (_, selectedRows) => {
      this.setState({
        selectedRows,
      });
    },
  };

  handleFormShow = () => {
    this.setState({
      visibleForm: true,
    });
  }

  handleAddRefund = (vals) => {
    const { form } = this.props;
    const refundIntentionList = form.getFieldValue('refundIntentionList') || [];
    refundIntentionList.push(vals);
    form.setFieldsValue({
      refundIntentionList,
    });
    this.setState({
      data: refundIntentionList,
      visibleForm: false,
    });
  }

  handleRemove = () => {
    if (this.state.selectedRows.length === 0) {
      message.warn('请选择要删除的退款信息!');
      return;
    }
    Modal.confirm({
      content: '确认要删除所选的支付方式?',
      okText: '确认删除',
      cancelText: '取消',
      onOk: () => {
        const data = this.state.data.filter(d => this.state.selectedRows.indexOf(d) === -1);
        this.props.form.setFieldsValue({
          refundIntentionList: data,
          hasRefundChange: true,
        });
        this.setState({
          data,
        });
      },
    });
  }

  handleToggleHasRefund = (e) => {
    if (e.target.checked) {
      Modal.confirm({
        title: '确认该订单无需退款?',
        content: '确认此操作后所有退款记录将被删除',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.props.form.setFieldsValue({
            refundIntentionList: [],
            hasRefund: false,
            hasRefundChange: true,
          });
          this.setState({
            hasRefund: false,
            data: [],
          });
        },
      });
    } else {
      this.setState({
        hasRefund: true,
      });
      this.props.form.setFieldsValue({
        hasRefund: true,
      });
    }
  }

  handleChangeAttr = (record, attr, e) => {
    // console.log(record, attr, e.target.value);
    const data = this.state.data.map((d) => {
      if (d === record) {
        // eslint-disable-next-line
        d[attr] = e.target.value;
      }
      return d;
    });
    this.setState({
      data,
    });
    this.props.form.setFieldsValue({
      refundIntentionList: data,
    });
  }


  render() {
    const { isEdit } = this.props;
    const data = this.getDataList();
    const selectedRowKeys = this.state.selectedRows.map(s => s.transactionId);
    const rowSelectionConfig = {
      ...this.rowSelection,
      selectedRowKeys,
    };
    return (
      <div>
        {isEdit && (
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            size="small"
            onClick={this.handleFormShow}
            disabled={!this.state.hasRefund || this.getMaxLeaveAmount() <= 0}
            style={{ marginRight: 10, padding: '0 12px' }}
          >+添加
          </Button>
          <Button
            size="small"
            type="danger"
            disabled={!this.state.hasRefund}
            style={{ marginRight: 10, padding: '0 12px' }}
            onClick={this.handleRemove}
          >-删除
          </Button>
          <Checkbox
            checked={!this.state.hasRefund}
            onChange={this.handleToggleHasRefund}
          >
            确认该订单无需退款
          </Checkbox>
        </div>
        )}
        <RefundModal
          visible={this.state.visibleForm}
          onOk={this.handleAddRefund}
          maxAmount={this.getMaxLeaveAmount()}
          onCancel={() => this.setState({ visibleForm: false })}
        />
        <Table
          rowSelection={isEdit ? rowSelectionConfig : false}
          {...RefundInfoColumns(this)}
          pagination={false}
          dataSource={data}
        />
      </div>
    );
  }
}
