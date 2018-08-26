import React, { PureComponent } from 'react';
import { connect } from 'dva';
import SelectSearch from 'components/input/SelectSearch';

@connect(({ business }) => ({
  business,
}))
class SelectSearchConnectFactory extends PureComponent {
  // 搜索条件 - 所属商家
  handleSearchMerchant = (value) => {
    const { dispatch } = this.props;

    return dispatch({
      type: 'business/queryUnionMerchantList',
      payload: {
        merchantTypeList: [1, 3],
        merchantName: value,
      },
    }).then((res = {}) => {
      const data = res?.list?.map(item => ({
        text: item.merchantName,
        value: item.merchantId,
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

export default SelectSearchConnectFactory;
