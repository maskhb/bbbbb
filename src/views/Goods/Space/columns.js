import React from 'react';
import { Modal } from 'antd';
import spaceOptions from './attr';

export default (me) => {
  return [
    {
      title: 'ID',
      dataIndex: 'spaceId',
    },
    {
      title: '空间名称',
      dataIndex: 'name',
    },
    {
      title: '别名',
      dataIndex: 'aliasName',
    },
    {
      title: '排序',
      dataIndex: 'orderNum',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: val => spaceOptions.getLabelByValue('ZT', val),
    },
    {
      title: '已关联分类',
      dataIndex: 'categorys',
    },
    {
      title: '操作',
      render: (val) => {
        const editBtn = (
          <a
            onClick={me.modalAddShow.bind(me, val, 2)}
            style={{ marginRight: 10 }}
          >编辑
          </a>
        );
        const openBtn = (
          <a
            onClick={me.openFn.bind(me, val.spaceId)}
            style={{ marginRight: 10 }}
          >启用
          </a>
        );
        const closeBtn = (
          <a
            onClick={() => {
              Modal.confirm({
                title: '是否确认禁用该空间？',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                  me.closeFn.bind(me, val.spaceId);
                },
              });
            }}
            style={{ marginRight: 10 }}
          >禁用
          </a>
        );
        const deleteBtn = (
          <a
            style={{ marginRight: 10 }}
            onClick={() => {
              Modal.confirm({
                title: '是否确认删除该空间？',
                okText: '确定',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                  me.removeFn.bind(me, val.spaceId);
                },
              });
            }}
          >删除
          </a>
        );
        const connectBtn = (
          <a
            style={{ marginRight: 10 }}
            onClick={me.modalConnectShow.bind(me, val)}
          >关联分类
          </a>
        );
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
