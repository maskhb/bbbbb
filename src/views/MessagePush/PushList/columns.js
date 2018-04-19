import React from 'react';
import { Popconfirm } from 'antd';
import moment from 'moment';
import { format } from '../../../components/Const';
import messagePushOptions from '../attr';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '操作账号',
      dataIndex: 'model',
    },
    {
      title: '目标用户',
      dataIndex: 'name',
      render: val => messagePushOptions.getLabelByValue('MBYH', val),
    },
    {
      title: '用户说明',
      dataIndex: 'categoryNameLv1',
    },
    {
      title: '推送进度',
      dataIndex: 'categoryNameLv2',
      render: val => messagePushOptions.getLabelByValue('TSJD', val),
    },
    {
      title: '内部推送成败',
      dataIndex: 'onlineStatus',
    },
    {
      title: '推送开始时间',
      dataIndex: 'createdTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '优先级',
      dataIndex: 'first',
      render: val => messagePushOptions.getLabelByValue('YXJ', val),
    },
    {
      title: '推送数',
      dataIndex: 'count',
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Popconfirm
              placement="top"
              title={
                <div>
                  <p style={{ marginBottom: '0.5em' }}>确认重发？</p>
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>是否按原定的内容和用户，立即发送？</span>
                  <br />
                  <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>（此操作会忽略原有定时机制）</span>
                </div>
            }
              onConfirm={me.popConfirmRePush.bind(me, [val])}
              okText="确认"
              cancelText="取消"
            >
              <a>全部重发</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
};
