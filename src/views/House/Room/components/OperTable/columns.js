/*
 *
 * 房型管理 - 房型管理 - 操作结果表格 - 字段
 */

import React from 'react';
import classNames from 'classnames';

import Authorized from 'utils/Authorized';
import {
  PMS_ROOMRESOURCES_ROOMMANAGEMENT_EDIT,
  PMS_ROOMRESOURCES_ROOMMANAGEMENT_ENABLED,
} from 'config/permission';

import { Link } from 'dva/router';
import { Popover } from 'antd';
import ModalDisable from '../ModalDisable';
import ModalEnable from '../ModalEnable';

import styles from './index.less';

export default (_this) => {
  return [
    {
      title: '编号',
      dataIndex: 'roomId',
    },
    {
      title: '所属门店',
      dataIndex: 'orgName',
    },
    {
      title: '房间号',
      dataIndex: 'roomNo',
    },
    {
      title: '房型',
      dataIndex: 'roomTypeName',
    },
    {
      title: '所在楼栋',
      dataIndex: 'buildingName',
    },
    {
      title: '所在楼层',
      dataIndex: 'floorName',
    },
    {
      title: '标签',
      dataIndex: 'roomTags',
      width: 120,
      render: (val) => {
        const tag = (val || []).map((t) => { return t.tagName; });
        const tag2 = tag.splice(0, 2);
        const tagSpaces = val.length > 2 ? '...' : null;
        return (
          val.length < 3 ? <span>{tag2.join(',')}</span> : (
            <Popover
              placement="bottom"
              content={[...tag2, ...tag].join(',')}
            >
              <span>
                {tag2.join(',')}
                {tagSpaces}
              </span>
            </Popover>
          )
        );
      },
    },
    {
      title: '分机号',
      dataIndex: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'f_status',
    },
    {
      title: '操作',
      dataIndex: 'oper',
      render: (text, record) => {
        const { form, ...other } = _this.props;

        return (
          <div className={classNames(styles.table_oper_div)}>
            <Authorized authority={[PMS_ROOMRESOURCES_ROOMMANAGEMENT_EDIT]}>
              <Link to={`/house/room/edit/${record.roomId}`}>
              编辑
              </Link>
            </Authorized>
            {
              record?.f_showEnable ? [
                <Authorized authority={[PMS_ROOMRESOURCES_ROOMMANAGEMENT_ENABLED]} key="ModalEnable">
                  <ModalEnable {...other} record={record} refreshTable={_this.refreshTable} />
                </Authorized>,
               ] : (
                 <Authorized authority={[PMS_ROOMRESOURCES_ROOMMANAGEMENT_ENABLED]}>
                   <ModalDisable {...other} record={record} refreshTable={_this.refreshTable} />
                 </Authorized>
              )
            }
          </div>
        );
      },
    },
  ];
};
