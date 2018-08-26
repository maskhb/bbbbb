/*
 * 商家选择框  --  业务组件
 * value:{
 *  factoryId,
 *  factoryName,
 *  merchantId,
 *  merchantName,
 * }
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';

import MerchantSelect from './MerchantSelect';

@connect(({ common, loading }) => ({
  common,
  loading: loading.models.common,
}))
class BusinessMerchantSelect extends PureComponent {
  static defaultProps = {
    value: PropTypes.object,
  };

  handleSearchMerchant = (payload) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'common/queryMerchantList',
      payload,
    });
  }

  resetMerchant = (keyName = 'merchantList') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {
        [keyName]: [],
      },
    });
  }

  handleChange = (value) => {
    this.props.onChange(value);
  }

  render() {
    const { common, ...otherProps } = this.props;

    return (
      <MerchantSelect
        {...common}
        {...otherProps}
        onChange={this.handleChange}
        handleSearchMerchant={this.handleSearchMerchant}
        resetMerchant={this.resetMerchant}
      />
    );
  }
}

export default BusinessMerchantSelect;
