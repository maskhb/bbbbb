/*
 * @Author: wuhao
 * @Date: 2018-09-20 10:49:38
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-10-11 09:20:49
 *
 * 房源管理 - 房型管理 - 操作结果表格 - 字段
 */

import React from 'react';
import classNames from 'classnames';

import Authorized from 'utils/Authorized';
import {
  PMS_ROOMRESOURCES_ROOMTYPES_EDIT,
  PMS_ROOMRESOURCES_ROOMTYPES_ENABLED,
  PMS_ROOMRESOURCES_ROOMTYPES_DELETE,
  PMS_ROOMRESOURCES_ROOMTYPES_PICTURES,
} from 'config/permission';

import { goToNewWin } from 'utils/utils';

import ModalEdit from '../ModalEdit';
import ModalDelete from '../ModalDelete';
import ModalDisable from '../ModalDisable';
import ModalEnable from '../ModalEnable';

import styles from './index.less';

export default (_this) => {
  return [
    {
      title: '编号',
      dataIndex: 'roomTypeId',
    },
    {
      title: '所属门店',
      dataIndex: 'orgName',
    },
    {
      title: '房型名称',
      dataIndex: 'roomTypeName',
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
      dataIndex: 'f_status',
    },
    {
      title: '操作',
      dataIndex: 'oper',
      render: (text, record) => {
        const { form, ...other } = _this.props;

        return (
          <div className={classNames(styles.table_oper_div)}>
            <Authorized authority={[PMS_ROOMRESOURCES_ROOMTYPES_EDIT]}>
              <ModalEdit {...other} record={record} refreshTable={_this.refreshTable} />
            </Authorized>
            {
              record?.f_showEnable ? [
                <Authorized authority={[PMS_ROOMRESOURCES_ROOMTYPES_ENABLED]} key="ModalEnable">
                  <ModalEnable {...other} record={record} refreshTable={_this.refreshTable} />
                </Authorized>,
                <Authorized authority={[PMS_ROOMRESOURCES_ROOMTYPES_DELETE]} key="ModalDelete">
                  <ModalDelete {...other} record={record} refreshTable={_this.refreshTable} />
                </Authorized>,
               ] : (
                 <Authorized authority={[PMS_ROOMRESOURCES_ROOMTYPES_ENABLED]}>
                   <ModalDisable {...other} record={record} refreshTable={_this.refreshTable} />
                 </Authorized>
              )
            }

            <Authorized authority={[PMS_ROOMRESOURCES_ROOMTYPES_PICTURES]}>
              <a onClick={() => {
                goToNewWin(`#/house/shapemanage/picmanage/${record?.roomTypeId}`);
              }}
              >图片管理
              </a>
            </Authorized>


          </div>
        );
      },
    },
  ];
};
