/*
 * @Author: wuhao
 * @Date: 2018-09-20 10:49:38
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-09-27 11:01:27
 *
 * 基础设置 - 收款方式设置 - 操作结果表格 - 字段
 */

import React from 'react';

import Authorized from 'utils/Authorized';
import {
  PMS_BASICSETTING_WAYSOFCHARGING_EDIT,
} from 'config/permission';

import ModalEdit from '../ModalEdit';

export default (_this) => {
  return [
    {
      title: '所属门店',
      dataIndex: 'orgName',
    },
    {
      title: '收款方式',
      dataIndex: 'paymentMethodName',
    },
    {
      title: '自定义名称',
      dataIndex: 'paymentMethodOtherName',
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
          <div>
            <Authorized authority={[PMS_BASICSETTING_WAYSOFCHARGING_EDIT]}>
              <ModalEdit {...other} record={record} refreshTable={_this.refreshTable} />
            </Authorized>
          </div>
        );
      },
    },
  ];
};
