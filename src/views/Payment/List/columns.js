import React from 'react';
import moment from 'moment';
import { format } from 'components/Const';
import Authorized from 'utils/Authorized';
import { fenToYuan } from '../../../utils/money';
import { mul } from '../../../utils/number';


const payTypeArr = [
  { key: 'ali_pc', value: '支付宝支付(PC)' },
  { key: 'ali_wap', value: '支付宝支付(wap)' },
  { key: 'jjq_h5', value: '恒大品牌家居券支付(移动端)' },
  { key: 'jjq_pc', value: '恒大品牌家居券支付(PC)' },
  { key: 'lakala_pc', value: '拉卡拉POS机刷卡支付(PC)' },
  { key: 'lakala_pos', value: '拉卡拉POS机刷卡支付(移动端)' },
  { key: 'sybpos_pc', value: '收银宝POS机刷卡支付(PC)' },
  { key: 'sybpos_pos', value: '收银宝POS机刷卡支付(移动端)' },
  { key: 'unionpay_pc', value: '银联全渠道网关支付' },
  { key: 'wx_jsapi', value: '微信支付(H5)' },
  { key: 'wx_pc', value: '微信支付(PC)' },
];

const logcolumns = () => {
  return [
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
    },
    {
      title: '操作类型',
      dataIndex: 'operateType',
      render(val) {
        switch (val) {
          case 1:
            return '新增';
          case 2:
            return '修改';
          default:
            break;
        }
      },
    },
    {
      title: '操作前',
      dataIndex: 'beforeValue',
      width: '20%',
    },
    {
      title: '操作后',
      dataIndex: 'afterValue',
      width: '20%',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: '20%',
    },
  ];
};

export default (me) => {
  return [
    {
      title: '支付单号',
      dataIndex: 'payOrder',
    },
    {
      title: '恒腾支付流水号',
      dataIndex: 'transactionId',
      width: '10%',
    },
    {
      title: '订单编号',
      dataIndex: 'outOrderId',
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
      render: (val, record) => {
        return <span>{`${val}(${record.payTypeKey})`}</span>;
      },
    },
    {
      title: '支付金额',
      dataIndex: 'totalFee',
      render: (val) => {
        return fenToYuan(mul(val, 100));
      },
    },
    {
      title: '支付时间',
      dataIndex: 'endTime',
      render: (val, record) => {
        if (record.payState === 1) {
          return <span>{moment(val).format(format)}</span>;
        } else {
          return <span />;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'payState',
      render(val) {
        switch (val) {
          case 0:
            return '未支付';
          case 1:
            return '已支付';
          default:
            break;
        }
      },
    },
    {
      title: '第三方交易流水号',
      dataIndex: 'thirdPartTransactionId',
      width: '20%',
    },
    {
      title: '操作',
      render: (val, record) => {
        return (
          <div>
            {
              record.transactionType === 1 ? (
                <Authorized authority="OPERPORT_JIAJU_PAYRECORDLIST_VIEWLOG">
                  <a onClick={() => me.log(record)}>日志</a>
                </Authorized>) : ''
            }{
              record.payState === 0 ? (
                <Authorized authority="OPERPORT_JIAJU_PAYRECORDLIST_EDIT">
                  <a onClick={() => me.edit(record)}>修改</a>
                </Authorized>) : ''
            }
          </div>
        );
      },
    },
  ];
};


export {
  payTypeArr,
  logcolumns,
};
