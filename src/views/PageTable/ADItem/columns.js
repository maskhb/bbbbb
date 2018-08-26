import React from 'react';
import _ from 'lodash';
import { Divider, Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { format } from 'components/Const';
import { handleOperate, handleRemove } from 'components/Handle';
import TextBeyond from 'components/TextBeyond';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';

const STATUS = {
  1: '启用',
  2: '禁用',
};
const STATUSLEVELS = {
  0: 'default',
  1: 'success',
  2: 'error',
};

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'adItemId',
      width: 100,
    },
    {
      title: '广告项名称',
      dataIndex: 'adName',
      width: 200,
    },
    {
      title: '广告位',
      dataIndex: 'posName',
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 100,
    },
    {
      title: '展示小区',
      dataIndex: 'communityType',
      width: 300,
      render(val, record) {
        const communities = [];
        if (record.communityVOList && _.isArray(record.communityVOList)) {
          record.communityVOList.map(((item) => {
            return communities.push(item.communityName);
          }));
        }
        const communityVal = communities.join(' , ');
        return val === 1 ? '全部小区' : (
          <TextBeyond content={communityVal || ''} maxLength="68" width="300px" />
        );
      },
    },
    {
      title: '链接',
      dataIndex: 'linkUrl',
      width: 200,
    },
    {
      title: '开启状态',
      dataIndex: 'openStatus',
      width: 100,
      render(val, record) {
        const targetVal = (val % 2) + 1;
        const confirmText = STATUS[targetVal];
        const text = (
          <Authorized
            authority={[targetVal === 1 ?
              permission.OPERPORT_JIAJU_BANNERLIST_ENABLE
              : permission.OPERPORT_JIAJU_BANNERLIST_DISABLE]}
            noMatch={STATUS[val]}
          >
            <Popconfirm placement="top" title={`确认${confirmText}？`} onConfirm={handleOperate.bind(me, { adItemId: record.adItemId, openStatus: targetVal }, 'ad', 'status', confirmText)} okText="确认" cancelText="取消">
              <a>{STATUS[(val)]}</a>
            </Popconfirm>
          </Authorized>
        );

        return <Badge status={STATUSLEVELS[val]} text={text} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 200,
      render: val => <span>{moment(val).format(format)}</span>,
    },
    {
      title: '操作',
      width: 150,
      render: (record) => {
        return (
          <div>
            <Authorized authority={[permission.OPERPORT_JIAJU_BANNERLIST_EDIT]}>
              <a href={`#/pagetable/aditem/edit/${record.adItemId}`}>编辑</a>
              <Divider type="vetical" />
            </Authorized>
            <Authorized authority={[permission.OPERPORT_JIAJU_BANNERLIST_DELETE]}>
              {record.openStatus !== 1 ? (
                <Popconfirm placement="top" title="确认删除？" onConfirm={handleRemove.bind(me, { adItemId: record.adItemId }, 'ad')} okText="确认" cancelText="取消">
                  <a>删除</a>
                </Popconfirm>
              ) : null}
            </Authorized>
          </div>
        );
      },
    },
  ];
};
