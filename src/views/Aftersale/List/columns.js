import React from 'react';

import { Button } from 'antd';
import { Link } from 'dva/router';

import Authorized from 'utils/Authorized';

import { APPLY_PENDING_STATUS, afterSaleTypeOptions } from '../attr';

const getAfterSaleKey = (row) => {
  for (const k of afterSaleTypeOptions) {
    if (k.value === row.afterSaleType) {
      return k.key;
    }
  }
  return 'detail';
};

export default () => {
  return {
    columns: [
      {
        title: '售后申请单号',
        dataIndex: 'applyOrderSn',
      },
      {
        title: '母订单编号',
        dataIndex: 'parentOrderSn',
      },
      {
        title: '子订单编号',
        dataIndex: 'orderSn',
      },
      {
        title: '所属商家',
        dataIndex: 'merchantName',
      },
      {
        title: '所属厂家',
        dataIndex: 'factoryName',
      },
      {
        title: '退款意向金额',
        dataIndex: 'intentRefundAmount',
        render(val) {
          if (val) {
            return val / 100;
          }
        },
      },
      {
        title: '申请服务类型',
        dataIndex: 'serviceTypeFormat',
      },
      {
        title: '申请时间',
        dataIndex: 'createdTimeFormat',
      },
      {
        title: '创建人',
        dataIndex: 'createdByNick',
      },
      {
        title: '售后状态',
        dataIndex: 'afterSaleStatusFormat',
      },
      {
        title: '关闭状态',
        dataIndex: 'shutDownStatusFormat',
      },
      {
        title: '操作',
        render(row) {
          // console.log('action', row);
          return (
            <div className="aftersale-opeator">
              { APPLY_PENDING_STATUS !== row.afterSaleStatus ? (
                <Authorized authority={['OPERPORT_JIAJU_AFTERSERVICELIST_DETAILS']}>
                  <Button size="small" style={{ marginRight: 4, marginBottom: 4 }}>
                    <Link target="_blank" to={`/aftersale/list/${getAfterSaleKey(row)}/detail/${row.applyOrderSn}`}>详情</Link>
                  </Button>
                </Authorized>
                ) : [
                  <Authorized authority={['OPERPORT_JIAJU_AFTERSERVICELIST_CHECK']}>
                    <Button size="small" style={{ marginRight: 4, marginBottom: 4 }}>
                      <Link target="_blank" to={`/aftersale/list/${getAfterSaleKey(row)}/approve/${row.applyOrderSn}`}>审核</Link>
                    </Button>
                  </Authorized>,
                  <Authorized authority={['OPERPORT_JIAJU_AFTERSERVICELIST_EDIT']}>
                    <Button size="small" style={{ marginRight: 4, marginBottom: 4 }}>
                      <Link target="_blank" to={`/aftersale/list/${getAfterSaleKey(row)}/edit/${row.applyOrderSn}`}>编辑</Link>
                    </Button>
                  </Authorized>,
                ]}
            </div>
          );
        },
      },
    ],
  };
};
