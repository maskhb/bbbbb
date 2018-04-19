import React from 'react';
import { Popconfirm } from 'antd';
import moment from 'moment';
import { format } from 'components/Const';
import { handleRemove } from 'components/Handle';

const payTypeArr = [
  { key: 'wx_app', value: '微信手机支付' },
  { key: 'ali_app', value: '支付宝电脑支付' },
  { key: 'wx_jsapi', value: '微信公众号' },
  { key: 'ali_wap', value: '支付宝手机支付' },
  { key: 'allin_h5', value: '通联手机网页H5支付' },
  { key: 'lakala_pos', value: '拉卡拉pos支付' },
  { key: 'allin_b2b', value: '通联B2B网关支付' },
];

export default (me) => {
  return [
    {
      title: '支付单号',
      dataIndex: 'payOrder',
    },
    {
      title: '恒腾支付流水号',
      dataIndex: 'transactionId',
    },
    {
      title: '订单编号',
      dataIndex: 'businessNo',
    },
    {
      title: '支付方式',
      dataIndex: 'payType',
    },
    {
      title: '支付金额',
      dataIndex: 'totalFee',
      render(val) {
        if (val || val === 0) {
          return (Math.parseInt(val) / 100).toFixed(2);
        } else {
          return '';
        }
      },
    },
    {
      title: '支付时间',
      dataIndex: 'endTime',
      render: val => <span>{moment(val).format(format)}</span>,
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
      title: '支付平台交易流水号',
      dataIndex: 'thirdPartTransactionId',
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm placement="top" title="确认删除？" onConfirm={handleRemove.bind(me, [val.id], 'goods')} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};

export {
  payTypeArr,
};
