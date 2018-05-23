import React from 'react';
import { Modal } from 'antd';
import Authorized from 'utils/Authorized';
import spaceOptions from './attr';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'spaceId',
      width: 80,
    },
    {
      title: '空间名称',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '别名',
      dataIndex: 'aliasName',
      width: 200,
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 150,
      render: val => spaceOptions.getLabelByValue('ZT', val),
    },
    {
      title: '已关联分类',
      dataIndex: 'categorys',
      width: 500,
    },
    {
      title: '操作',
      align: 'center',
      render: (val) => {
        const editBtn = (val.isDelete === 0) ? (
          <Authorized authority={['OPERPORT_JIAJU_SPACELIST_EDIT']}>
            <a
              onClick={me.modalAddShow.bind(me, val, 2)}
              style={{ marginRight: 10 }}
            >编辑
            </a>
          </Authorized>
        ) : '';
        const openBtn = (val.isDelete === 0 && val.status !== 1) ? (
          <Authorized authority={['OPERPORT_JIAJU_SPACELIST_ENABLE']}>
            <a
              onClick={() => {
                Modal.confirm({
                  title: '是否确认启用该空间？',
                  okText: '确定',
                  cancelText: '取消',
                  onOk() {
                    me.openFn(val.spaceId);
                  },
                });
              }}
              style={{ marginRight: 10 }}
            >启用
            </a>
          </Authorized>
        ) : '';
        const closeBtn = (val.isDelete === 0 && val.status === 1) ? (
          <Authorized authority={['OPERPORT_JIAJU_SPACELIST_DISABLE']}>
            <a
              onClick={() => {
                Modal.confirm({
                  title: '是否确认禁用该空间？',
                  okText: '确定',
                  cancelText: '取消',
                  onOk() {
                    me.closeFn(val.spaceId);
                  },
                });
              }}
              style={{ marginRight: 10 }}
            >禁用
            </a>
          </Authorized>
        ) : '';
        const deleteBtn = (val.isDelete === 0 && val.status === 0) ? (
          <Authorized authority={['OPERPORT_JIAJU_SPACELIST_DELETE']}>
            <a
              style={{ marginRight: 10 }}
              onClick={() => {
                Modal.confirm({
                  title: '是否确认删除该空间？',
                  okText: '确定',
                  okType: 'danger',
                  cancelText: '取消',
                  onOk() {
                    me.removeFn(val.spaceId);
                  },
                });
              }}
            >删除
            </a>
          </Authorized>
        ) : '';
        const connectBtn = (val.isDelete === 0) ? (
          <Authorized authority={['OPERPORT_JIAJU_SPACELIST_SETCATEGORY']}>
            <a
              style={{ marginRight: 10 }}
              onClick={me.modalConnectShow.bind(me, val)}
            >关联分类
            </a>
          </Authorized>
        ) : '';
        return (
          <div>
            { editBtn }
            { openBtn }
            { closeBtn }
            { deleteBtn }
            { connectBtn }
          </div>
        );
      },
    },
  ];
};
