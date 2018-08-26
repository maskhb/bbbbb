/*
 * @Author: wuhao
 * @Date: 2018-04-20 16:16:47
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-11 16:22:03
 *
 * 费用信息 --  订单支付
 */

import React, { PureComponent } from 'react';

import { Card, Table } from 'antd';

import Authorized from 'utils/Authorized';

import ModalEditPayStatus from '../../../components/ModalEditPayStatus';
import ModalAddPayRecord from '../../../components/ModalAddPayRecord';

import { transformOrderPayRecords } from '../../../transform';
import { getOptionLabelForValue, orderStatusOptions, payStatusOptions } from '../../../attr';

class OrderPaysForCostInfo extends PureComponent {
   static defaultProps = {};

   state = {
     loading: false,
   }

   getColumns = () => {
     const { orders, dispatch } = this.props;
     const columns = [
       {
         title: '支付单号',
         dataIndex: 'payOrder',
         key: 'payOrder',
       },
       {
         title: '第三方支付流水号',
         dataIndex: 'thirdPartTransactionId',
         key: 'thirdPartTransactionId',
       },
       {
         title: '支付方式',
         dataIndex: 'paymentMethodName',
         key: 'paymentMethodName',
       },
       {
         title: '支付状态',
         dataIndex: 'statusFormat',
         key: 'statusFormat',
       },
       {
         title: '支付时间',
         dataIndex: 'finishPaidTimeFormat',
         key: 'finishPaidTimeFormat',
       },
       {
         title: '待付金额',
         dataIndex: 'amountFormat',
         key: 'amountFormat',
       },
       {
         title: '已付金额',
         dataIndex: 'amountPaidFormat',
         key: 'amountPaidFormat',
       },
     ];

     if (getOptionLabelForValue(orderStatusOptions)(orders?.detail?.orderStatus) === '待支付' ||
        getOptionLabelForValue(orderStatusOptions)(orders?.detail?.orderStatus) === '待付尾款'
     ) {
       columns.push({
         title: '操作',
         dataIndex: 'oper',
         render: (text, record) => {
           if (record.isAdd) {
             return (
               <a onClick={() => {
                this.handleDeleteAddRecord(record);
              }}
               >删除
               </a>
             );
           }
           return (getOptionLabelForValue(payStatusOptions)(record.status) === '未支付' ||
           getOptionLabelForValue(payStatusOptions)(record.status) === '待付尾款')
             ? (
               <Authorized authority={['OPERPORT_JIAJU_ORDERDETAILS_MODIFYPAYMENT']}>
                 <ModalEditPayStatus
                   record={record}
                   dispatch={dispatch}
                   orders={orders}
                   params={{ orderSn: orders?.detail?.orderSn, ...record }}
                 />
               </Authorized>
             ) : null;
         },
       });
     }

     return columns;
   }

   handleDeleteAddRecord = ({ paymentRecordId }) => {
     const { orders = {}, dispatch } = this.props;
     const { addOrderPayListForLocal = [] } = orders;

     dispatch({
       type: 'orders/addOrderPayListForLocal',
       payload: addOrderPayListForLocal?.filter((item) => {
         return item?.paymentRecordId !== paymentRecordId;
       }),
     });
   }

   render() {
     const { className, orders, dispatch } = this.props;
     const { loading } = this.state;
     const statusTag = getOptionLabelForValue(orderStatusOptions)(orders?.detail?.orderStatus);
     return (
       <Card
         type="inner"
         title="订单支付"
         className={`${className}`}
         extra={(statusTag === '待支付' || statusTag === '待付尾款') ? (
           <Authorized authority={['OPERPORT_JIAJU_ORDERDETAILS_ADDPAYMENT']}>
             <ModalAddPayRecord dispatch={dispatch} orders={orders} params={orders?.detail} />
           </Authorized>
         ) : null}
       >
         <Table
           dataSource={
            transformOrderPayRecords(
               orders?.detail?.paymentRecordVOList,
               orders?.addOrderPayListForLocal,
               orders?.editOrderPayStatusListForLocal
            )
          }
           columns={this.getColumns()}
           pagination={false}
           loading={loading}
           rowKey="paymentRecordId"
         />
       </Card>
     );
   }
}

export default OrderPaysForCostInfo;
