import React from 'react';
import PanelList, { Search, Table } from 'components/PanelList';
import { rules } from 'components/input';
import { Input } from 'antd';
import _ from 'lodash';
import getColumns from './GoodsColumns';

export default class ModalGoodsList extends React.Component {
  componentDidMount() {
    this.handleSearch({
      pageInfo: {
        currPage: 1,
        pageSize: 10,
      },
    });
  }

  handleSearch = (values) => {
    const { dispatch, form, selectedList, goodsPackage } = this.props;
    const { pathname } = this.props.location;
    const isAdd = pathname.match('/add');
    const merchantId = isAdd ? Number(form.getFieldValue('merchantId')) : Number(goodsPackage?.detail?.merchantId);
    return dispatch({
      type: 'goodsPackage/queryPackageGoods',
      payload: {
        merchantId,
        ...values,
        neqSkuIds: selectedList.map(item => item.skuId),
        goodsType: 2,
      },
      list: values.pageInfo.currPage === 1 ? [] : goodsPackage?.packageGoodsList?.allList,
    });
  }

  render() {
    const { goodsPackage, selectedRows } = this.props;
    const searchDefault = {};
    const { packageGoodsList: goodsList } = goodsPackage;

    return (
      <PanelList>
        <Search
          ref={(inst) => {
            this.search = inst;
          }}
          onSearch={this.handleSearch}
        >
          <Search.Item label="商品名称：" simple>
            {
              ({ form }) => (
                form.getFieldDecorator('goodsName', {
                  rules: rules([{
                    max: 20,
                  }]),
                })(
                  <Input maxLength="20" placeholder="请输入商品名称" />
                )
              )
            }
          </Search.Item>
          <Search.Item label="SKU编码：" simple>
            {
              ({ form }) => (
                form.getFieldDecorator('skuCode', {
                  rules: rules([{
                    max: 20,
                  }]),
                })(
                  <Input maxLength="20" placeholder="请输入SKU编码" />
                )
              )
            }
          </Search.Item>
        </Search>
        <Table
          loading={goodsPackage?.packageGoodsLoading}
          searchDefault={searchDefault}
          columns={getColumns(this, searchDefault)}
          dataSource={_.unionBy(goodsList?.dataList, 'skuId')}
          pagination={goodsList?.pagination}
          rowKey="skuId"
          selectedRows={selectedRows}
          ref={(inst) => { this.table = inst; }}
        />
      </PanelList>
    );
  }
}
