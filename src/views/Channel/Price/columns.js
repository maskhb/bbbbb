import React from 'react';
import Authorized from 'utils/Authorized';
// import { Link } from 'dva/router';
import { format } from 'components/Const';
import TextBeyond from 'components/TextBeyond';
import moment from 'moment';
// import { fenToYuan } from 'utils/money';
import styles from './view.less';

export default (me) => {
  return [
    {
      title: '编号',
      dataIndex: 'rateCodeId',
    },
    {
      title: '所属门店',
      dataIndex: 'orgName',

    },
    {
      title: '代码名称',
      dataIndex: 'rateCodeName',
    },
    {
      title: '业务来源',
      dataIndex: 'sourceName',
      render: val => <TextBeyond content={val || ''} maxLength={val ? 15 : 0} width="300px" />,
    },
    {
      title: '添加时间',
      dataIndex: 'createdTime',
      render: current => <span>{current ? moment(current).format(format) : ''}</span>,
    },
    {
      title: '优先级',
      dataIndex: 'sort',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => ['启用', '禁用'][val - 1],
    },
    {
      title: '操作',
      render: (val) => {
        const { status } = val;
        return (
          <div className={styles.columnBox}>
            <Authorized authority="PMS_CHANNEL_PRICECODE_EDIT" >
              <a onClick={() => me.handleJumpEdit(val)}>编辑</a>
            </Authorized >
            {status === 1 ? (
              <Authorized authority="PMS_CHANNEL_PRICECODE_ENABLED" >
                <a onClick={() => me.handleOperation(val, 3)}>禁用</a>
              </Authorized >

            ) : (
              <div style={{ display: 'inline' }}>
                <Authorized authority="PMS_CHANNEL_PRICECODE_ENABLED" >
                  <a onClick={() => me.handleOperation(val, 2)}>启用</a>
                </Authorized >

                <Authorized authority="PMS_CHANNEL_PRICECODE_DELETE" >
                  <a onClick={() => me.handleOperation(val, 4)}>删除</a>
                </Authorized >

              </div>
            )}
          </div>
        );
      },
    },
  ];
};
