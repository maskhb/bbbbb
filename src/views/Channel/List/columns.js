import { format } from 'components/Const';
import React from 'react';
import { orgType } from 'utils/getParams';
import Authorized from 'utils/Authorized';
import moment from 'moment';
import TextBeyond from 'components/TextBeyond';
import EditModal from './modal';
import styles from './view.less';

export default (me) => {
  let diff = [];
  if (orgType() === 1) {
    // 项目级别就有
    diff = [{
      title: '状态',
      dataIndex: 'status',
      render: val => ['启用', '禁用'][val - 1],
    },
    ];
  }


  return [
    {
      title: 'ID',
      dataIndex: 'channelId',
    },
    {
      title: '渠道名称',
      dataIndex: 'channelName',
    },
    {
      title: '关联的业务来源',
      dataIndex: 'sourceName',
      render: val => <TextBeyond content={val || ''} maxLength={val ? 15 : 0} width="300px" />,
    },
    {
      title: '添加时间',
      dataIndex: 'createdTime',
      render: current => <span>{current ? moment(current).format(format) : ''}</span>,
    },
    ...diff,
    {
      title: '操作',
      render: data => (

        <div className={styles.operationBox}>
          {orgType() === 1 ? (
            <Authorized authority={['PMS_CHANNEL_CHANNELLIST_ENABLED', 'PMS_CHANNEL_CHANNELLIST_DISABLE']} >
              <a onClick={() => me.handleChangeStatue(data)}> {data.status === 1 ? '禁用' : '启用'} </a>
            </Authorized >
) : ''}

          <Authorized authority={['PMS_CHANNEL_CHANNELLIST_EDIT']} >
            <EditModal sourseData={data} />
          </Authorized >

          <Authorized authority={['PMS_CHANNEL_CHANNELLIST_DELETE']} >
            <a onClick={() => me.handleDeleteItem(data)}>删除</a>
          </Authorized >

        </div>
      ),
    },
  ];
};
