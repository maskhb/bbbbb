import React, { Component } from 'react';
import { Button, Icon } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import styles from './view.less';
import { payeeMethod } from '../../Receipt/List/attr';
import { digitUppercase } from '../../../utils/utils';
import { fenToYuan } from '../../../utils/money/index';
import seal from '../../../assets/seal.png';

@connect(({ receipt, loading }) => ({
  receipt,
  loading: loading.effects['receipt/queryDetail'] || loading.effects['receipt/updateStatus'],
}))
export default class Receipt extends Component {
  state = {};
  componentDidMount() {
    const { dispatch, match: { params: { id: eleReceiptId } } } = this.props;
    dispatch({
      type: 'receipt/queryDetail',
      payload: {
        eleReceiptId,
      },
    });
  }
  print = () => {
    const { dispatch, match: { params: { id: eleReceiptId } } } = this.props;
    dispatch({
      type: 'receipt/updateStatus',
      payload: {
        eleReceiptId,
      },
    }).then(() => {
      if (this.props?.receipt?.updateStatus === true) {
        window.print();
      }
    });
  }

  render() {
    const { receipt: { queryDetail } } = this.props;
    const data = {
      ...queryDetail,
    };
    data.eleReceiptSnFormat = data?.eleReceiptSn?.toUpperCase();
    data.collectionDaysFormat = moment(data?.collectionDays).format('LL');
    data.payeeMethodFormat = payeeMethod[data?.payeeMethod];
    data.collectionAmountFormat = fenToYuan(data?.collectionAmount);
    data.collectionAmountUpperFormat = digitUppercase(fenToYuan(data?.collectionAmount, true));
    return (
      <div className={styles.wraper}>
        <div className={styles.printWraper} >
          <div className={styles.title}>收款收据</div>
          <div className={styles.date}>{data?.collectionDaysFormat}</div>
          <div className={styles.number}>{data?.eleReceiptSnFormat}</div>
          <table className={styles.table} >
            <tbody>
              <tr><td>今收到</td><td>姓名</td><td>{data?.consigneeName}</td></tr>
              <tr><td>&nbsp;</td><td>手机</td><td>{data?.consigneeMobile}</td></tr>
              <tr><td>&nbsp;</td><td>商品</td><td>{data?.goodsContent}</td></tr>
              <tr><td>&nbsp;</td><td>订单编号</td><td>{data?.orderSn}</td></tr>
              <tr><td>&nbsp;</td><td>支付方式</td><td>{data?.payeeMethodFormat}</td></tr>
              <tr><td>&nbsp;</td><td>金额</td><td>¥{data?.collectionAmountFormat}</td></tr>
              <tr><td>&nbsp;</td><td>金额（大写）</td><td>{data?.collectionAmountUpperFormat}</td></tr>
              <tr><td>&nbsp;</td><td>收款单位</td><td>{data?.payeeUnitName}</td></tr>
            </tbody>
          </table>
          <div className={styles.footer}>
            <span>核准</span>
            <span>会计</span>
            <span>记账</span>
            <span>出纳</span>
            <span>经手人</span>
          </div>
          <img className={styles.seal} src={seal} alt="" />
        </div>
        <div className={styles.buttons}>
          <Icon className={styles.printIcon} type="printer" />
          <Button type="primary" onClick={this.print}>打印</Button>
          <Button style={{ marginLeft: 15 }} onClick={() => { window.close(); }}>取消</Button>
          <div className={styles.printTips}>温馨提示：请使用页面的打印按钮</div>
        </div>
      </div>
    );
  }
}

