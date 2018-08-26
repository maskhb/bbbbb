/*
 * @Author: wuhao
 * @Date: 2018-04-08 16:18:03
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-07-10 14:05:54
 *
 * 订单列表操作和过滤组件
 */


import React, { PureComponent } from 'react';
import { Batch } from 'components/PanelList';

import TableSearchFilterBar from 'components/TableSearchFilterBar';
import ModalExportBusiness from 'components/ModalExport/business';

import Authorized from 'utils/Authorized';

import { transformSearchParam } from '../../transform';

import { orderBaseInfo, orderProductInfo, orderInfo } from '../exportField';

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
          orderStatus: undefined,
          orderSource: undefined,
        },
      },
      {
        label: '待支付',
        value: {
          orderStatus: 1,
          orderSource: undefined,
        },
      },
      {
        label: '待审核',
        value: {
          orderStatus: 2,
          orderSource: undefined,
        },
      },
      {
        label: '待付尾款',
        value: {
          orderStatus: 3,
          orderSource: undefined,
        },
      },
      {
        label: '待发货',
        value: {
          orderStatus: 4,
          orderSource: undefined,
        },
      },
      {
        label: '待收货',
        value: {
          orderStatus: 5,
          orderSource: undefined,
        },
      },
      {
        label: '已完成',
        value: {
          orderStatus: 6,
          orderSource: undefined,
        },
      },
      {
        label: '已取消',
        value: {
          orderStatus: 7,
          orderSource: undefined,
        },
      },
      {
        label: '售后订单',
        value: {
          orderStatus: undefined,
          orderSource: 3,
        },
      },
    ];
  }

  /**
   * 导出Modal Options参数
   */
  getExportModalOptions = () => {
    return [
      {
        title: '订单基本信息',
        fields: orderBaseInfo,
        params: {
          prefix: 801001,
          exportType: 0,
        },
      },
      {
        title: '订单商品信息',
        fields: orderProductInfo,
        params: {
          prefix: 801002,
          exportType: 1,
        },
      },
      {
        title: '订单信息',
        fields: orderInfo,
        params: {
          prefix: 801003,
          exportType: 2,
        },
      },
    ];
  }

  /**
   * tab更改后回调
   */
  handleChange = async (values) => {
    const { dispatch } = this.props;

    const params = transformSearchParam(values);

    await dispatch({
      type: 'orders/list',
      payload: params,
    });

    await dispatch({
      type: 'orders/queryOrdeListTotalCount',
      payload: params,
    });
  }

  /**
   * 获取导出条数
   */
  converExportTotal = async (reqParam) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'orders/queryExportTotalCount',
      payload: reqParam,
    });

    const { orders } = this.props;
    const { queryExportTotalCount } = orders || {};
    return queryExportTotalCount || 0;
  }

  /**
   * 导出参数转换
   */
  convertExportParam = async ({ exportFileName, prefix, exportType }) => {
    const { searchDefault, stateOfSearch } = this.props;
    const { orderQueryVO } = transformSearchParam({ ...searchDefault, ...stateOfSearch });
    const { pageInfo, ...otherSearch } = orderQueryVO || {};

    const reqParam = {
      platform: 1,
      exportType,
      fileName: exportFileName,
      orderQueryVO: {
        ...otherSearch,
        pageInfo: {
          currPage: 1,
          pageSize: 500,
        },
      },
    };

    const exportTotal = await this.converExportTotal(reqParam);

    return {
      param: {
        param: {
          ...reqParam,
        },
      },
      totalCount: exportTotal || 0,
      sucTitle: prefix === 801002 ? '订单商品' : null,
      dataUrl: '/ht-mj-order-server/order/admin/exportOrderInfo',
      prefix,
    };
  }

  render() {
    return (
      <Batch {...this.props}>

        <div>
          <Authorized authority={['OPERPORT_JIAJU_ORDERLIST_EXPORT']}>
            <ModalExportBusiness
              {...this.props}
              title="订单"
              params={this.getExportModalOptions()}
              convertParam={this.convertExportParam}
              exportModalType={1}
            />
          </Authorized>
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
