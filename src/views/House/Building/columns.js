import React from 'react';
import { Popconfirm } from 'antd';
import Authorized from 'utils/Authorized';
import * as permission from 'config/permission';
import { handleOperate, handleRemove } from 'components/Handle';
import styles from './view.less';

export default (me) => {
  return [
    {
      title: '编号',
      dataIndex: 'buildingId',
    },
    {
      title: '所属门店',
      dataIndex: 'orgName',

    },
    {
      title: '楼栋名',
      dataIndex: 'buildingName',
    },
    {
      title: '建筑类型',
      dataIndex: 'buildingTypeName',
    },
    {
      title: '房间数',
      dataIndex: 'roomQty',
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
        const { status, buildingId } = val;
        const targetStatus = status === 1 ? 2 : 1;
        return (
          <div className={styles.columnBox}>
            <Authorized authority={[permission.PMS_ROOMRESOURCES_BUILDINGS_EDIT]} >
              <a onClick={() => me.handleEdit(val)}>编辑</a>
            </Authorized >
            {status === 1 ? (
              <Authorized authority={[permission.PMS_ROOMRESOURCES_BUILDINGS_ENABLED]} >
                <Popconfirm placement="top" title="确定要禁用该楼栋？" onConfirm={handleOperate.bind(me, { buildingId, status: targetStatus }, 'building', 'status', '禁用')} okText="确定" cancelText="取消">
                  <a>禁用</a>
                </Popconfirm>
              </Authorized >

            ) : (
              <div style={{ display: 'inline' }}>
                <Authorized authority={[permission.PMS_ROOMRESOURCES_BUILDINGS_ENABLED]} >
                  <Popconfirm placement="top" title="确定要启用该楼栋？" onConfirm={handleOperate.bind(me, { buildingId, status: targetStatus }, 'building', 'status', '启用')} okText="确定" cancelText="取消">
                    <a>启用</a>
                  </Popconfirm>
                </Authorized >

                <Authorized authority={[permission.PMS_ROOMRESOURCES_BUILDINGS_DELETE]} >
                  <Popconfirm placement="top" title="确定要删除该楼栋？" onConfirm={handleRemove.bind(me, { buildingId }, 'building')} okText="确定" cancelText="取消">
                    <a>删除</a>
                  </Popconfirm>
                </Authorized >

              </div>
            )}
          </div>
        );
      },
    },
  ];
};
