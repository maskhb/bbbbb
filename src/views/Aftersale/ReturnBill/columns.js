/*
 * @Author: wuhao
 * @Date: 2018-06-13 11:20:15
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-10 14:42:40
 *
 * 退货单列表 列格式
 */

import React from 'react';
import { Button } from 'antd';
import Authorized from 'utils/Authorized';

import ModalSignInReturnGoods from './components/ModalSignInReturnGoods';

export default (_this) => {
  return [
    {
      title: '订单编号',
      width: '120px',
      dataIndex: 'orderSn',
    },
    {
      title: '退货单号',
      width: '120px',
      dataIndex: 'returnSn',
    },
    {
      title: '所属商家',
      dataIndex: 'merchantName',
    },
    {
      title: '所属厂家',
      width: '180px',
      dataIndex: 'factoryName',
    },
    {
      title: '退款金额',
      width: '120px',
      dataIndex: 'refundAmountFormat',
    },
    {
      title: '服务类型',
      width: '120px',
      dataIndex: 'serviceTypeFormat',
    },
    {
      title: '申请单申请时间',
      width: '150px',
      dataIndex: 'createdTimeFormat',
    },
    {
      title: '申请单创建人',
      width: '130px',
      dataIndex: 'createdByNick',
    },
    {
      title: '是否有实物退货',
      width: '150px',
      dataIndex: 'isHasEntityFormat',
    },
    {
      title: '入库状态',
      width: '100px',
      dataIndex: 'returnStatusFormat',
    },
    {
      title: '操作',
      dataIndex: 'oper',
      width: '120px',
      render: (text, record) => {
        return (
          <div className="view_aftersale_returnbill_list_column_oper">
            <Authorized authority={['OPERPORT_JIAJU_RETURNSLIST_DETAILS']}>
              <Button onClick={() => {
                window.open(record.returnGoodsDetailsSkipPath, '_blank');
              }}
              >
                查看详情
              </Button>
            </Authorized>

            {
              record?.isReturnReceiptOper ? (
                <Authorized authority={['OPERPORT_JIAJU_RETURNSLIST_SIGNIN']}>
                  <ModalSignInReturnGoods
                    {..._this.props}
                    refresh={_this.refreshTable}
                    params={record}
                  />
                </Authorized>
              ) : null
            }

          </div>
        );
      },
    },
  ];
};
