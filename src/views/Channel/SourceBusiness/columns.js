import { format } from 'components/Const';
import React from 'react';
import { orgType } from 'utils/getParams';
import Authorized from 'utils/Authorized';
import moment from 'moment';
import styles from './view.less';
import EditModal from './modal';
import TextBeyond from 'components/TextBeyond';

export default (me) => {
  let diff = [];
  if (orgType() === 1) {
    diff = [
      {
        title: '状态',
        dataIndex: 'status',
        render: val => ['启用', '禁用'][val - 1],
      },
    ];
  }
  return [
    {
      title: 'ID',
      dataIndex: 'sourceId',
    },
    {
      title: '业务来源',
      dataIndex: 'sourceName',
    },
    {
      title: '关联的上级渠道',
      dataIndex: 'channelName',
    },
    {
      title: '关联的价格代码',
      dataIndex: 'rateCodeName',
      render: val => <TextBeyond content={val || ''} maxLength={val ? 15 : 0} width="300px" />,
    },
    {
      title: '业绩归属部门',
      dataIndex: 'depName',
    },
    {
      title: '添加时间',
      dataIndex: 'createdTime',
      render: current => (
        <span>{current ? moment(current).format(format) : ''}</span>
      ),
    },
    ...diff,
    {
      title: '操作',
      render: data => (
        <div className={styles.operationBox}>
          {orgType() === 1 ? (
            <Authorized
              authority={[
                    'PMS_CHANNEL_BUSINESSSOURCES_ENABLED',
                    'PMS_CHANNEL_BUSINESSSOURCES_DISABLE',
                  ]}
            >
              <a onClick={() => me.handleChangeStatue(data)}>
                {' '}
                {data.status === 1 ? '禁用' : '启用'}{' '}
              </a>
            </Authorized>
) : ''}

          <Authorized authority={['PMS_CHANNEL_BUSINESSSOURCES_DELETE']} >
            <a onClick={() => me.handleDeleteItem(data)}>删除</a>
          </Authorized >

          <Authorized authority={['PMS_CHANNEL_BUSINESSSOURCES_EDIT']} >
            <EditModal sourseData={data} />
          </Authorized >

        </div>
      ),
    },
  ];
};
