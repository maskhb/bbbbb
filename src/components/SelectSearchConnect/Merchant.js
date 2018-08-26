import React, { PureComponent } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import SelectSearch from 'components/input/SelectSearch';

@connect(({ business }) => ({
  business,
}))
class SelectSearchConnectMerchant extends PureComponent {
  // 搜索条件 - 所属商家
  handleSearchMerchant = (value) => {
    const { dispatch, unionMerchantId, onSearchBefore } = this.props;

    if (_.isFunction(onSearchBefore)) {
      onSearchBefore(value);
    }

    return dispatch({
      type: 'business/queryMerchantOfUnionList',
      payload: {
        merchantTypeList: [2],
        unionMerchantId,
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
    const { onChange, unionMerchantId, ...props } = this.props;

    return (
      <SelectSearch
        {...props}
        onChange={onChange}
        onSearch={this.handleSearchMerchant}
      />
    );
  }
}

export default SelectSearchConnectMerchant;
