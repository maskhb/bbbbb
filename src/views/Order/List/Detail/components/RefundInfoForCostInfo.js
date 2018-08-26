/*
 * @Author: wuhao
 * @Date: 2018-04-20 16:32:07
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-20 09:16:13
 *
 * 费用信息 --  退款信息
 */

import React, { PureComponent } from 'react';

import { Card, Table } from 'antd';

import { goToNewWin } from 'utils/utils';

class RefundInfoForCostInfo extends PureComponent {
   static defaultProps = {};

   state = {
   }

   getColumns = () => {
     return [
       {
         title: '退款单号',
         dataIndex: 'refundSn',
         render: (text, record) => {
           return (
             <a onClick={() => {
                goToNewWin(record?.showRefundNoDetailFormat);
              }}
             >{text}
             </a>
           );
         },
       },
       {
         title: '申请退款时间',
         dataIndex: 'createdTimeFormat',
       },
       {
         title: '申请退款金额',
         dataIndex: 'refundAmountFormat',
       },
       {
         title: '退款方式',
         dataIndex: 'refundMethod',
       },
       {
         title: '退款状态',
         dataIndex: 'refundStatusFormat',
       },
       {
         title: '确认退款时间',
         dataIndex: 'refundTimeFormat',
       },
       {
         title: '实际退款金额',
         dataIndex: 'hasRefundAmountFormat',
       },
     ];
   }

   render() {
     const { className, orders } = this.props;
     const { detail } = orders || {};
     const { refundVOList } = detail || {};

     return refundVOList && refundVOList?.length > 0 ? (
       <Card
         type="inner"
         title="退款信息"
         className={`${className}`}
       >
         <Table
           dataSource={refundVOList}
           columns={this.getColumns()}
           pagination={false}
         />
       </Card>
     ) : null;
   }
}

export default RefundInfoForCostInfo;
