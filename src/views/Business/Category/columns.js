import Authorized from 'utils/Authorized';
import { format } from 'components/Const';
import React from 'react';
import { Divider } from 'antd';
import moment from 'moment';

export default (me, operationFlag = true) => {
  return {
    columns: [
      {
        title: '商家分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: '300px',
      },
      {
        title: 'ID',
        dataIndex: 'categoryId',
        key: 'categoryId',
        width: '80px',
      },
      {
        title: '类目说明',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: '100px',
        render: (current) => {
          return ['启用', '禁用'][current];
        },
      },
      {
        title: '创建时间',
        width: '180px',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: current => <span>{moment(current).format(format)}</span>,
      },
      {
        title: '操作',
        width: '250px',
        key: 'operation',
        render: (text, record, index, parentRecord) => {
          return (
            <div>
              <Authorized authority={['OPERPORT_JIAJU_SHOPCATEGORY_EDIT']}>
                <a onClick={() => {
                  me.setState({
                    record,
                    parentRecord,
                    modalType: 'edit',
                    type: 2,
                  });
                  me.modalAddShow();
                }}
                >编辑
                </a>
              </Authorized>
              <Divider type="vetical" />

              {operationFlag && !parentRecord ? (
                <Authorized authority={['OPERPORT_JIAJU_SHOPCATEGORY_ADD']}>
                  <a onClick={() => {
                me.setState({ type: 2, record, modalType: 'add2' });
                me.modalAddShow();
              }}
                  >
                新增二级分类
                  </a>
                </Authorized>
            ) : ''}

              <Divider type="vetical" />

              {(!text.hasChildren && text.status === 1) ? (
                <Authorized authority={['OPERPORT_JIAJU_SHOPCATEGORY_DELETE']}>
                  <a onClick={() => {
                    me.handleDelete(record);
                  }}
                  >删除
                  </a>
                </Authorized>
              ) : ''}

            </div>
          );
        },
      },
    ],
    childrenDataSource: (record) => {
      return record?.childrenList;
    },
  };
};
