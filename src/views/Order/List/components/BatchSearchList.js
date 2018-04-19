/*
 * @Author: wuhao
 * @Date: 2018-04-08 16:18:03
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-04-18 15:44:53
 *
 * 订单列表操作和过滤组件
 */


import React, { PureComponent } from 'react';
import { Batch } from '../../../../components/PanelList';

import TableSearchFilterBar from '../../../../components/TableSearchFilterBar';
import ModalExportBusiness from '../../../../components/ModalExport/business';
import ModalRemarkGoods from './ModalRemarkGoods';

class BatchSearchList extends PureComponent {
  static defaultProps = {};

  state = {}

  /**
   * 获取tab选项卡标签和搜索条件
   */
  getRadioOptions = () => {
    return [
      {
        label: '全部订单',
        value: {
          orderStatus: '',
        },
      },
      {
        label: '待支付',
        value: {
          orderStatus: '1',
        },
      },
      {
        label: '待审核',
        value: {
          orderStatus: '2',
        },
      },
      {
        label: '待付尾款',
        value: {
          orderStatus: '3',
        },
      },
      {
        label: '待发货',
        value: {
          orderStatus: '4',
        },
      },
      {
        label: '待收货',
        value: {
          orderStatus: '5',
        },
      },
      {
        label: '已完成',
        value: {
          orderStatus: '6',
        },
      },
      {
        label: '已取消',
        value: {
          orderStatus: '7',
        },
      },
      {
        label: '售后订单',
        value: {
          orderStatus: '8',
        },
      },
    ];
  }

  /**
   * 获取 订单基本信息 导出字段
   */
  getOrderBaseInfoExportField = () => {
    return [
      '订单号',
      '所属商家',
      '订单生成时间',
      '收货人姓名',
      '收货人电话',
      '收货人地址',
      '配送地区',
      '买家账号(用户ID)',
      '订单总金额',
      '订单优惠金额',
      '订单支付方式',
      '订单处理状态',
      '订单支付状态',
      '所属项目',
      '订单支付信息',
      '是否异常',
    ];
  }

  /**
   * 获取 订单商品信息 导出字段
   */
  getOrderProductInfoExportField = () => {
    return [
      '订单号',
      '所属商家',
      '订单生成时间',
      '所属项目',
      '商品名称',
      '商品分类',
      '数量',
      '买家账号(用户ID)',
      '商品总价',
      '处理状态',
      '支付状态',
      '收货人姓名',
      '收货人手机',
      '收货人地址',
      '配送地区',
      '商品单价',
      '商品规格',
    ];
  }

  /**
   * 获取 订单信息 导出字段
   */
  getOrderInfoExportField = () => {
    return [
      '订单号',
      '所属商家',
      '订单来源',
      '订单生成时间',
      '收货人电话',
      '收货人地址',
      '收货人姓名',
      '配送地区',
      '配送方式',
      '买家账号(用户ID)',
      '订单总金额',
      '物流商',
      '物流单号',
      '订单运费',
      '支付方式',
      '购物券支付',
      '订单处理状态',
      '订单支付状态',
      '订单完成时间',
      '所属项目',
      '发票信息',
      '商品ID',
      '商品名称',
      '商品空间',
      '数量',
      '商品单价',
      '商品总价',
      '商品规格',
      '是否赠品',
      '商品功能',
      '商品风格',
      '商品材质',
      '所属厂商',
      '是否超额',
      '流水号',
    ];
  }

  /**
   * 导出Modal Options参数
   */
  getExportModalOptions = () => {
    return [
      {
        title: '订单基本信息',
        fields: this.getOrderBaseInfoExportField(),
        params: {
          code: 1,
        },
      },
      {
        title: '订单商品信息',
        fields: this.getOrderProductInfoExportField(),
        params: {
          code: 2,
        },
      },
      {
        title: '订单信息',
        fields: this.getOrderInfoExportField(),
        params: {
          code: 3,
        },
      },
    ];
  }

  /**
   * tab更改后回调
   */
  handleChange = (values) => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'orders/list',
      payload: values,
    });
  }

  convertExportParam = ({ exportFileName, ...values }) => {
    const { code } = values;
    return {
      param: {
        condition: { userId: '', userType: 1, beanType: 0, bindStatus: -1, enable: '', token: 'i9o64i1se5kiAzzN3VRxSQ%3D%3D' },
      },
      totalCount: 100,
      sucTitle: code === 2 ? '订单商品' : null,
    };
  }

  render() {
    return (
      <Batch {...this.props}>

        <div>
          <ModalExportBusiness
            {...this.props}
            title="订单"
            tabOptions={this.getExportModalOptions()}
            prefix={124002}
            dataUrl="http://dev.assets-api.hd/assetsAdmin/exportAccount"
            convertParam={this.convertExportParam}
            // routerUrl="/goods/list"
            // skipUrl="http://www.baidu.com"
          />
          <ModalRemarkGoods />
        </div>

        <TableSearchFilterBar
          {...this.props}
          radioOptions={this.getRadioOptions()}
          onChange={this.handleChange}
        />

      </Batch>
    );
  }
}

export default BatchSearchList;
