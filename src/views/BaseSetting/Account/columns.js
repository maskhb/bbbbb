import React from 'react';
import { format } from 'components/Const';
import TextBeyond from 'components/TextBeyond';
import moment from 'moment';
import { Button } from 'antd';
import Authorized from 'utils/Authorized';

export const getColumns = (self) => {
  return [
    {
      title: '登录账号',
      dataIndex: 'loginName',
    },
    {
      title: '使用人姓名',
      dataIndex: 'userName',
    },
    {
      title: '使用人手机号',
      dataIndex: 'mobile',
    },
    {
      title: '账号关联组织',
      dataIndex: 'orgName',
      width: 300,
      render: (_, record) => (
        <TextBeyond content={record.orgVOs?.map(l => l.orgName)?.join(', ') || ''} maxLength={50} width="300px" />
      ),
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      render: val => (val === 1 ? '启用' : '禁用'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: current => <span>{current ? moment(current).format(format) : ''}</span>,
    },
    {
      title: '操作',
      render(current) {
        return (
          <div>
            <Authorized authority="PMS_BASICSETTING_ACCOUNT_SETUP">
              <Button size="small" onClick={() => self.handleSetRole(current)} style={{ marginRight: 10 }}>角色设置</Button>
            </Authorized>
            <Authorized authority="PMS_BASICSETTING_ACCOUNT_EDIT">
              <Button size="small" onClick={() => self.handleEditItem(current)} style={{ marginRight: 10 }}>编辑信息</Button>
            </Authorized>
            <Authorized authority={current.status === 1 ? 'PMS_BASICSETTING_ACCOUNT_DISABLE' : 'PMS_BASICSETTING_ACCOUNT_ENABLED'}>
              <Button size="small" onClick={() => self.handleToggleStatus(current, current.status === 1 ? 2 : 1)} style={{ marginRight: 10 }}>
                {current.status === 1 ? '禁用' : '启用'}
              </Button>
            </Authorized>
            <Authorized authority="PMS_BASICSETTING_ACCOUNT_DELETE">
              { current.status !== 1 &&
              <Button size="small" onClick={() => self.handleRemove(current)}>删除</Button>
            }
            </Authorized>
          </div>
        );
      },
    },
  ];
};
