import React from 'react';
import moment from 'moment';
import { Checkbox } from 'antd';
import TextBeyond from 'components/TextBeyond';
import { fenToYuan } from 'utils/money';
import Authorized from 'utils/Authorized';
import styles from './view.less';
import EditModal from './editModal';

export default (me, searchDefault, key = 0) => {
  if (key === 0) {
    return [
      {
        title: '服务项名称',
        dataIndex: 'serviceName',
        key: 'serviceName',
      },
      {
        title: '关联预订单号',
        dataIndex: 'gresNo',
        key: 'gresNo',
      },
      {
        title: '待分配数量',
        dataIndex: 'remainQty',
        key: 'remainQty',
      },
      {
        title: '可分配数量',
        dataIndex: 'totalQty',
        key: 'totalQty',
      },
      {
        title: '已分配数量',
        dataIndex: 'useQty',
        key: 'useQty',
      },
      {
        title: '对客单价',
        dataIndex: 'salePrice',
        key: 'salePrice',
        render: val => fenToYuan(val || 0),
      },
      {
        title: '收费类目',
        dataIndex: 'paymentItemName',
        key: 'paymentItemName',
      },
      {
        title: '创建人',
        dataIndex: 'createdName',
        key: 'createdName',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        render: current => (
          <span>
            {current ? moment(current).format('YYYY-MM-DD HH:mm:ss') : ''}
          </span>
        ),
      },
      {
        title: '操作',
        render: (data) => {
          return (
            <div className={styles.mgr10}>
              <Authorized authority={['PMS_CHECKIN_SERVICETICKET_DISTRIBUTE']} >
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`#/checkin/orderform/edit/${data.gresId}`}
                >
                  {' '}
                分配
                </a>
              </Authorized >
              <Authorized authority="1" />

              <Authorized authority={['PMS_CHECKIN_SERVICETICKET_DELETE']} >
                <a onClick={() => me.handleDelete(data, 1)}> 删除</a>
              </Authorized >
              <Authorized authority="1" />
            </div>
          );
        },
      },
    ];
  }
  return [
    {
      title: '服务项名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
    },
    {
      title: '房间',
      dataIndex: 'roomName',
      key: 'roomName',
    },
    {
      title: '关联入住单号',
      dataIndex: 'gresNo',
      key: 'gresNo',
    },
    {
      title: '数量',
      dataIndex: 'useQty',
      key: 'useQty',
    },
    {
      title: '对客单价',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: val => fenToYuan(val || 0),
    },
    {
      title: '服务营业日期',
      dataIndex: 'businessDay',
      key: 'businessDay',
      // sortField: 'businessDay',
      render: current => (
        <span>{current ? moment(current).format('YYYY-MM-DD') : ''}</span>
      ),
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      sorter: true,
      // sortField: 'date',
      render: current => (
        <span>
          {current ? moment(current).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
      ),
    },
    {
      title: '收费类目',
      dataIndex: 'paymentItemName',
      key: 'paymentItemName',
    },
    {
      title: '创建人',
      dataIndex: 'createdName',
      key: 'createdName',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      editable: true,
      render: (val, data) => (
        <EditModal
          sourseData={data}
          callBack={() => me.initRight()}
        />
      ),
    },
    {
      title: '完成状态',
      dataIndex: 'isCompleted',
      key: 'isCompleted',
      render: (val, data) => (
        <Checkbox
          checked={Number(val) === 1}
          onClick={() => me.handleChangeCheckbox(val, data)}
        />
      ),
    },

    {
      title: '操作',
      render: (data) => {
        return (
          <div className={styles.mgr10}>
            <a onClick={() => me.handleDelete(data)}> 删除</a>
            <Authorized authority="1" />
          </div>
        );
      },
    },
  ];
};
