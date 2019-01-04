import React from 'react';
import { Button } from 'antd';
import TextBeyond from 'components/TextBeyond';
import Authorized from 'utils/Authorized';

export const getColumns = (self) => {
  return [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '关联角色组',
      data: 'roleGroupsRelated',
      render: (_, record) => <TextBeyond content={record.roleGroupsRelated?.map(v => v.roleGroupName).join(', ') || ''} maxLength={40} width="200px" />,
    },
    {
      title: '操作',
      render(current) {
        return (
          <div>
            <Authorized authority="PMS_BASICSETTING_CHARACTER_CHECK">
              <Button size="small" onClick={() => self.handleShowRole(current, 'show')} style={{ marginRight: 10 }}>查看权限</Button>
            </Authorized>
            <Authorized authority="PMS_BASICSETTING_CHARACTER_EDIT">
              <Button size="small" onClick={() => self.handleEditItem(current)} style={{ marginRight: 10 }}>编辑信息</Button>
            </Authorized>
            <Authorized authority="PMS_BASICSETTING_CHARACTER_SETUP">
              <Button size="small" onClick={() => self.handleShowRole(current, 'edit')} style={{ marginRight: 10 }}>设置权限</Button>
            </Authorized>
            <Authorized authority="PMS_BASICSETTING_CHARACTER_DELETE">
              <Button size="small" onClick={() => self.handleRemove(current, 'delete')}>删除</Button>
            </Authorized>
          </div>
        );
      },
    },
  ];
};
