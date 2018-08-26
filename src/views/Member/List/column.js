import React from 'react';
import moment from 'moment';
import { Modal, message } from 'antd';
import { Link } from 'dva/router';
import { format } from 'components/Const';
import { getOptionLabelForValue } from 'utils/utils';
import Authorized from 'utils/Authorized';
import { fenToYuan } from 'utils/money';
import { memberStatusOptions, channelOptions } from '../const';

export default(me) => {
  // 改变激活状态
  function freezeAccount(val) {
    const { dispatch, member } = me.props;
    const { state } = member;
    const { search } = me;

    dispatch({
      type: 'member/state',
      payload: {
        status: val.memberStatus === 0
          ? 1
          : 0,
        accountId: val.accountId,
      },
    }).then(() => {
      if (state !== null) {
        message.success('设置状态成功。');
        search.handleSearch();
      } else {
        message.success('设置状态失败。');
      }
    });
  }

  function handleResetPassword(val) {
    // if (rows.length) {
    const { dispatch, member } = me.props;
    const { password } = member;
    const { search } = me;

    Modal.confirm({
      title: '重置密码后，必须新密码才能登陆',
      content: `重置会系统会生成一个6位随机密码
      发到用户手机号当中。是否继续 ?`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'member/password',
          payload: {
            accountId: val.accountId,
          },
        }).then(() => {
          if (password !== null) {
            message.success('重置密码成功。');
            search.handleSearch();
          } else {
            message.success('重置密码失败。');
          }
        });
      },
    });
    // } else {   Modal.warning({ title: '提示', content: '请先选择至少一个会员再操作！', okText:
    // '确定', cancelText: '取消' }); }
  }
  return {
    list: [
      {
        title: 'userId',
        dataIndex: 'accountId',
      }, {
        title: '登录名',
        dataIndex: 'loginName',
      }, {
        title: '真实名称',
        dataIndex: 'realName',
      }, {
        title: '昵称',
        dataIndex: 'nickName',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
      }, {
        title: '激活状态',
        dataIndex: 'memberStatus',
        render: val => <span>{getOptionLabelForValue(memberStatusOptions)(val)}</span>,
      }, {
        title: '账号来源',
        dataIndex: 'registerChannel',
        render: val => <span>{getOptionLabelForValue(channelOptions)(val)}</span>,
      }, {
        title: '注册时间',
        dataIndex: 'registerTime',
        render: val => <span>{moment(val).format(format)}</span>,
      }, {
        key: 'operator',
        title: '操作',
        render: val => (
          <div>
            <Authorized key="member_detail" authority={['OPERPORT_JIAJU_USER_DETAILS']}>
              <Link target="_blank" to={`/member/list/detail/${val.accountId}`}>
                详情
              </Link>
            </Authorized>
            &nbsp;
            <Authorized key="member_edit" authority={['OPERPORT_JIAJU_USER_EDIT']}>
              <Link target="_blank" to={`/member/list/edit/${val.accountId}`}>
                编辑
              </Link>
            </Authorized>
            &nbsp; {val.memberStatusName === '已冻结'
              ? (
                <Authorized
                  key="memberStatus_activate"
                  authority={['OPERPORT_JIAJU_USER_ACTIVATE']}
                >
                  <a onClick={() => freezeAccount(val)}>
                    激活
                  </a>
                </Authorized>
              )
              : (
                <Authorized
                  key="memberStatus_freeze"
                  authority={['OPERPORT_JIAJU_USER_FREEZE']}
                >
                  <a onClick={() => freezeAccount(val)}>
                    冻结
                  </a>
                </Authorized>
              )
}
            &nbsp;
            <Authorized
              key="member_reset_assword"
              authority={['OPERPORT_JIAJU_USER_RESETPASSWORDS']}
            >
              <a onClick={() => handleResetPassword(val)}>
                重置密码
              </a>
            </Authorized>
            &nbsp;
            <Authorized
              key="member_send_message"
              authority={['OPERPORT_JIAJU_USER_SENDMESSAGE']}
            >
              <Link target="_blank" to={`/messagepush/pushlist/add/0?platformType=1?phone=${val.mobile}`}>
                发短信
              </Link>
            </Authorized>
            &nbsp;
            <Authorized
              key="member_order_overview"
              authority={['OPERPORT_JIAJU_USER_ORDERVIEW']}
            >
              <Link target="_blank" to={`/order/list?phone=${val.mobile}`}>
                订单
              </Link>
            </Authorized>
            &nbsp;
            <Authorized
              key="member_operate_log"
              authority={['OPERPORT_JIAJU_USER_OPERATIONGLOG']}
            >
              <Link target="_blank" to={`/member/log?accountId=${val.accountId}`}>
                操作日志
              </Link>
            </Authorized>
          </div>
        ),
      },
    ],
    log: [
      {
        title: '操作时间',
        dataIndex: 'createdTime',
        render: val => <span>{moment(val).format(format)}</span>,
        // render: (val, data) => {   return (     <span>{moment(val).format(format)} ~
        //      {moment(data.createdTimeEnd).format(format)}     </span>   ); },
      }, {
        title: '操作人登录ID',
        dataIndex: 'createdBy',
      }, {
        title: '操作行为',
        dataIndex: 'subtypesName',
      }, {
        title: '会员手机号',
        dataIndex: 'extendedInfo',
      }, {
        title: '备注',
        dataIndex: 'remarks',
        render: (val, data) => {
          let result = '';
          const { beforeOperation, afterOperation, subtypesName } = data;
          if (subtypesName === '编辑会员') {
            result = `${beforeOperation}变更为${afterOperation}`;
          } else if (val === '多用户') {
            result = <Link target="_blank" to="/batchimport/import">已导入会员</Link>;
          } else {
            result = val;
          }
          return <span>{result}</span>;
        },
      },
    ],
    wallet: [
      {
        title: '序号',
        dataIndex: 'seq2',
        render: (val, data, index) => {
          const currPage = me.props
            ?.wallet
            ?.dealwallet
            ?.pagination
            ?.current;
          return <span>{((currPage - 1) * 10) + (index + 1)}</span>;
        },
      }, {
        title: '交易类型',
        dataIndex: 'ruleName',
      }, {
        title: '交易前',
        dataIndex: 'frontBalance',
        render: (val) => {
          return fenToYuan(val);
        },
      }, {

        title: '交易金额',
        dataIndex: 'dealAmount',
        render: (val) => {
          return fenToYuan(val);
        },
      }, {
        title: '交易后',
        dataIndex: 'afterBalance',
        render: (val) => {
          return fenToYuan(val);
        },
      }, {
        title: '交易原因',
        dataIndex: 'remarks',
        render: (_val, data) => {
          // console.log(data)
          let val = _val;
          const o = data.orderId;
          if (o && val) {
            // for (let [Sn, Obj] of Object.entries(o)) {

            const link = `<a href="#/order/list/detail/1/${
              data.orderId}" target='_blank'>${o}</a>`;
            // switch (data.ruleName) {   case '下单支付' || '订单取消退款':     link = `<a
            // href="#/order/detail/${       data.orderId     }" target='_blank'>${o}</a>`;
            //    val = val.replace(/订单号/g, '订单号：');     break;   case '售后退款':     link =
            // `<a href="#/order/detail/${       data.orderId     }"
            // target='_blank'>${o}</a>`;     val = val.replace(/售后申请单号/g, '售后申请单号');
            // break;   default:     break; }
            val = val.replace(o, link);
            // } if (val) {   val = val.replace(/订单号/g, '订单号'); }
            return (
              <div dangerouslySetInnerHTML={{ __html: val }} />
            );
          } else {
            return <div>{val}</div>;
          }
        },
      }, {
        title: '交易时间',
        dataIndex: 'createdTime',
        render: (val) => {
          return (
            <span>{moment(val).format(format)}</span>
          );
        },
      },
    ],
    predeposit: [
      {
        title: '序号',
        dataIndex: 'seq1',
        render: (val, data, index) => {
          const currPage = me.props
            ?.predeposit
            ?.dealpredeposit
            ?.pagination
            ?.current;
          return <span>{((currPage - 1) * 10) + (index + 1)}</span>;
        },
      }, {
        title: '交易类型',
        dataIndex: 'ruleName',
      }, {
        title: '交易前',
        dataIndex: 'frontBalance',
        render: (val) => {
          return fenToYuan(val);
        },
      }, {
        title: '交易金额',
        dataIndex: 'dealAmount',
        render: (val) => {
          return fenToYuan(val);
        },
      }, {
        title: '交易后',
        dataIndex: 'afterBalance',
        render: (val) => {
          return fenToYuan(val);
        },
      }, {
        title: '交易原因',
        dataIndex: 'remarks',
        render: (_val, data) => {
          // console.log(data)
          let val = _val;
          const o = data.orderId;
          if (o && val) {
            // for (let [Sn, Obj] of Object.entries(o)) {

            const link = `<a href="#/order/list/detail/1/${
              data.orderId}" target='_blank'>${o}</a>`;
            // switch (data.ruleName) {   case '下单支付' || '订单取消退款':     link = `<a
            // href="#/order/detail/${       data.orderId     }" target='_blank'>${o}</a>`;
            //    val = val.replace(/订单号/g, '订单号：');     break;   case '售后退款':     link =
            // `<a href="#/order/detail/${       data.orderId     }"
            // target='_blank'>${o}</a>`;     val = val.replace(/售后申请单号/g, '售后申请单号');
            // break;   default:     break; }
            val = val.replace(o, link);
            // } if (val) {   val = val.replace(/订单号/g, '订单号'); }
            return (
              <div dangerouslySetInnerHTML={{ __html: val }} />
            );
          } else {
            return <div>{val}</div>;
          }
        },
      }, {
        title: '交易时间',
        dataIndex: 'createdTime',
        render: (val) => {
          return (
            <span>{moment(val).format(format)}</span>
          );
        },
      },
    ],
    // coupon: [   {     title: '序号',     dataIndex: 'key',     render: val =>
    // <span>{moment(val).format(format)}</span>,   }, {     title: '名称',
    // dataIndex: 'loginName',   }, {     title: '使用条件',     dataIndex: 'action',
    // }, {     title: '面值',     dataIndex: 'mobile',   }, {     title: '优惠券码',
    // dataIndex: 'remark',   }, {     title: '领取渠道',     dataIndex: 'mobile',   },
    // {     title: '状态',     dataIndex: 'remark',   }, {     title: '激活时间',
    // dataIndex: 'mobile',   }, {     title: '有效期',     dataIndex: 'remark',   },
    // ],
    cart: [
      {
        title: '序号',
        dataIndex: 'seq',
        render: (val, data, index) => <span>{index + 1}</span>,
      }, {
        title: '商家名称',
        dataIndex: 'merchantName',
      }, {
        title: '商品ID',
        dataIndex: 'merchantId',
      }, {
        title: '价格(元)',
        dataIndex: 'price',
        render: (val) => {
          return fenToYuan(val);
        },
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        render: (val, data) => <Link target="_blank" to={`/goods/list/detail/${data.merchantId}`}>{val}</Link>,
      }, {
        title: '数量',
        dataIndex: 'goodsNum',
      }, {
        title: '加入时间',
        dataIndex: 'createdTime',
        render: (val) => {
          return (
            <span>{moment(val).format(format)}</span>
          );
        },
      },
    ],
    address: [
      {
        title: '姓名',
        dataIndex: 'consignee',
      }, {
        title: '手机号',
        dataIndex: 'mobile',
      }, {
        title: '省',
        dataIndex: 'provinceName',
      }, {
        title: '市',
        dataIndex: 'cityName',
      }, {
        title: '区',
        dataIndex: 'areaName',
      }, {
        title: '详细地址',
        dataIndex: 'address',
      },
    ],
  };
};
