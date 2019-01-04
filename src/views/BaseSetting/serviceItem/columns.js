import React, { Fragment } from 'react';

import Authorized from 'utils/Authorized';
import { div } from 'utils/number';

import { ModalStatus, ModalDelete, ModalUpdateService, ModalUpdateStock } from './components';

export const getColumns = (_this) => {
  return [
    {
      title: '编号',
      dataIndex: 'serviceItemId',
      key: 'serviceItemId',
      width: 80,
    },
    {
      title: '所属门店',
      dataIndex: 'orgName',
      key: 'orgName',
      width: 150,
    },
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      width: 150,
    },
    {
      title: '添加来源',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      render: text => (text === 1 ? '酒店自建' : '纷程平台'),
    },
    {
      title: '关联账务',
      dataIndex: 'paymentItemName',
      key: 'paymentItemName',
      width: 100,
    },
    {
      title: '对客价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      width: 100,
      render: (text, record) => {
        const { source } = record;

        if (source === 2) {
          return '';
        }

        const textFilter = div(text, 100);

        return textFilter;
      },
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
    },
    {
      title: '优先级',
      dataIndex: 'sort',
      key: 'sort',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: text => (text === 1 ? '启用' : '禁用'),
    },
    {
      title: '操作',
      dataIndex: 'oprt',
      key: 'oprt',
      width: 300,
      render: (_, record) => {
        const { source, status } = record;

        return (
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Authorized authority="PMS_BASICSETTING_SERVICEITEM_EDIT" key="ModalUpdateService">
              <ModalUpdateService {..._this.props} record={record} />
            </Authorized>
            { source === 1 ? (
              <Fragment>
                <Authorized authority="PMS_BASICSETTING_SERVICEITEM_INVENTORY" key="ModalUpdateStock">
                  <ModalUpdateStock {..._this.props} record={record} />
                </Authorized>
                <Authorized authority="PMS_BASICSETTING_SERVICEITEM_ENABLED" key="ModalStatus">
                  <ModalStatus {..._this.props} record={record} />
                </Authorized>
                { status === 2 && (
                  <Authorized authority="PMS_BASICSETTING_SERVICEITEM_DELETE" key="ModalDelete">
                    <ModalDelete {..._this.props} record={record} />
                  </Authorized>
                ) }
              </Fragment>
            ) : null }
          </div>
        );
      },
    },
  ];
};
