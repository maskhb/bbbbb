import React from 'react';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'posId',
      width: 100,
    },
    {
      title: '广告位名称',
      dataIndex: 'posName',
      width: 200,
    },
    {
      title: '展现形式',
      dataIndex: 'showStyle',
      width: 100,
      render: (val) => {
        return val === 1 ? '图片链接' : '';
      },
    },
    {
      title: '是否轮播',
      dataIndex: 'isScrooling',
      width: 100,
      render: (val) => {
        return val === 1 ? '是' : '否';
      },
    },
    {
      title: '说明',
      dataIndex: 'posDesc',
    },
    {
      title: '操作',
      width: 100,
      render: (text, record) => {
        return (
          <div>
            <Authorized authority={[permission.OPERPORT_JIAJU_BANNERPOSITIONLIST_EDIT]}>
              <a onClick={me.handleEdit.bind(me, record)}>编辑</a>
            </Authorized>
          </div>
        );
      },
    },
  ];
};
