/*
 * @Author: wuhao
 * @Date: 2018-05-02 16:56:42
 * @Last Modified by: wuhao
 * @Last Modified time: 2018-05-28 15:26:06
 *
 * 选择商品弹框
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';

import ModalSelectGoods from './index';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class ModalSelectGoodsBusiness extends PureComponent {
  static defaultProps = {};

  state = {}


  onSearch = async ({ searchKey: goodsName, current, pageSize }) => {
    const { dispatch, params = {} } = this.props;
    const { merchantId } = params;
    await dispatch({
      type: 'common/orderGoodsListByPage',
      payload: {
        goodsBaseVoList: {
          goodsName,
          merchantId,
          remainNumMin: 1,
          status: [2],
          goodsType: 2,
          pageInfo: {
            currPage: current,
            pageSize,
          },
        },
      },
    });
  }

  render() {
    const { common } = this.props;
    const { orderGoodsListByPage } = common || {};
    const { list, pagination } = orderGoodsListByPage || {};
    const dataSourceList = (list || []).map((item) => {
      return {
        ...item,
        goodsSkuVoList: (item?.goodsSkuVoList || []).map((goodsItem) => {
          return {
            ...goodsItem,
            propertyValue: (goodsItem?.skuPropertyRelationVoSList || []).map((propertyItem) => {
              return propertyItem.propertyValue;
            }).join(','),
            goodsNum: goodsItem.remainNum,
          };
        }),
      };
    });
    return (
      <ModalSelectGoods
        {...this.props}
        dataSource={{
          list: dataSourceList,
          pagination,
        }}
        onSearch={this.onSearch}
      />
    );
  }
}

export default ModalSelectGoodsBusiness;
