import React from 'react';
import { Popconfirm } from 'antd';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import { format } from '../../../components/Const';
import messagePushOptions from '../attr';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'task.taskId',
    },
    {
      title: '操作账号',
      dataIndex: 'task.creatorName',
    },
    {
      title: '目标用户',
      dataIndex: 'task.targetType',
      render: (val, rows) => {
        if (val === 5) {
          return <a target="_blank" href={JSON.parse(rows.task?.targetCondition)?.phoneFileUrl}>指定手机列表</a>;
        } else {
          return messagePushOptions.getLabelByValue('MBYH', val);
        }
      },
    },
    {
      title: '用户说明',
      dataIndex: 'task.userDesc',
    },
    {
      title: '推送进度',
      dataIndex: 'task.status',
      render: val => messagePushOptions.getLabelByValue('TSJD', val),
    },
    {
      title: '推送开始时间',
      dataIndex: 'task.executeTime',
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '优先级',
      dataIndex: 'task.priority',
      render: val => messagePushOptions.getLabelByValue('YXJ', val),
    },
    {
      title: '推送数',
      dataIndex: 'task.targetAmount',
    },
    {
      title: '操作',
      render: (val) => {
        return (
          <div>
            <Authorized authority={['OPERPORT_JIAJU_SMSPUSH_ALLRETRY']}>
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
            </Authorized>
          </div>
        );
      },
    },
  ];
};
