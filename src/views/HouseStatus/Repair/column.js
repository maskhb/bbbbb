
import React from 'react';
import { Tooltip } from 'antd';
import { repairTypeOptions, repairAreaTypeOptions, repairStatusOptions } from 'utils/attr/repair';
import moment from 'moment';
import Authorized from 'utils/Authorized';
import { format } from 'components/Const';

import styles from './../view.less';


export default (me) => {
  return [
    {
      title: '编号',
      dataIndex: 'repairId',
    },
    {
      title: '所属门店',
      dataIndex: 'storesName',
    },
    {
      title: '报修人',
      dataIndex: 'createdName',
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (val) => {
        let str = '';
        repairTypeOptions.map((v) => {
          if (val === v.value) {
            str = v.label;
          }
          return '';
        });
        return str;
      },
    },
    {
      title: '维修地点',
      dataIndex: 'address',
      render: (val, row) => {
        let str = '';
        repairAreaTypeOptions.map((v) => {
          if (row.addressType === v.value) {
            str = v.label;
          }
          return '';
        });
        return `${str}-${val}`;
      },
    },
    {
      title: '维修内容',
      dataIndex: 'content',
      render: (val) => {
        let str = val;
        if (str.length > 10) {
          str = (
            <Tooltip title={val}>
              {`${str.slice(0, 10)}...`}
            </Tooltip>
          );
        }
        return str;
      },
    },
    {
      title: '报修时间',
      dataIndex: 'createdTime',
      render: current => <span>{moment(current).format(format)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (val) => {
        let str = '';
        repairStatusOptions.map((v) => {
          if (val === v.value) {
            str = v.label;
          }
          return '';
        });
        return str;
      },
    },
    {
      title: '操作',
      dataIndex: 'options',
      render: (val, row) => {
        if (row.status === 1) {
          return (
            <Authorized authority="PMS_ROOMSTATUS_MAINTENANCEBILL_REVISEMAINTENANCE">
              <div className={styles.toolbar}>
                <a onClick={() => me.editRepair(row.repairId)}>修改维修</a>
                <a onClick={() => me.cancelRepair(row.repairId)}>取消维修</a>
                <a onClick={() => me.complateRepair(row.repairId)}>完成维修</a>
              </div>
            </Authorized>
          );
        }
      },
    },
  ];
};
