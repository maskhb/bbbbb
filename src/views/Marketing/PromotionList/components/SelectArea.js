import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { optionsToHtml } from 'components/DataTransfer';
import ModalTransferSearch from 'components/ModalTransferSearch';
import { connect } from 'dva';
import { formatAllOpion } from 'utils/utils';
import { areaOptionsDetail } from '../attr';
import GoodsCategory from './GoodsCategory';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))


export default class SelectArea extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const strArr = [];
    const visible = this.props?.value?.type;
    const selectRow = this.props?.value?.row ||
      this.props?.value?.listPromotionRuleCouponScopeVoS || [];

    const areaOptionsTmp = [...areaOptionsDetail];
    if (this.props.belongType === 2 || this.props.isOut) {
      areaOptionsTmp.shift();
    }


    selectRow.forEach((v) => {
      strArr.push(v.label);
    });

    return (
      <div>
        <Select
          disabled={this.props.disabled}
          allowClear
          placeholder="请选择"
          onChange={(v) => {
      this.props.onChange({ type: v });
}}
          value={visible || undefined}
        >
          {optionsToHtml(areaOptionsTmp)}
        </Select>
        {(strArr.length > 0 && this.state.visible !== 1) ? <p>已选：{strArr.join(',')}</p> : ''}

        {visible === 3 ?
    (
      <GoodsCategory
        {...this.props}
        showBtn={!this.props.disabled}
        onChange={(data) => {
        this.props.onChange({ type: visible, row: data });
      }}
      />
    ) : ''}

        {visible === 2 ?
    (
      <ModalTransferSearch
        disabled={this.props.disabled}
        btnTitle="选择"
        hideBtn={this.props.disabled}
        modalTitle="指定供应商"
        isShowPage
        onOk={(key, _row) => {
        let row = _row;

        row = row.map((v) => {
          return { label: v.name, value: v.key };
        });
        this.props.onChange({ type: visible, row });
      }}
        transfer={
        {
          titles: ['可选供应商', '已选供应商'],
            showSearch: true,
        }}

        onSearch={async (data) => {
        const { dispatch, merchantName } = this.props;

        let payload = {
          merchantName: data?.values?.merchantName || merchantName,
          keyName: 'queryMerchantList',
          statusList: [2],
          pageInfo: {
            currPage: data?.current,
            pageSize: 20,
          },
        };

        payload = formatAllOpion(payload);

        await dispatch({
          type: 'common/queryMerchantList',
          payload,
        });

        const { common: { queryMerchantList: { totalCount: total, dataList } } } = this.props;
        return { total,
          dataSource: dataList.map((v) => {
            return {
              key: v.merchantId,
              name: v.merchantName,
              desc: v.summary,
              img: v.logoImgUrl,
            };
          }) };
      }
      }
      />
    ) : ''}
        {visible === 4 ?
    (
      <ModalTransferSearch
        disabled={this.props.disabled}
        btnTitle="选择"
        hideBtn={this.props.disabled}
        modalTitle="指定商品"
        isShowSearch
        selectedKeys={{ keys: selectRow.map(r => r.value) }}
        isShowPage
        isNeedNum={false}
        maxLength={10}
        onOk={(key, _row) => {
          let row = _row;
        row = row.map((v) => {
          return { label: v.name, value: v.key };
        });

        this.props.onChange({ type: visible, row });
      }}
        transfer={
        {
          titles: ['可选商品', '已选商品'],
            showSearch: true,
        }}

        onSearch={async (data) => {
        const { dispatch, merchantId } = this.props;

        let payload = {
          merchantId,
          goodsName: data?.values?.goodsName,
          skuCode: data?.values?.skuId,
          skuIdsStr: data?.values?.skuIdsStr,
          pageInfo: {
            currPage: data?.current,
            pageSize: data?.pageSize || 5,
          },
        };

        payload = formatAllOpion(payload);


        await dispatch({
          type: 'common/queryPromotionGoodsByPage',
          payload,
        });

        const {
          common: {
          queryPromotionGoodsByPage: { totalCount: total, dataList } },
        } = this.props;

        return { total,
          dataSource: dataList.map((v) => {
            const sku = v.skuPropertyRelationVoSList || [];
            return {
              key: v.skuId,
              name: v.goodsName,
              desc: sku.map((val) => { return `${val.propertyKey}:${val.propertyValue}`; }).join(','),
              img: (v.goodsImgVos.find((val) => { return val.isMain; })?.imgUrl ||
              v.goodsImgVos.find((val) => { return val.imgUrl; })?.imgUrl),
            };
          }) };
      }
      }
      />
    ) : ''}
      </div>
    );
  }
}
