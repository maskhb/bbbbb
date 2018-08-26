/*
 * @Author: wuhao
 * @Date: 2018-04-23 10:42:56
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-08-08 16:57:10
 *
 * 底部操作栏
 */

import React, { PureComponent } from 'react';

import { Button, message } from 'antd';

import Authorized from 'utils/Authorized';

import { getOptionLabelForValue, orderStatusOptions } from '../../../attr';

class FooterOperBar extends PureComponent {
   static defaultProps = {};

   state = {
     saveLoading: false,
   }

   clearSumbitData = async () => {
     const { dispatch } = this.props;
     await dispatch({
       type: 'orders/addOrderPayListForLocal',
       payload: [],
     });

     await dispatch({
       type: 'orders/editOrderPayStatusListForLocal',
       payload: [],
     });
   }

   reqAddPay = async ({
     orderSn,
     money,
     paymentMethodCode,
     payStatus,
     transactionId = '',
   }) => {
     const { dispatch } = this.props;
     await dispatch({
       type: 'orders/payRecordAdd',
       payload: {
         orderSn,
         money,
         paymentMethodCode,
         payStatus,
         transactionId,
       },
     });

     return this.props?.orders?.payRecordAdd;
   }

   reqEditPay = async ({
     orderSn,
     paymentRecordId,
     money,
     paymentMethodCode,
     payStatus,
     transactionId,
   }) => {
     const { dispatch } = this.props;

     await dispatch({
       type: 'orders/payRecordUpdate',
       payload: {
         orderSn,
         paymentRecordId,
         money,
         paymentMethodCode,
         payStatus,
         transactionId,
       },
     });

     return this.props?.orders?.payRecordUpdate;
   }

   handleDefaultOk = async () => {
     const { orders, dispatch } = this.props;
     const { addOrderPayListForLocal = [], editOrderPayStatusListForLocal = [] } = orders;

     try {
       for (const addItem of addOrderPayListForLocal) {
       const payRecordAdd = await this.reqAddPay(addItem); //eslint-disable-line
         if (payRecordAdd === null) {
           throw new Error();
         }
       }

       for (const editItem of editOrderPayStatusListForLocal) {
      const payRecordEdit = await this.reqEditPay(editItem); //eslint-disable-line
         if (payRecordEdit === null) {
           throw new Error();
         }
       }

       message.success('保存成功');
       //  await this.clearSumbitData();

       //  await dispatch({
       //    type: 'orders/detail',
       //    payload: {
       //      orderId: this.props.match.params.id,
       //    },
       //  });
     } catch (e) {
       message.error('保存失败');
     }

     await this.clearSumbitData();

     await dispatch({
       type: 'orders/detail',
       payload: {
         orderId: this.props.match.params.id,
       },
     });
   }

   callbackSave = async () => {
     const { onSave } = this.props;

     if (onSave) {
       await onSave();
     } else {
       await this.handleDefaultOk();
     }
   }

   handleClose = () => {
     this.clearSumbitData();
     window.close();
   }

   handleScollToTop = () => {
     window.scrollTo(0, 0);
   }

   handleSave = async () => {
     this.setState({
       saveLoading: true,
     });

     await this.callbackSave();

     this.setState({
       saveLoading: false,
     });
   }

   render() {
     const { className, orders = {}, collapsed } = this.props;
     const { detail = {} } = orders || {};
     const { orderStatus } = detail || {};
     const { saveLoading } = this.state;

     return (
       <div className={`${className}`}>
         <div className={`${collapsed ? 'collapsed' : ''}`}>
           {
            (
              getOptionLabelForValue(orderStatusOptions)(orderStatus) === '待支付' ||
              getOptionLabelForValue(orderStatusOptions)(orderStatus) === '待付尾款'
            ) && (
            <Authorized authority={['OPERPORT_JIAJU_ORDERDETAILS_ADDPAYMENT', 'OPERPORT_JIAJU_ORDERDETAILS_MODIFYPAYMENT']}>
              <Button size="large" type="primary" loading={saveLoading} onClick={this.handleSave}>保存</Button>
            </Authorized>
            )}

           <Button size="large" onClick={this.handleScollToTop}>返回顶部</Button>
           <Button size="large" type="dashed" onClick={this.handleClose}>关闭</Button>
         </div>
       </div>
     );
   }
}

export default FooterOperBar;
