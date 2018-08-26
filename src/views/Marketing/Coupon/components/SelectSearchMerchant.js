import React, { PureComponent } from 'react';
import { connect } from 'dva';
import SelectSearch from 'components/input/SelectSearch';

@connect(({ marketing, loading }) => ({
  marketing,
  loading: loading.effects['marketing/queryMerchant'],
}))
class SelectSearchMerchant extends PureComponent {
  // 搜索条件 - 所属商家
  handleSearchMerchant = async (value) => {
    const { dispatch } = this.props;
    const merchantBaseVo = Number(value) ? { merchantId: Number(value) } : { merchantName: value };
    await dispatch({
      type: 'marketing/queryMerchant',
      payload: {
        merchantBaseVo,
      },
    }).then((res = []) => {
      const data = res?.map(v => ({
        value: v.merchantId,
        text: v.merchantName,
      }));

      return data;
    });
  }

  render() {
    const { onChange, ...props } = this.props;

    return (
      <SelectSearch
        {...props}
        onChange={onChange}
        onSearch={this.handleSearchMerchant}
      />
    );
  }
}

export default SelectSearchMerchant;
