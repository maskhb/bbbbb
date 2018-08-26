/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:20:15
 * @Last Modified by: jone
 * @Last Modified time: 2018-7-8
 *
 * 换货单列表 列格式
 */

import React from 'react';
import { Button } from 'antd';
import Authorized from 'utils/Authorized';

export default () => {
  return [
    {
      title: '售后单申请单号',
      dataIndex: 'applyOrderSn',
    },
    {
      title: '订单编号',
      dataIndex: 'orderSn',
    },
    {
      title: '退货单号',
      dataIndex: 'returnSn',
    },
    {
      title: '换货母单号',
      dataIndex: 'exchangeParentOrderSn',
    },
    {
      title: '换货子单号',
      dataIndex: 'exchangeOrderSn',
    },
    {
      title: '原订单所属商家',
      dataIndex: 'merchantName',
    },
    {
      title: '原订单所属厂家',
      dataIndex: 'factoryName',
    },
    {
      title: '申请单申请时间',
      dataIndex: 'createdTimeFormat',
    },
    {
      title: '申请单创建人',
      dataIndex: 'createdByNick',
    },
    {
      title: '入库状态',
      dataIndex: 'returnStatusFormat',
    },
    {
      title: '操作',
      dataIndex: 'oper',
      width: '120px',
      render: (text, record) => {
        return (
          <div className="view_aftersale_returnbill_list_column_oper">
            <Authorized authority={['OPERPORT_JIAJU_EXCHANGELIST_DETAILS']}>
              <Button onClick={() => {
                window.open(record.exchangeBillDetailsSkipPath, '_blank');
              }}
              >
                查看详情
              </Button>
            </Authorized>

            {
              (record?.returnStatus && !record?.exchangeParentOrderSn) ? (
                <Authorized authority={['OPERPORT_JIAJU_EXCHANGELIST_ADDNEW']}>
                  <Button onClick={() => {
                    window.open(`#/aftersale/exchangebill/new/${record.applyOrderSn}/${record.accountId}`, '_blank');
                  }}
                  >
                    新增换货订单
                  </Button>
                </Authorized>
              ) : null
            }

          </div>
        );
      },
    },
  ];
};
